"use client";
import { ADMIN_DRAW_ENDPOINTS } from "@/src/lib/endpoints/admin/draw";
import http from "@/src/utils/http";
import { useQuery } from "@tanstack/react-query";

export function useAdminDraws() {
  const url = ADMIN_DRAW_ENDPOINTS.GET_ALL_DRAW;
  return useQuery({
    queryKey: ["admin-draws"],
    queryFn: () => http.get(url),
    select: (data) => data.data,
  });
}
