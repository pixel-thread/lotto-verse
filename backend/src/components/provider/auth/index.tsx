"use client";
import { AUTH_TOKEN_KEY } from "@/src/lib/constant/jwt-key";
import { AuthContext } from "@/src/lib/context/auth";
import { UserT } from "@/src/types/context/auth";
import http from "@/src/utils/http";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";

type Props = { children: React.ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const { isSignedIn, getToken } = useAuth();
  const [cookies, setCookies, removeCookies] = useCookies([AUTH_TOKEN_KEY]);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => http.get<UserT>("/auth"),
    enabled: isSignedIn && !!cookies.AUTH_TOKEN_KEY,
    select: (data) => data.data,
  });

  const getUser = useCallback(async () => {
    if (isSignedIn) {
      const token = await getToken({ template: "jwt" });
      if (token) {
        setCookies(AUTH_TOKEN_KEY, token, {
          path: "/",
          sameSite: true,
          secure: true,
        });
      }
    }
  }, [isSignedIn, getToken, cookies.AUTH_TOKEN_KEY]);

  // get user when signed in
  useEffect(() => {
    if (isSignedIn) {
      getUser();
    }
  }, [isSignedIn]);

  // remove token when user is logout from clerk if token still exist
  useEffect(() => {
    if (!isSignedIn && !!cookies?.AUTH_TOKEN_KEY) {
      removeCookies(AUTH_TOKEN_KEY);
    }
  }, [isSignedIn]);

  const isAdmin = useMemo(() => {
    return data?.role === "SUPER_ADMIN" || data?.role === "ADMIN";
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        user: data,
        isLoadingAuth: isFetching || isLoading,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
