import { getServerAuthSession } from "@/api/auth";
import { type Lang, type SearchParams } from "@/types";
import React from "react";
import MedicineContainer from "./components/MedicineContainer";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default async function MedicinePage({ searchParams }: Props) {
  const session = await getServerAuthSession();

  if (session) return <MedicineContainer searchParams={searchParams} session={session} />;
}
