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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TreatmentCreateInput>({
    resolver: zodResolver(schema.treatment.create),
    defaultValues: { body: { doctor_id: session.user.id } },
  });

  const onSubmit: SubmitHandler<TreatmentCreateInput> = (data) => {
    isEdit
      ? updateTreatmentByDoctor({ treatmentId: selectedTreatment?.id ?? 0, body: { medical_treatment: data.body.medical_treatment } })
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
          <InputTextarea
            error={errors?.body?.medical_treatment?.message}
            className="h-16"
            placeholder="Medical Treatment"
            {...register("body.medical_treatment")}
          />
          <Button loading={loading || loadingUpdate} type="submit">
            {isEdit ? "Update" : "Create"} Treatment
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
