import type { NotificationEntity } from "../../../shared/types";
import { makeEntityHook } from "./makeEntityHook";

export const useNotifications = makeEntityHook<NotificationEntity>("/api/notifications");

