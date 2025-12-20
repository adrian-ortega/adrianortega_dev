import type { PostEntity } from "../../../../shared/types";
import { Group } from "../Core/Group";

type PostTagsProps = {
  post: PostEntity;
}

export function PostTags({ post }: PostTagsProps) {
  return (
    <Group className="PostTags-root" gap={8} style={{ marginBottom: 8 }}>
      {post.tags.map((tagSlug) => (
        <a key={tagSlug} href={`/tags/${tagSlug}`}>
          {tagSlug}
        </a>
      ))}
    </Group>
  );
};
