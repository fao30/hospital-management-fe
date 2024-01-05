import { getServerAuthSession } from "@/api/auth";
import { api } from "@/trpc/server";
import { Fragment } from "react";

export default async function HomePage() {
  const session = await getServerAuthSession();
  const data = await api.visit.list.query();

  return <Fragment>page</Fragment>;
}
