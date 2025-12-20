import { useState } from "react";
import type { NotificationEntity } from "../../../shared/types";

type NotificationResponse = NotificationEntity | null;

type UseNotificationsReturn = [
  NotificationEntity[],
  {
    loading: boolean;
    fetchBySlug: (slug: string) => Promise<NotificationEntity | null>;
  },
];

export const useNotifications = (): UseNotificationsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<NotificationEntity[]>([]);

  const fetchBySlug = async (slug: string): Promise<NotificationEntity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications/${slug}`);
      const responseData: NotificationResponse = await response.json();
      setData((prevData) => {
        if (responseData) {
          const exists = prevData.find((page) => page.slug === slug);
          if (exists) {
            return prevData;
          }
          return [...prevData, responseData];
        }
        return prevData;
      });
      return responseData;
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }

    return null;
  };

  return [
    data,
    {
      loading,
      fetchBySlug,
    },
  ];
} 
