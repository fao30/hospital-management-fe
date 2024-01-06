"use client";

import { api } from "@/trpc/react";
import { type Lang } from "@/types";
import VisitTable from "./components/VisitTable";

type Props = {
  params: { lang: Lang };
};

export default function VisitPage({ params }: Props) {
  const { data, isLoading: loading } = api.visit.list.useQuery();

  return <VisitTable data={data} loading={loading} lang={params.lang} />;
}
