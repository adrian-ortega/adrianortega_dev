import { ENTITY_TYPE, NotificationEntity } from "../../../shared/types";
import { getEntityBySlug } from "./mdService";

export async function readNotificationFile(slug: string): Promise<NotificationEntity> {
  const notification = await getEntityBySlug<NotificationEntity>(ENTITY_TYPE.NOTIFICATION, slug);
  if (!notification) {
    throw new Error(`Notification not found`);
  }
  return notification;
}
