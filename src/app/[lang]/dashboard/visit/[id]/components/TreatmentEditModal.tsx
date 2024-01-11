"use client";

import { type TreatmentUpdateInput } from "@/api/routers/treatment";
import { type VisitDetailOutput } from "@/api/routers/visit";
import { schema } from "@/api/schema/schemas";
import { type Treatment } from "@/api/schema/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputTextarea from "@/components/InputTextarea";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { CURRENCIES } from "@/lib/constants";
import { accumulateValue } from "@/lib/functions";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: Treatment | null;
  revalidateData: () => Promise<void>;
  visit: VisitDetailOutput;
};

export default function TreatmentEditModal({ showModal, closeModal, data, revalidateData, visit }: Props) {
  const { t } = useStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<TreatmentUpdateInput>({
    resolver: zodResolver(schema.treatment.update),
    defaultValues: { body: { ...data } },
  });

  const onSubmit: SubmitHandler<TreatmentUpdateInput> = (data) => mutate(data);

  const { mutate, isLoading: loading } = api.treatment.update.useMutation({
    onSuccess: async () => {
      updateDueAmount({
        visitId: visit?.visit?.id,
        body: {
          due_amount:
            accumulateValue(
              visit.visit.Treatments.filter((e) => e.id !== data?.id),
              "price",
            ) + getValues("body.price"),
        },
      });
    },
  });

  const { mutate: updateDueAmount } = api.visit.updateDueAmount.useMutation({
    onSuccess: async () => {
      closeModal();
      await revalidateData();
      toastSuccess({ t, description: "Treatment has been updated" });
    },
  });

  useEffect(() => {
    if (data)
      reset({
        body: {
          doctor_id: data.doctor_id,
          visit_id: data.visit_id,
          medical_treatment: data.medical_treatment ?? "",
          currency: data.currency ?? "IDR",
          price: data.price ?? 0,
        },
        treatmentId: data.id,
      });
  }, [data]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
          <InputTextarea
            error={errors?.body?.medical_treatment?.message}
            className="h-16"
            placeholder="Medical Treatment"
            {...register("body.medical_treatment")}
          />
          <section className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="body.currency"
              render={({ field }) => <InputSelect error={errors?.body?.currency?.message} options={CURRENCIES} {...field} />}
            />
            <Input type="number" error={errors?.body?.price?.message} {...register("body.price", { setValueAs: (v: string) => +v })} />
          </section>
          <Button loading={loading} type="submit">
            Update Treatment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
