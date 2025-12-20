import { useState } from "react";
import type { WidgetEntity } from "../../../shared/types";

type WidgetResponse = WidgetEntity | null;

type UseWidgetsReturn = [
  WidgetEntity[],
  {
    loading: boolean;
    fetchBySlug: (slug: string) => Promise<WidgetEntity | null>;
  },
];

export const useWidgets = (): UseWidgetsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<WidgetEntity[]>([]);
  
  const fetchBySlug = async (slug: string): Promise<WidgetEntity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/widgets/${slug}`);
      const responseData: WidgetResponse = await response.json();
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
