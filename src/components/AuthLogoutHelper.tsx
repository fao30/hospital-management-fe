"use client";

import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

type Props = { isTokenValid?: boolean; session: Session | null };

export default function AuthLogoutHelper({ isTokenValid, session }: Props) {
  useEffect(() => {
    if (isTokenValid === false && session) {
      signOut().catch((err) => console.error(err));
    }
  }, [isTokenValid, session]);

  return null;
}
