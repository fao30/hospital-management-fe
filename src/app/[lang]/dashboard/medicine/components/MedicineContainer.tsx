"use client";

import { schema, type RoleId } from "@/api/schema/schemas";
import { type Medicine } from "@/api/schema/types";
import Button from "@/components/Button";
import { api } from "@/trpc/react";
import { type SearchParams } from "@/types";
import { type Session } from "next-auth";
import { Fragment, useState } from "react";
import MedicineCreateModal from "./MedicineCreateModal";
import MedicineTable from "./MedicineTable";

type Props = { searchParams: SearchParams; session: Session };

export default function MedicineContainer({ searchParams, session }: Props) {
  const [showModal, setShowModal] = useState(false);
  const query = schema.medicine.list.parse(searchParams);
  const { data, isLoading: loading } = api.medicine.list.useQuery({ ...query, page: query.page - 1 });
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const allowedToCreate: RoleId[] = [1, 2, 3, 6];

  const handleEdit = (data: Medicine) => {
    setSelectedMedicine(data);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <Fragment>
      <MedicineCreateModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        session={session}
        selectedMedicine={selectedMedicine}
        isEdit={isEdit}
      />
      <article className="flex flex-col gap-6">
        {allowedToCreate.includes(session?.user.role_id) ? (
          <section className="flex justify-end">
            <Button
              onClick={() => {
                setShowModal(true);
                if (isEdit) setIsEdit(false);
              }}
              size="small"
              rounded="md"
            >
              Create Medicine
            </Button>
          </section>
        ) : null}
        <MedicineTable data={data} loading={loading} searchParams={searchParams} query={query} handleEdit={handleEdit} />
      </article>
    </Fragment>
  );
}
