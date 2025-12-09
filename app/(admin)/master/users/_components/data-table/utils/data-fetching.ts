"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { preprocessSearch } from "@/components/data-table/utils";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function usePostsData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const title = searchParams.get("title") || undefined;
  const { data: session } = useSession();
  return useQuery({
    queryKey: [
      "posts",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      const s = preprocessSearch(search);
      if (s) params.append("search", s);
      if (category) params.append("category", category);
      if (title) params.append("title", title);
      params.append("sort_by", sortBy);
      params.append("sort_order", sortOrder);
      params.append("page", String(page));
      params.append("per_page", String(pageSize));
      const res = await fetch(
        `${API_BASE}/api/admin/post?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session?.data?.token || ""}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.statusText}`);
      }
      const data = await res.json();
      const items = Array.isArray(data?.data) ? data.data : [];
      return {
        success: true,
        data: items,
        pagination: {
          page: Number(data?.pagination?.current_page ?? page),
          limit: Number(data?.pagination?.per_page ?? pageSize),
          total_pages: Number(
            data?.pagination?.total_pages ?? data?.pagination?.last_page ?? 1
          ),
          total_items: Number(data?.pagination?.total ?? items.length),
        },
      };
    },
    placeholderData: keepPreviousData,
  });
}

// Mark as query hook
// @ts-ignore
usePostsData.isQueryHook = true;
