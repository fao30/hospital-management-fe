import { api } from "@/trpc/server";
import { Fragment } from "react";

export default async function HomePage() {
  const data = await api.user.list.query({ params: { limit: 1, page: 1 } });

  return <Fragment></Fragment>;
}
