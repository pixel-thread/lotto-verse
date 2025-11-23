import { EndpointT } from "@/src/types/endpoints";

type DrawEndpoints =
  | "GET_ALL_DRAW"
  | "POST_CREATE_DRAW"
  | "GET_DRAW_BY_ID"
  | "DELETE_DRAW_BY_ID"
  | "POST_DECLARE_DRAW_WINNER"
  | "POST_TOGGLE_DRAW_ACTIVE";

export const ADMIN_DRAW_ENDPOINTS: EndpointT<DrawEndpoints> = {
  GET_ALL_DRAW: "/admin/draw",
  POST_CREATE_DRAW: "/admin/draw",
  POST_TOGGLE_DRAW_ACTIVE: "/admin/draw/:id/active",
  GET_DRAW_BY_ID: "/admin/draw/:id",
  DELETE_DRAW_BY_ID: "/admin/draw/:id",
  POST_DECLARE_DRAW_WINNER: "/admin/draw/:id/winner",
};
