"use client";

import { api } from "@/trpc/react";
import React, { Fragment } from "react";

export default function HomePage() {
  const { data } = api.user.list.useQuery();
  console.log(data);
  return <Fragment></Fragment>;
}
