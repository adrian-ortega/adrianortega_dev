import { PostEntity, MdEntity, ENTITY_TYPE } from "../../../shared/types";
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
