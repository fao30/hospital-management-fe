import { getServerAuthSession } from "@/api/auth";
import { type Lang } from "@/types";
import { redirect } from "next/navigation";
import { Fragment } from "react";

type Props = {
  params: { lang: Lang };
  children: React.ReactNode;
};

export default async function LoginLayout({ params, children }: Props) {
  const session = await getServerAuthSession();
  if (session) redirect(`/${params.lang}/dashboard`);
  return <Fragment>{children}</Fragment>;
}
