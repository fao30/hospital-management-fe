"use client";

import { type PriceListInput } from "@/api/routers/price";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import { api } from "@/trpc/react";
import { type SearchParams } from "@/types";
import React, { Fragment, useState } from "react";
import PriceTable from "./PriceTable";

type Props = { searchParams: SearchParams };

export default function PriceContainer({ searchParams }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState({
    page: 0,
    limit: 50,
  });

  const { data, isLoading: loading } = api.price.list.useQuery(query);

  const handleEdit = () => {
    console.log("");
  };

  return (
    <Fragment>
      <article className="flex flex-col gap-6">
        <section className="flex justify-end">
          <Button onClick={() => setShowModal(true)} size="small" rounded="md">
            Create Price
          </Button>
        </section>
        <PriceTable data={data} loading={loading} query={query} searchParams={searchParams} handleEdit={handleEdit} />
      </article>
    </Fragment>
  );
}
