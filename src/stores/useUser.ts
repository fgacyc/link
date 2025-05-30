import { create, type StateCreator } from "zustand";
import { jwtDecode } from "jwt-decode";
import { type UserFromToken } from "@/types";
import { persist } from "zustand/middleware";
// import i18n from "@/locales/i18n";

type UserStore = {
  token: string | null;
  language: string;
  initUser: () => Promise<UserFromToken | undefined>;
  UID: string | null;
  user: UserFromToken | null;
  isLoading: boolean;
  cg: string | null;
  setCG: (cg: string) => void;
};

function extractTokenAndLanguage(url: string) {
  const regex = /token=([^&]+).*?&language=([^&]+)/;
  const match = regex.exec(url);
  if (match) {
    const token = match[1];
    const language = match[2];
    return { token: token, language: language };
  } else {
    return { token: null, language: null };
  }
}

const createState: StateCreator<UserStore> = (set) => {
  return {
    token: null,
    user: null,
    UID: null,
    language: "en",
    isLoading: false,
    cg: null,
    setCG: (cg: string) => set({ cg: cg }),
    initUser: async () => {
      set({ isLoading: true });
      const currentUrl = window.location.href;
      const { token } = extractTokenAndLanguage(currentUrl);
      console.log("token", token);
      if (!token) return;
      set({ token: token });
      // if (language) set({ language: language });
      // void i18n.changeLanguage(language);
      const decodedData = jwtDecode(token);
      if (!decodedData) return;
      set({ UID: decodedData.sub });
      const domain = decodedData.aud?.[1];
      if (!domain) return;
      const response = await fetch(domain, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = (await response.json()) as UserFromToken;
      if (!data) {
        set({ isLoading: false });
        return false;
      }

      set({ user: data });
      set({ isLoading: false });
      return data;
    },
  };
};

export const useUser = create(persist(createState, { name: "link-user" }));
