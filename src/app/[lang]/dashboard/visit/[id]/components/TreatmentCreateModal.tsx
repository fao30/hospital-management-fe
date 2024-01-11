"use client";

import { type TreatmentCreateInput } from "@/api/routers/treatment";
import { type VisitDetailOutput } from "@/api/routers/visit";
import { schema } from "@/api/schema/schemas";
import { type Treatment } from "@/api/schema/types";
import Button from "@/components/Button";
import InputTextarea from "@/components/InputTextarea";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: VisitDetailOutput;
  revalidateVisit: () => Promise<void>;
  session: Session | null;
  isEdit: boolean;
  selectedTreatment: Treatment | null;
};

export default function TreatmentCreateModal({
  showModal,
  closeModal,
  data,
  revalidateVisit,
  session,
  selectedTreatment,
  isEdit,
}: Props) {
  const { t } = useStore();
  const { visit } = data;

  const { register, handleSubmit, reset } = useForm<TreatmentCreateInput>({
    resolver: zodResolver(schema.treatment.create),
    defaultValues: { body: {} },
  });

  const onSubmit: SubmitHandler<TreatmentCreateInput> = (data) =>
    isEdit
      ? updateTreatment({ treatmentId: selectedTreatment?.id ?? 0, body: { medical_treatment: data.body.medical_treatment } })
      : createTreatment(data);

  const { mutate: createTreatment, isLoading: loading } = api.treatment.create.useMutation({
    onSuccess: async () => {
      closeModal();
      await revalidateVisit();
      toastSuccess({ t, description: "Treatment has been created" });
    },
  });

  const { mutate: updateTreatment, isLoading: loadingUpdate } = api.treatment.updateByDoctor.useMutation({
    onSuccess: async () => {
      closeModal();
      await revalidateVisit();
      toastSuccess({ t, description: "Treatment has been updated" });
    },
  });

  useEffect(() => {
    if (selectedTreatment)
      reset({
        body: {
          doctor_id: session?.user.id,
          visit_id: visit?.id,
          currency: null,
          price: null,
          medical_treatment: isEdit ? selectedTreatment.medical_treatment : "",
        },
      });
  }, [selectedTreatment, isEdit]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
          <InputTextarea className="h-16" placeholder="Medical Treatment" {...register("body.medical_treatment")} />
          <Button loading={loading || loadingUpdate} type="submit">
            Create Treatment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
