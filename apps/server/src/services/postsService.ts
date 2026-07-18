import {
  PostEntity,
  PostNavLink,
  PostNavigation,
  RelatedPost,
  MdEntity,
  ENTITY_TYPE,
} from "../../../shared/types";
import { objectHasProp } from "../utils/helpers";
import { getEntities, getEntityBySlug, getFiles } from "./mdService";

const getRequiredKeysForPostPublication = (): string[] => {
  return ["created_at"];
};

const isPostInDraftMode = (post: PostEntity) => {
  return objectHasProp(post, "draft")
    ? !!post.draft
    : getRequiredKeysForPostPublication().some(
      (key) => !objectHasProp(post, key)
    );
}

const postTransformer = (entity: MdEntity): PostEntity => {
  const post: PostEntity = entity as PostEntity;
  if (!objectHasProp(entity, 'description')) {
    post.description = '';
  }

  if (!objectHasProp(entity, "tags")) {
    post.tags = [];
  }
  post.featured = !!post.featured;
  post.draft = isPostInDraftMode(post);
  return post;
}

export async function listPostsByCategory(tag?: string): Promise<PostEntity[] | null> {
  const posts = await getEntities<PostEntity>(ENTITY_TYPE.POST, [postTransformer]);
  if (!posts) return null;

  const filteredPosts = tag ? posts?.filter((post) => post.tags.includes(tag) && !post.draft)
    : posts.filter((post) => !post.draft);
  
  filteredPosts.sort((a: PostEntity, b: PostEntity) => {
    const dateA = new Date(a.created_at ?? 0).getTime();
    const dateB = new Date(b.created_at ?? 0).getTime();
    return dateB - dateA;
  });
  
  return filteredPosts;
}

export async function readPostFile(slug: string): Promise<PostEntity | null> {
  const post = await getEntityBySlug<PostEntity>(ENTITY_TYPE.POST, slug, [postTransformer]);
  if (!post) {
    throw new Error(`Post not found`);
  }
  return post;
};

const toNavLink = (post: PostEntity): PostNavLink => ({
  slug: post.slug,
  title: post.title,
});

/**
 * Next/prev neighbors for a post, based on the same newest-first
 * published order as the posts listing. `next` is the newer post,
 * `prev` the older one. Drafts are never neighbors; a draft post
 * itself gets { prev: null, next: null }.
 */
export async function getPostNavigation(slug: string): Promise<PostNavigation> {
  const empty: PostNavigation = { prev: null, next: null };
  const posts = await listPostsByCategory();
  if (!posts) return empty;

  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return empty;

  return {
    next: index > 0 ? toNavLink(posts[index - 1]) : null,
    prev: index < posts.length - 1 ? toNavLink(posts[index + 1]) : null,
  };
}

/**
 * Related posts ranked by shared tag count, most recent first among
 * equals. With no tag overlap this degrades to "latest other posts",
 * so the component below a post never renders empty (unless there
 * are no other posts at all). Returns null for an unknown slug so
 * the controller can 404.
 */
export async function getRelatedPosts(
  slug: string,
  limit = 3,
): Promise<RelatedPost[] | null> {
  const posts = await listPostsByCategory();
  const current = await readPostFile(slug).catch(() => null);
  if (!posts || !current) return null;

  const currentTags = new Set(current.tags);

  return posts
    .filter((post) => post.slug !== slug)
    .map((post, index) => ({
      post,
      index, // posts are newest-first, so index doubles as recency rank
      score: post.tags.reduce(
        (n, tag) => n + (currentTags.has(tag) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ post }) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      thumbnail: post.thumbnail,
      tags: post.tags,
      created_at: post.created_at,
    }));
}
