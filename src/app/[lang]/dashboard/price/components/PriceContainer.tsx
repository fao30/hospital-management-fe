"use client";

import { schema } from "@/api/schema/schemas";
import { type List_Price } from "@/api/schema/types";
import Button from "@/components/Button";
import { api } from "@/trpc/react";
import { type SearchParams } from "@/types";
import { type Session } from "next-auth";
import React, { Fragment, useEffect, useState } from "react";
import PriceCreateModal from "./PriceCreateModal";
import PriceTable from "./PriceTable";

type Props = { searchParams: SearchParams; session: Session };

export default function PriceContainer({ searchParams, session }: Props) {
  const [selectedPrice, setSelectedPrice] = useState<List_Price | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const query = schema.price.list.parse(searchParams);

  const { data, isLoading: loading } = api.price.list.useQuery({ ...query, page: query.page - 1 });

  const handleEdit = (data: List_Price) => {
    setSelectedPrice(data);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <Fragment>
      <PriceCreateModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        session={session}
        selectedPrice={selectedPrice}
        isEdit={isEdit}
      />
      <article className="flex flex-col gap-6">
        <section className="flex justify-end">
          <Button
            onClick={() => {
              setShowModal(true);
              if (isEdit) setIsEdit(false);
            }}
            size="small"
            rounded="md"
          >
            Create Price
          </Button>
        </section>
        <PriceTable data={data} loading={loading} query={query} searchParams={searchParams} handleEdit={handleEdit} />
      </article>
    </Fragment>
  );
}
