import { type MedicineTreatmentCreateInput } from "@/api/routers/medicineTreatment";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputTextarea from "@/components/InputTextarea";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { formatDate } from "@/lib/functions";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { Empty, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  revalidateData: () => Promise<void>;
  data: { treatment_id: number; visit_id: number };
};

export default function MedicineCreateModal({ showModal, closeModal, revalidateData, data }: Props) {
  const { t } = useStore();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicineTreatmentCreateInput>({
    resolver: zodResolver(schema.medicineTreatment.create),
  });

  const onSubmit: SubmitHandler<MedicineTreatmentCreateInput> = (data) => createMedicine(data);

  const { mutate: createMedicine, isLoading: loading } = api.medicineTreatment.create.useMutation({
    onSuccess: async () => {
      closeModal();
      toastSuccess({ t, description: "Medicine has been added" });
      await revalidateData();
    },
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: medicines, isFetching: loadingSearch } = api.medicine.search.useQuery(
    { key_words: debouncedSearch },
    { enabled: !!debouncedSearch },
  );

  useEffect(() => {
    if (data && showModal) reset({ body: data });
  }, [showModal, data]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-96">
          <InputTextarea
            error={errors?.body?.medicines_treatment?.message}
            className="h-16"
            placeholder="Medical Treatment"
            {...register("body.medicines_treatment")}
          />
          <Controller
            control={control}
            name="body.medicine_id"
            render={({ field }) => (
              <InputSelect
                options={medicines?.search.map((e) => ({
                  value: e.id,
                  label: `${e.name} (BATCH ${e.batch}) ${formatDate({ date: e.expiry_date, style: "short" })}`,
                }))}
                error={errors.body?.medicine_id?.message}
                onSearch={(v) => setSearch(v)}
                {...field}
                showSearch={true}
                placeholder="Medicine"
                notFoundContent={
                  loadingSearch ? (
                    <section className="flex justify-center items-center py-4">
                      <Spin size="small" />
                    </section>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
              />
            )}
          />
          <Input placeholder="Quantity" {...register("body.quantity", { setValueAs: (v) => +v })} type="number" />

          <Button loading={loading} type="submit">
            Add Medicine
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
