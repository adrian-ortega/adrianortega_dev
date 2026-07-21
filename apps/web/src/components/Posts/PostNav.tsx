import { Link } from "react-router";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { PostNavigation } from "../../../../shared/types";
import { Box } from "../Core/Box";
import { to } from "../../routes/paths";

type PostNavProps = {
  navigation?: PostNavigation | null;
};

export function PostNav({ navigation }: PostNavProps) {
  const prev = navigation?.prev ?? null;
  const next = navigation?.next ?? null;

  if (!prev && !next) return null;

  return (
    <Box component="nav" className="PostNav-root" aria-label="Post navigation">
      {prev ? (
        <Link className="PostNav-link PostNav-prev" to={to.post(prev.slug)}>
          <span className="PostNav-label">
            <IconArrowLeft size={16} />
            Older post
          </span>
          <span className="PostNav-linkTitle">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="PostNav-link PostNav-next" to={to.post(next.slug)}>
          <span className="PostNav-label">
            Newer post
            <IconArrowRight size={16} />
          </span>
          <span className="PostNav-linkTitle">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </Box>
  );
}
