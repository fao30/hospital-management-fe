import { type PriceCreateInput } from "@/api/routers/price";
import { schema } from "@/api/schema/schemas";
import { type List_Price } from "@/api/schema/types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { CURRENCIES } from "@/lib/constants";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  session: Session;
  isEdit: boolean;
  selectedPrice: List_Price | null;
};

export default function PriceCreateModal({ showModal, closeModal, session, isEdit, selectedPrice }: Props) {
  const { t } = useStore();
  const utils = api.useUtils();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<PriceCreateInput>({
    resolver: zodResolver(schema.price.create),
    defaultValues: { body: { hospital_id: +session.user.hospital_id, currency: "IDR", price: 0 } },
  });
  const watchAllFields = watch();
  //   console.log(watchAllFields);

  const onSubmit: SubmitHandler<PriceCreateInput> = (data) => {
    console.log("TRIGER ONSUBMIT");
    createPrice(data);
  };

  const { mutate: createPrice, isLoading: loading } = api.price.create.useMutation({
    onSuccess: async () => {
      closeModal();
      await utils.price.list.invalidate();
      toastSuccess({ t, description: "Price has been created" });
    },
  });

  console.log(schema.price.create.safeParse(watch()));

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-[32rem]">
          <Input error={errors?.body?.treatment_name?.message} {...register("body.treatment_name")} placeholder="Treatment Name" />
          <Input
            error={errors?.body?.price?.message}
            type="number"
            {...register("body.price", { setValueAs: (v) => +v })}
            placeholder="Price"
          />
          <Controller
            control={control}
            name="body.currency"
            render={({ field }) => <InputSelect {...field} options={CURRENCIES} placeholder="Select Currency" />}
          />
          <Button loading={loading} type="submit">
            Create Price
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
