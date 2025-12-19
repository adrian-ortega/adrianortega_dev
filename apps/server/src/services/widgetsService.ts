import { ENTITY_TYPE, WidgetEntity } from "../types";
import { getEntityBySlug } from "./mdService";

export async function readWidgetFile(slug: string): Promise<WidgetEntity> {
  const widget = await getEntityBySlug<WidgetEntity>(ENTITY_TYPE.WIDGET, slug);
  if (!widget) {
    throw new Error(`Widget not found`);
  }
  return widget;
}
