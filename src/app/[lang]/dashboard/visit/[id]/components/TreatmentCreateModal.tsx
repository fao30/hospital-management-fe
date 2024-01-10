"use client";

import { type TreatmentCreateInput } from "@/api/routers/treatment";
import { type VisitDetailOutput } from "@/api/routers/visit";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import InputTextarea from "@/components/InputTextarea";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = { showModal: boolean; closeModal: () => void; data: VisitDetailOutput; revalidateVisit: () => Promise<void> };

export default function TreatmentCreateModal({ showModal, closeModal, data, revalidateVisit }: Props) {
  const { session, t } = useStore();
  const { visit } = data;

  const { register, handleSubmit, watch } = useForm<TreatmentCreateInput>({
    resolver: zodResolver(schema.treatment.create),
    defaultValues: { body: { doctor_id: session?.user.id, visit_id: visit?.id, currency: null, price: null } },
  });

  const onSubmit: SubmitHandler<TreatmentCreateInput> = (data) => mutate(data);

  const { mutate, isLoading: loading } = api.treatment.create.useMutation({
    onSuccess: async () => {
      closeModal();
      await revalidateVisit();
      toastSuccess({ t, description: "Treatment has been created" });
    },
  });

  console.log(watch());

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
          <InputTextarea className="h-16" placeholder="Medical Treatment" {...register("body.medical_treatment")} />
          <Button loading={loading} type="submit">
            Create Treatment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
