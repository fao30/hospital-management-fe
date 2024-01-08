import { type Dictionary, type Lang } from "@/types";
import { type Session } from "next-auth";
import { create } from "zustand";

type StateItems = {
  session: Session | null;
  t: Dictionary | null;
  lang: Lang;
  setSession: (session: Session) => void;
  setLang: (t: Lang) => void;
  setT: (t: Dictionary) => void;
};

export const useStore = create<StateItems>((set) => ({
  session: null,
  lang: "en",
  t: null,
  setT: (t) => set(() => ({ t })),
  setSession: (session) => set(() => ({ session })),
  setLang: (lang) => set(() => ({ lang })),
}));
