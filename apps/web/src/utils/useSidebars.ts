import { useState } from "react";
import type { SidebarEntity } from "../../../shared/types";

type SidebarResponse = SidebarEntity | null;

type UseSidebarsReturn = [
  SidebarEntity[],
  {
    loading: boolean;
    fetchBySlug: (slug: string) => Promise<SidebarEntity | null>;
  },
];

export const useSidebars = (): UseSidebarsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<SidebarEntity[]>([]);

  const fetchBySlug = async (slug: string): Promise<SidebarEntity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sidebars/${slug}`);
      const responseData: SidebarResponse = await response.json();
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
