"use server";

import { cookies } from "next/headers";

export const getCollapsed = () => {
  const collapsed = cookies().get("collapsed")?.value === "true" ? true : false;
  return collapsed;
};

export const handleCollapse = (boolean: boolean) => {
  cookies().set("collapsed", boolean.toString());
};
