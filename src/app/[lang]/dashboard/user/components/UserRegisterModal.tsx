import { type UserRegisterInput } from "@/api/routers/user";
import { ROLES } from "@/api/schema/constants";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastSuccess } from "@/components/Toast";
import { GENDERS } from "@/lib/constants";
import { api } from "@/trpc/react";
import { type Dictionary } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  session: Session | null;
  t: Dictionary;
};

export default function UserRegisterModal({ showModal, closeModal, session, t }: Props) {
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    unregister,
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(schema.user.register),
    defaultValues: {
      body: { gender: "MALE", hospital_id: session?.user.hospital_id, country_id: 1 },
    },
  });

  const onSubmit: SubmitHandler<UserRegisterInput> = (data) => mutate(data);

  const { mutate, isPending: loading } = api.user.register.useMutation({
    onSuccess: async () => {
      toastSuccess({ t, description: "User has been created" });
      await utils.user.invalidate();
      closeModal();
    },
  });

  const watchedData = { roleId: watch("body.role_id") };
  const isPatient = watchedData.roleId === 5;

  return (
    <Modal show={showModal} closeModal={closeModal}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <section className="grid grid-cols-2 gap-4">
            <Input error={errors.body?.first_name?.message} placeholder="First Name" {...register("body.first_name")} />
            <Input error={errors.body?.last_name?.message} placeholder="Last Name" {...register("body.last_name")} />
          </section>
          <section className="grid grid-cols-2 gap-4">
            <Input
              error={errors.body?.date_of_birth?.message}
              type="date"
              placeholder="First Name"
              {...register("body.date_of_birth")}
            />
            <section className="grid grid-cols-2 h-10">
              {GENDERS.map((option, index) => {
                return (
                  <section key={option.label} className="items-center flex gap-2">
                    <button
                      type="button"
                      className="relative rounded-full w-6 bg-white aspect-square border-1 border-dark has-[:checked]:bg-dark"
                    >
                      <input
                        value={option.value}
                        className="cursor-pointer absolute w-full h-full opacity-0 z-10 top-0 left-0"
                        id={`gender_option_${index}`}
                        type="radio"
                        {...register("body.gender")}
                      />
                      <div className="animate absolute centered w-[40%] aspect-square rounded-full bg-white has-[:checked]:scale-0" />
                    </button>
                    <label className="flex items-center" htmlFor={`gender_option_${index}`}>
                      <Iconify color={option.color} width={25} icon={option.icon} />
                      {option.label}
                    </label>
                  </section>
                );
              })}
            </section>
          </section>
          {isPatient ? null : (
            <section className="grid grid-cols-2 gap-4">
              <Input error={errors.body?.email?.message} placeholder="Email" {...register("body.email")} />
              <Input error={errors.body?.password?.message} type="password" placeholder="Password" {...register("body.password")} />
            </section>
          )}
          <section className="grid grid-cols-2 gap-4">
            <Input error={errors.body?.phone_number?.message} placeholder="Phone Number" {...register("body.phone_number")} />
            <Controller
              control={control}
              name="body.role_id"
              render={({ field }) => (
                <InputSelect
                  placeholder="Role"
                  error={errors.body?.role_id?.message}
                  {...field}
                  options={ROLES.map((role) => ({ value: role.id, label: role.label }))}
                  onChange={(e) => {
                    if (e === 5) {
                      unregister("body.email");
                      unregister("body.password");
                    }
                    setValue("body.role_id", e as number);
                  }}
                />
              )}
            />
          </section>
          <Input error={errors.body?.id_number?.message} {...register("body.id_number")} placeholder="ID Number" />
          <Button loading={loading} type="submit">
            Create User
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
