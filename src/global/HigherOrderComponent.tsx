"use client";

import { useStore } from "@/global/store";
import { MENU_ITEMS_TO_REMOVE } from "@/lib/constants";
import { getSelectedMenu } from "@/lib/functions";
import { type Dictionary, type Lang } from "@/types";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = { isTokenValid?: boolean; session: Session | null; t: Dictionary; lang: Lang; children: React.ReactNode };

export default function HigherOrderComponent({ isTokenValid, session, t, lang, children }: Props) {
  const { setT, setSession, setLang } = useStore();
  const pathname = usePathname();

  if (isTokenValid === false && session) {
    signOut().catch((err) => console.error(err));
  }

  if (session && pathname.includes("dashboard")) {
    if (MENU_ITEMS_TO_REMOVE[session.user.role_id].includes(getSelectedMenu(pathname).at(0)!)) redirect(`/${lang}/dashboard`);
  }

  useEffect(() => {
    if (session) setSession(session);
    if (t) setT(t);
    if (lang) setLang(lang);
  }, [session, t, lang]);

  return children;
}
