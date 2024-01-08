"use client";

import { useStore } from "@/global/store";
import { type Dictionary, type Lang } from "@/types";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Fragment, useEffect } from "react";

type Props = { isTokenValid?: boolean; session: Session | null; t: Dictionary; lang: Lang };

export default function GlobalHelper({ isTokenValid, session, t, lang }: Props) {
  const { setT, setSession, setLang } = useStore();

  useEffect(() => {
    if (isTokenValid === false && session) {
      signOut().catch((err) => console.error(err));
    }
  }, [isTokenValid, session]);

  useEffect(() => {
    if (session) setSession(session);
    if (t) setT(t);
    if (lang) setLang(lang);
  }, [session, t, lang]);

  return <Fragment />;
}
