"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

type Props = { isTokenValid?: boolean; token?: string };

export default function AuthLogoutHelper({ isTokenValid }: Props) {
  useEffect(() => {
    if (!isTokenValid) () => signOut();
  }, [isTokenValid]);
  return null;
}
