import { EndpointT } from "@/src/types/endpoints";

type AuthEndpoints = "GET_ME";

export const AUTH_ENDPOINTS: EndpointT<AuthEndpoints> = {
  GET_ME: "/auth",
};
