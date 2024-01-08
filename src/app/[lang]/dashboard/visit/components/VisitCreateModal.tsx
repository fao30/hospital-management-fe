import { type VisitCreateInput } from "@/api/routers/visit";
import { PAYMENT_STATUSES } from "@/api/schema/constants";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

export default function VisitCreateModal({ showModal, closeModal }: Props) {
  const { session, t } = useStore();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<VisitCreateInput>({
    resolver: zodResolver(schema.visit.create),
    defaultValues: { body: { hospital_id: session?.user.hospital_id } },
  });

  const onSubmit: SubmitHandler<VisitCreateInput> = (data) => mutate(data);

  const { mutate, isLoading: loading } = api.visit.create.useMutation({
    onSuccess: () => {
      reset();
      closeModal();
      toastSuccess({ t, description: "Visit has been created" });
    },
  });

  const [patientSearch, setPatientSearch] = useState<string>("");
  const debouncedPatientSearch = useDebounce(patientSearch, 500);

  const { data: patients, isFetching: loadingPatient } = api.user.search.useQuery(
    { role_id: 5, key_words: debouncedPatientSearch },
    { enabled: !!debouncedPatientSearch },
  );

  const watched = {
    dueAmount: watch("body.due_amount"),
    paidAmount: watch("body.paid_amount"),
  };

  useEffect(() => {
    if (watched.dueAmount) {
      if (!watched.paidAmount) setValue("body.payment_status_id", 3);
      if (watched.paidAmount === watched.dueAmount) setValue("body.payment_status_id", 1);
      if (watched.dueAmount > watched.paidAmount && watched.paidAmount) setValue("body.payment_status_id", 2);
      clearErrors("body.payment_status_id");
    }
  }, [watched.dueAmount, watched.paidAmount]);

  useEffect(() => {
    if (session) setValue("body.hospital_id", session.user.hospital_id);
  }, [session]);

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Controller
            control={control}
            name="body.patient_id"
            render={({ field }) => (
              <InputSelect
                {...field}
                error={errors.body?.patient_id?.message}
                onSearch={(v) => setPatientSearch(v)}
                notFoundContent={
                  loadingPatient ? (
                    <section className="flex justify-center items-center py-4">
                      <Spin size="small" />
                    </section>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
                showSearch={true}
                placeholder="Patient"
                options={patients?.search.map((e) => ({
                  value: e.id,
                  label: `${e.first_name} ${e.last_name} - ${e.id_number} - ${e.phone_number}`,
                }))}
              />
            )}
          />
          <Input
            error={errors.body?.date_start?.message}
            placeholder="Date Start"
            type="datetime-local"
            {...register("body.date_start")}
          />
          <section className="grid grid-cols-2 gap-4">
            <Input
              error={errors.body?.temperature?.message}
              placeholder="Temperature"
              type="number"
              {...register("body.temperature", { setValueAs: (v: string) => +v })}
            />
            <Input
              error={errors.body?.blood_presure?.message}
              placeholder="Blood Pressure"
              type="number"
              {...register("body.blood_presure", { setValueAs: (v: string) => +v })}
            />
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Input
              error={errors.body?.weight?.message}
              placeholder="Weight"
              type="number"
              {...register("body.weight", { setValueAs: (v: string) => +v })}
            />
            <Input
              error={errors.body?.height?.message}
              placeholder="Height"
              type="number"
              {...register("body.height", { setValueAs: (v: string) => +v })}
            />
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Input error={errors.body?.diagnosis?.message} placeholder="Diagnosis" {...register("body.diagnosis")} />
            <Input error={errors.body?.case_notes?.message} placeholder="Case Notes" {...register("body.case_notes")} />
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Input
              error={errors.body?.due_amount?.message}
              placeholder="Due Amount"
              type="number"
              {...register("body.due_amount", { setValueAs: (v: string) => +v })}
            />
            <Input
              error={errors.body?.paid_amount?.message}
              placeholder="Paid Amount"
              type="number"
              {...register("body.paid_amount", { setValueAs: (v: string) => +v })}
            />
          </section>
          <Controller
            control={control}
            name="body.payment_status_id"
            render={({ field }) => (
              <InputSelect
                {...field}
                disabled
                error={errors.body?.payment_status_id?.message}
                showSearch={true}
                placeholder="Payment Status"
                options={PAYMENT_STATUSES.map((e) => ({ label: e.label, value: e.id }))}
              />
            )}
          />
          <Button loading={loading} type="submit">
            Create Visit
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
