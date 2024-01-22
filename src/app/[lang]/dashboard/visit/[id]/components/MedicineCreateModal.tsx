import { type MedicineTreatmentCreateInput } from "@/api/routers/medicineTreatment";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputTextarea from "@/components/InputTextarea";
import { Modal } from "@/components/Modal";
import { toastSuccess, toastWarning } from "@/components/Toast";
import { useStore } from "@/global/store";
import { formatDate } from "@/lib/functions";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  revalidateData: () => Promise<void>;
  data: { treatment_id: number; visit_id: number };
  selectedMedicineTreatment?: { quantity: number; medicines_treatment: string; medicine_id: number; id: number };
  isEdit: boolean;
  selectedMedicineTreatmentName?: string;
};

export default function MedicineCreateModal({
  showModal,
  closeModal,
  revalidateData,
  data,
  isEdit,
  selectedMedicineTreatment,
  selectedMedicineTreatmentName,
}: Props) {
  const { t } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<MedicineTreatmentCreateInput>({
    resolver: zodResolver(schema.medicineTreatment.create),
  });

  const onSubmit: SubmitHandler<MedicineTreatmentCreateInput> = (data) => {
    if (isEdit && selectedMedicineTreatment) {
      return update({ medicineTreatmentId: selectedMedicineTreatment.id, body: data.body });
    } else {
      create(data);
    }
  };

  const { mutate: create, isPending: loading } = api.medicineTreatment.create.useMutation({
    onSuccess: async () => {
      closeModal();
      toastSuccess({ t, description: "Medicine has been added" });
      await revalidateData();
    },
  });

  const { mutate: update, isPending: loadingUpdate } = api.medicineTreatment.update.useMutation({
    onSuccess: async () => {
      closeModal();
      toastSuccess({ t, description: "Medicine has been updated" });
      await revalidateData();
    },
    onError: () => toastWarning({ t, description: "Quantity exceeds the stock" }),
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: medicines, isFetching: loadingSearch } = api.medicine.search.useQuery(
    { key_words: debouncedSearch },
    { enabled: !!debouncedSearch },
  );

  useEffect(() => {
    if (data && showModal && isEdit && selectedMedicineTreatment) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = selectedMedicineTreatment;
      reset({ body: { ...data, ...rest } });
    } else if (showModal && data) reset({ body: data });
  }, [showModal, data, isEdit, selectedMedicineTreatment]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
          <InputTextarea
            disabled={isEdit}
            error={errors?.body?.medicines_treatment?.message}
            className="h-16"
            placeholder="Medical Treatment"
            {...register("body.medicines_treatment")}
          />
          {isEdit ? (
            <Input disabled value={selectedMedicineTreatmentName} />
          ) : (
            <Controller
              control={control}
              name="body.medicine_id"
              render={({ field }) => (
                <InputSelect
                  disabled={isEdit}
                  options={medicines?.search.map((e) => ({
                    value: e.id,
                    label: `${e.name} [${e.in_stock}] [${formatDate({ date: e.expiry_date, style: "very-short" })}]`,
                  }))}
                  error={errors.body?.medicine_id?.message}
                  onSearch={(v) => setSearch(v)}
                  {...field}
                  showSearch={true}
                  placeholder="Medicine"
                  loading={loadingSearch}
                />
              )}
            />
          )}
          <Input placeholder="Quantity" {...register("body.quantity", { setValueAs: (v) => +v })} type="number" />

          <Button loading={loading || loadingUpdate} type="submit">
            {isEdit ? "Update" : "Add"} Medicine
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
