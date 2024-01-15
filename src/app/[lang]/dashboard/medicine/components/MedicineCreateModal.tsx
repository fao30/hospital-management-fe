import { type MedicineCreateInput } from "@/api/routers/medicine";
import { schema } from "@/api/schema/schemas";
import { type Medicine } from "@/api/schema/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { CURRENCIES } from "@/lib/constants";
import { getInputDate } from "@/lib/functions";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  session: Session;
  isEdit: boolean;
  selectedMedicine: Medicine | null;
};

export default function MedicineCreateModal({ showModal, closeModal, session, isEdit, selectedMedicine }: Props) {
  const { t } = useStore();
  const utils = api.useUtils();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<MedicineCreateInput>({
    resolver: zodResolver(schema.medicine.create),
  });

  const onSubmit: SubmitHandler<MedicineCreateInput> = (data) =>
    isEdit && selectedMedicine?.id ? updateMedicine({ medicineId: selectedMedicine.id, body: data.body }) : createMedicine(data);

  const { mutate: createMedicine, isPending: loading } = api.medicine.create.useMutation({
    onSuccess: async () => {
      closeModal();
      await utils.medicine.list.invalidate();
      toastSuccess({ t, description: "Medicine has been created" });
    },
  });

  const { mutate: updateMedicine, isPending: loadingUpdate } = api.medicine.update.useMutation({
    onSuccess: async () => {
      closeModal();
      await utils.medicine.list.invalidate();
      toastSuccess({ t, description: "Medicine has been created" });
    },
  });

  useEffect(() => {
    if (isEdit && selectedMedicine && showModal) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = selectedMedicine;
      reset({ body: { ...rest, expiry_date: getInputDate(rest.expiry_date) } });
    } else if (showModal) reset({ body: { currency: "MYR", hospital_id: session.user.hospital_id, in_stock: 0, price: 0 } });
  }, [selectedMedicine, isEdit, showModal]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-[32rem]">
          <section className="grid grid-cols-2 gap-4">
            <Input error={errors?.body?.name?.message} {...register("body.name")} placeholder="Name" />
            <Input error={errors?.body?.article_number?.message} {...register("body.article_number")} placeholder="Article Number" />
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="body.currency"
              render={({ field }) => <InputSelect {...field} options={CURRENCIES} />}
            />
            <Input
              error={errors?.body?.price?.message}
              placeholder="Price"
              {...register("body.price", { setValueAs: (v: string) => +v })}
            />
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Input
              error={errors?.body?.in_stock?.message}
              {...register("body.in_stock", { setValueAs: (v: string) => +v })}
              placeholder="In Stock"
              type="number"
            />
            <Input error={errors?.body?.expiry_date?.message} {...register("body.expiry_date")} type="date" />
          </section>
          <Input error={errors?.body?.manufacturer?.message} {...register("body.manufacturer")} placeholder="Manufacturer" />
          <Button loading={loading || loadingUpdate} type="submit">
            {isEdit ? "Update" : "Create"} Medicine
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
