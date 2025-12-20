import { useMemo } from "react";
import type { PostEntity } from "../../../../shared/types";
import { Box } from "../Core/Box";
import { PostTags } from "./PostTags";
import { Link } from "react-router";
import { to } from "../../routes/paths";
import { format } from "date-fns";

type PostPreviewProps = {
  post: PostEntity;
};

export function PostPreview({ post }: PostPreviewProps) {
  const descriptionParagraphs = useMemo(() => {
    return post.description.split("\n").filter((p) => p.trim() !== "");
  }, [post.description]);
  return (
    <Box className="PostPreview-root">
      <h2 className="PostPreview-title">
        <Link to={to.post(post.slug)}>{post.title}</Link>
      </h2>
      <p className="PostPreview-published">{format(post.created_at as string, "PP pp")}</p>
      <PostTags className="PostPreview-tags" post={post} />
      <Box className="PostPreview-description">
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Box>
    </Box>
  );
}
