import type { PostEntity } from "../../../../shared/types";
import { to } from "../../routes/paths";
import { classNames } from "../../utils/components/attributes";
import { Group, type GroupProps } from "../Core/Group";

type PostTagsProps = GroupProps & {
  post: PostEntity;
}

export function PostTags({ post, className }: PostTagsProps) {
  return (
    <Group className={classNames(["PostTags-root", className])} gap={8}>
      {post.tags.map((tagSlug: string) => (
        <a key={tagSlug} href={to.postsTag(tagSlug)} className="PostTags-tag">
          {tagSlug}
        </a>
      ))}
    </Group>
  );
};
