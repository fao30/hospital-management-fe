import { type MedicineCreateInput } from "@/api/routers/medicine";
import { schema } from "@/api/schema/schemas";
import { Modal } from "@/components/Modal";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  session: Session;
};

export default function MedicineCreateModal({ showModal, closeModal, session }: Props) {
  const utils = api.useUtils();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    unregister,
  } = useForm<MedicineCreateInput>({
    resolver: zodResolver(schema.medicine.create),
    defaultValues: { body: { currency: "IDR", hospital_id: session.user.hospital_id } },
  });

  const onSubmit: SubmitHandler<MedicineCreateInput> = (data) => null;

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96"></form>
      </Modal.Body>
    </Modal>
  );
}
