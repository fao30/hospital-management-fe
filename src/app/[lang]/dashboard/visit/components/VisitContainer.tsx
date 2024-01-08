"use client";

import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import { api } from "@/trpc/react";
import { type SearchParams } from "@/types";
import { Fragment, useState } from "react";
import VisitCreateModal from "../components/VisitCreateModal";
import VisitTable from "../components/VisitTable";

type Props = { searchParams: SearchParams };

export default function VisitContainer({ searchParams }: Props) {
  const [showModal, setShowModal] = useState(false);
  const query = schema.visit.list.parse(searchParams);

  const { data, isLoading: loading } = api.visit.list.useQuery({ ...query, page: query.page - 1 });

  return (
    <Fragment>
      <VisitCreateModal showModal={showModal} closeModal={() => setShowModal(false)} />
      <article className="flex flex-col gap-6">
        <section className="flex justify-end">
          <Button onClick={() => setShowModal(true)} size="small" rounded="md">
            Add Visit
          </Button>
        </section>
        <VisitTable data={data} loading={loading} query={query} searchParams={searchParams} />
      </article>
    </Fragment>
  );
}
