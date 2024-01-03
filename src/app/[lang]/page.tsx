import { getServerAuthSession } from "@/api/auth";
import { api } from "@/trpc/server";
import { Fragment } from "react";

export default async function HomePage() {
  const session = await getServerAuthSession();

  console.log("SESSION", session);

  return <Fragment>page</Fragment>;
}
