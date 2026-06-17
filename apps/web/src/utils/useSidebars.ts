import type { SidebarEntity } from "../../../shared/types";
import { makeEntityHook } from "./makeEntityHook";

export const useSidebars = makeEntityHook<SidebarEntity>("/api/sidebars");

