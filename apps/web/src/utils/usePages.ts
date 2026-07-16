import type { PageEntity } from "../../../shared/types";
import { makeSlugListHook } from "./makeEntityHook";

export const usePages = makeSlugListHook<PageEntity>(
  "/api/pages",
  (slug) => ({ slug, page_title: slug, page_description: "", sidebar: "default", content: "", tags: [] }),
);
