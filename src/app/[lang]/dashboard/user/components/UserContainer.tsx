"use client";

import Button from "@/components/Button";
import { api } from "@/trpc/react";
import { type Dictionary, type Lang, type SearchParams } from "@/types";
import { schema } from "@schema/schemas";
import { type Session } from "next-auth";
import { Fragment, useState } from "react";
import UserTable from "../components/UserTable";
import UserRegisterModal from "./UserRegisterModal";

type Props = {
  searchParams: SearchParams;
  lang: Lang;
  session: Session | null;
  t: Dictionary;
};

export default function UserContainer({ searchParams, lang, session, t }: Props) {
  const [showModal, setShowModal] = useState(false);
  const query = schema.user.list.parse(searchParams);
  const { data, isLoading: loading } = api.user.list.useQuery({ ...query, page: query.page - 1 });

  return (
    <Fragment>
      <UserRegisterModal session={session} showModal={showModal} closeModal={() => setShowModal(false)} t={t} />
      <article className="flex flex-col gap-6">
        <section className="flex justify-between">
          <section className="flex flex-col">
            <p>Total User(s): {data?.count}</p>
            <p>Maximum User(s): {data?.hospital?.max_users}</p>
          </section>
          <Button
            onClick={() => setShowModal(true)}
            size="small"
            rounded="md"
            disabled={data?.count === data?.hospital?.max_users || loading}
          >
            Create User
          </Button>
        </section>
        <UserTable loading={loading} data={data} searchParams={searchParams} lang={lang} query={query} />
      </article>
    </Fragment>
  );
}
