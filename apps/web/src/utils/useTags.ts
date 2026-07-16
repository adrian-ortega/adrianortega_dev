import type { TagEntity } from "../../../shared/types";
import { makeSlugListHook } from "./makeEntityHook";

export const useTags = makeSlugListHook<TagEntity>(
  "/api/tags",
  (slug) => ({ slug, name: slug, description: "", content: "" }),
);
