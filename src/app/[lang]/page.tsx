import { api } from "@/trpc/server";
import { Fragment } from "react";

export default async function HomePage() {
  const data = await api.role.list.query();

  return <Fragment>page</Fragment>;
}
