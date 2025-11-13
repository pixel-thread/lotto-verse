import { EndpointT } from "@/src/types/endpoints";

type DrawEndpoints = "GET_ACTIVE_DRAW";

export const DRAW_ENDPOINTS: EndpointT<DrawEndpoints> = {
  GET_ACTIVE_DRAW: "/draw/current",
};
