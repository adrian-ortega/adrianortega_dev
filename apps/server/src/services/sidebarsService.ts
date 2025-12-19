import { ENTITY_TYPE, SidebarEntity } from "../types";
import { getEntityBySlug } from "./mdService";

export async function readSidebarFile(slug: string): Promise<SidebarEntity> {
  const sidebar = await getEntityBySlug<SidebarEntity>(ENTITY_TYPE.SIDEBAR, slug);
  if (!sidebar) {
    throw new Error(`Sidebar not found`);
  }
  return sidebar;
}
