"use client";

import { type UserRegisterInput } from "@/api/routers/user";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Modal } from "@/components/Modal";
import { api } from "@/trpc/react";
import { type Lang, type SearchParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@schema/schemas";
import { Fragment, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import UserTable from "./components/UserTable";

type Props = {
  searchParams: SearchParams;
  params: { lang: Lang };
};

export default function UserPage({ searchParams, params }: Props) {
  const [showModal, setShowModal] = useState(false);
  const query = schema.user.list.parse(searchParams);
  const { data, isLoading: loading } = api.user.list.useQuery({ ...query, page: query.page - 1 });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterInput>({ resolver: zodResolver(schema.user.register) });

  const onSubmit: SubmitHandler<UserRegisterInput> = (data) => {
    console.log(data);
  };

  return (
    <Fragment>
      <Modal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
      >
        <Modal.Body>
          <form className="flex flex-col gap-6">
            <section className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" {...register("body.first_name")} />
              <Input placeholder="Last Name" {...register("body.last_name")} />
            </section>
            <section className="grid grid-cols-2 gap-4">
              <Input type="date" placeholder="First Name" {...register("body.date_of_birth")} />
              <Input placeholder="Email" {...register("body.email")} />
            </section>
            <section className="grid grid-cols-2 gap-4">
              <Input type="password" placeholder="Password" {...register("body.password")} />
              <Input placeholder="Phone Number" {...register("body.phone_number")} />
            </section>
          </form>
        </Modal.Body>
      </Modal>
      <article className="flex flex-col gap-6">
        <section className="flex justify-end">
          <Button
            onClick={() => setShowModal(true)}
            size="small"
            rounded="md"
            disabled={data?.count === data?.hospital?.max_users || loading}
          >
            Add User
          </Button>
        </section>
        <UserTable loading={loading} data={data} searchParams={searchParams} lang={params.lang} query={query} />
      </article>
    </Fragment>
  );
}
