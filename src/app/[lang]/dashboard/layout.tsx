import { getServerAuthSession } from "@/api/auth";
import { type Lang } from "@/types";
import { redirect } from "next/navigation";
import { Fragment } from "react";

type Props = {
  params: { lang: Lang };
  children: React.ReactNode;
};

export default async function DashboardLayout({ params, children }: Props) {
  const session = await getServerAuthSession();
  if (!session) redirect(`/${params.lang}/login/?callbackUrl=/dashboard`);
  return <Fragment>{children}</Fragment>;
}
