import { useMemo } from "react";
import type { PostEntity } from "../../../../shared/types";
import { Box } from "../Core/Box";
import { PostTags } from "./PostTags";
import { Link } from "react-router";
import { to } from "../../routes/paths";
import { format } from "date-fns";
import { Group } from "../Core/Group";
import { IconCircleFilled } from "@tabler/icons-react";

type PostPreviewProps = {
  post: PostEntity;
};

export function PostPreview({ post }: PostPreviewProps) {
  const descriptionParagraphs = useMemo(() => {
    return post.description.split("\n").filter((p: string) => p.trim() !== "");
  }, [post.description]);
  return (
    <Box className="PostPreview-root">
      <h2 className="PostPreview-title">
        <Link to={to.post(post.slug)}>{post.title}</Link>
      </h2>
      <Group alignItems="center">
        <Box className="PostPreview-published">
          {format(post.created_at as string, "PP pp")}
        </Box>
        <IconCircleFilled size={4} color="var(--colors-primary-7)" />
        <PostTags className="PostPreview-tags" post={post} />
      </Group>
      <Box className="PostPreview-description">
        {descriptionParagraphs.map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Box>
    </Box>
  );
}
