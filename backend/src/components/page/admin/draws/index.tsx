"use client";
import { useAdminDraws } from "@/src/hooks/admin/draws/useAdminDraws";

export const AdminDrawsPage = () => {
  const { data } = useAdminDraws();
  return (
    <div className="h-screen flex items-center justify-center">
      <h1>draw</h1>
    </div>
  );
};
