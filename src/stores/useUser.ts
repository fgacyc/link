import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type {
  Auth0ToGraphQLUserMapping,
  GetSinglePersonHookResponse,
} from "@/types/graphql";
import { GET_SINGLE_PERSON } from "@/graphql/hooks/user";
import { getAuthHeaders } from "@/graphql/server";
import { executeQuery } from "@/graphql/queries";

interface UserStore {
  user: Auth0ToGraphQLUserMapping | null;
  token: string;
  uid: string;
  language: string;
  initUser: () => Promise<Auth0ToGraphQLUserMapping | undefined>;
  setUser: (user: Auth0ToGraphQLUserMapping) => void;
  setToken: (token: string) => void;
  setUid: (uid: string) => void;
  logout: () => void;
  isLoading: boolean;
}

interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  nickname?: string;
  picture?: string;
  email_verified?: boolean;
  updated_at?: string;
  exp?: number;
  iat?: number;
}

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      isLoading: false,
      user: null,
      token: "",
      uid: "",
      language: "en",
      initUser: async () => {
        set({ isLoading: true });
        try {
          const urlParams = new URLSearchParams(window.location.search);

          const urlToken = urlParams.get("token");
          const urlLanguage = urlParams.get("language");
          if (!urlToken) {
            alert("No Token Found.");
            return;
          }

          // Decode the JWT token directly
          const decodedToken = jwtDecode<JWTPayload>(urlToken);

          if (!decodedToken) {
            return;
          }

          // Set token and user data
          set({ token: urlToken });
          set({ uid: decodedToken.sub });
          set({ language: urlLanguage ?? "en" });

          // when user is populated, fetch the user details from graphql
          const userDetails = await executeQuery(
            GET_SINGLE_PERSON,
            { uid: decodedToken.sub },
            getAuthHeaders(),
          );
          const response = userDetails as GetSinglePersonHookResponse;
          const ud = response.userCollection.edges[0]?.node ?? null;
          const cg =
            ud?.user_connect_groupCollection.edges[0]?.node.connect_group.id ??
            "";

          console.log(ud);

          const mappedUser: Auth0ToGraphQLUserMapping = {
            id: decodedToken.sub,
            name: ud?.name ?? "",
            email: decodedToken.email,
            email_verified: decodedToken.email_verified ?? false,
            given_name: ud?.given_name ?? decodedToken.given_name ?? "",
            nickname: ud?.nickname ?? decodedToken.nickname ?? "",
            avatar_url: ud?.avatar_url ?? decodedToken.picture ?? "",
            updated_at: decodedToken.updated_at ?? new Date().toISOString(),
            cg: cg,
          };

          set({ user: mappedUser });

          // Clean up URL - safer approach
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            window.history.replaceState({}, document.title, url.toString());
          } catch (urlError) {
            // Fallback approach if URL construction fails
            console.warn(
              "Failed to construct URL, using fallback approach:",
              urlError,
            );
            try {
              const currentUrl = window.location.href;
              const urlWithoutToken = currentUrl
                .replace(/[?&]token=[^&]*/, "")
                .replace(/\?$/, "");
              window.history.replaceState({}, document.title, urlWithoutToken);
            } catch (fallbackError) {
              console.warn("Fallback URL cleanup also failed:", fallbackError);
              // If both approaches fail, just continue without URL cleanup
            }
          }

          set({ isLoading: false });

          return mappedUser;
        } catch (error) {
          console.error("Error initializing user:", error);
          set({ isLoading: false });
          return;
        }
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setUid: (uid) => set({ uid }),
      logout: () => set({ user: null, token: "", uid: "" }),
    }),
    {
      name: "user-storage",
    },
  ),
);
