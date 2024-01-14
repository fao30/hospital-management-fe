"use client";

import { type TreatmentCreateInput } from "@/api/routers/treatment";
import { type VisitDetailOutput } from "@/api/routers/visit";
import { schema } from "@/api/schema/schemas";
import { type Treatment } from "@/api/schema/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { cn } from "@/lib/functions";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { AutoComplete, Empty, Spin } from "antd";
import { type Session } from "next-auth";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  revalidateData: () => Promise<void>;
  session: Session;
  isEdit: boolean;
  selectedTreatment: Treatment | null;
  data: VisitDetailOutput;
};

export default function TreatmentCreateModal({
  showModal,
  closeModal,
  revalidateData,
  session,
  selectedTreatment,
  isEdit,
  data,
}: Props) {
  const { t } = useStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: treatments } = api.price.search.useQuery({ key_words: debouncedSearch }, { enabled: !!debouncedSearch });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TreatmentCreateInput>({
    resolver: zodResolver(schema.treatment.create),
    defaultValues: { body: { doctor_id: session.user.id } },
  });

  const onSubmit: SubmitHandler<TreatmentCreateInput> = (data) => {
    isEdit && selectedTreatment?.id
      ? updateTreatmentByDoctor({ treatmentId: selectedTreatment.id, body: { medical_treatment: data.body.medical_treatment } })
      : createTreatment(data);
  };

  const { mutate: createTreatment, isLoading: loading } = api.treatment.create.useMutation({
    onSuccess: async () => {
      closeModal();
      toastSuccess({ t, description: "Treatment has been created" });
      await revalidateData();
    },
  });

  const { mutate: updateTreatmentByDoctor, isLoading: loadingUpdate } = api.treatment.updateByDoctor.useMutation({
    onSuccess: async () => {
      closeModal();
      toastSuccess({ t, description: "Treatment has been updated" });
      await revalidateData();
    },
  });

  useEffect(() => {
    if (selectedTreatment && isEdit && showModal) {
      reset({
        body: {
          doctor_id: selectedTreatment.creator_id,
          visit_id: selectedTreatment.visit_id,
          currency: selectedTreatment.currency,
          price: selectedTreatment.price,
          medical_treatment: selectedTreatment.medical_treatment,
        },
      });
    } else if (showModal)
      reset({ body: { medical_treatment: "", doctor_id: session.user.id, visit_id: data.visit.id, currency: null, price: null } });
  }, [selectedTreatment, isEdit, showModal]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
          <section className="flex flex-col">
            <AutoComplete
              placeholder="Treatment"
              onChange={(e: string, item) => {
                const data = structuredClone(item) as { currency: string; price: number; label: string };
                if (data) {
                  setValue("body.medical_treatment", data.label);
                  setValue("body.price", data.price);
                  setValue("body.currency", data.currency);
                } else setValue("body.medical_treatment", e);
              }}
              onSearch={(v) => setSearch(v)}
              options={treatments?.search.map((e) => ({
                currency: e.currency,
                price: e.price,
                value: e.treatment_name,
                label: e.treatment_name,
              }))}
            />
            {errors.body?.medical_treatment?.message ? (
              <small className={cn("text-briquette text-xs mt-2")}>{errors.body?.medical_treatment?.message}</small>
            ) : null}
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Input disabled value={watch("body.price") ?? "Price will be assigned"} />
            <Input disabled value={watch("body.currency") ?? "Currency will be assigned"} />
          </section>
          <Button loading={loading || loadingUpdate} type="submit">
            {isEdit ? "Update" : "Create"} Treatment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
