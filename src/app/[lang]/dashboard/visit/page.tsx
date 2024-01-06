"use client";

import { schema } from "@/api/schema/schemas";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import VisitTable from "./components/VisitTable";

type Props = {
  params: { lang: Lang };
  searchParams: SearchParams;
};

export default function VisitPage({ params, searchParams }: Props) {
  const query = schema.visit.list.parse({ params: searchParams });

  const { data, isLoading: loading } = api.visit.list.useQuery({
    params: { ...query.params, page: query.params.page - 1 },
  });

  return <VisitTable data={data} loading={loading} lang={params.lang} params={query.params} searchParams={searchParams} />;
}
