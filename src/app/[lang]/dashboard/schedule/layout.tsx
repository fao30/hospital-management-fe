import { getServerAuthSession } from "@/api/auth";
import { MENU_ITEMS_TO_REMOVE } from "@/lib/constants";
import { type Lang } from "@/types";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Layout({ children, params }: { children: React.ReactNode; params: { lang: Lang } }) {
  const session = await getServerAuthSession();
  if (!session) redirect(`/${params.lang}/login`);
  if (MENU_ITEMS_TO_REMOVE[session.user.role_id].includes("/schedule")) redirect(`/${params.lang}/dashboard`);

  return <Fragment>{children}</Fragment>;
}
