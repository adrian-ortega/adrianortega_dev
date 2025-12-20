import { useMemo } from "react";
import type { PostEntity } from "../../../../shared/types";
import { Box } from "../Core/Box";
import { PostTags } from "./PostTags";

type PostPreviewProps = {
  post: PostEntity;
};

export function PostPreview({ post }: PostPreviewProps) {
  const descriptionParagraphs = useMemo(() => {
    return post.description.split("\n").filter((p) => p.trim() !== "");
  }, [post.description]);
  return (
    <Box className="PostPreview-root" style={{ marginBottom: 24 }}>
      <h2>{post.title}</h2>
      <PostTags post={post} />
      <Box className="PostPreview-description">
        {descriptionParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Box>
    </Box>
  );
}
