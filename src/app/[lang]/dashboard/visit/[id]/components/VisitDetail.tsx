"use client";

import { type VisitDetailOutput } from "@/api/routers/visit";
import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import { useStore } from "@/global/store";
import { formatCurrency, formatDate, getCelius, getUserAge, localizePhoneNumber } from "@/lib/functions";
import Link from "next/link";
import { Fragment, useState } from "react";
import TreatmentCreateModal from "./TreatmentCreateModal";

type Props = { data: VisitDetailOutput; revalidateVisit: () => Promise<void> };

export default function VisitDetail({ data, revalidateVisit }: Props) {
  const { visit } = data;
  const { lang } = useStore();
  const [modalTreatment, setModalTreatment] = useState(false);

  return (
    <Fragment>
      <TreatmentCreateModal
        revalidateVisit={revalidateVisit}
        showModal={modalTreatment}
        closeModal={() => setModalTreatment(false)}
        data={data}
      />
      <article className="flex items-center justify-center">
        <section className="w-[36rem] flex flex-col gap-6 bg-gray/10 p-6 rounded-xl">
          <section className="flex justify-start items-start w-full">
            <Link href={`/${lang}/dashboard/visit`}>
              <Iconify icon="mdi:arrow-collapse-left" width={40} />
            </Link>
          </section>
          <section className="flex justify-between gap-6">
            <h6 className="font-semibold">Visit Detail</h6>
            <section className="flex flex-col text-right">
              <p>{visit?.Hospital?.name}</p>
              <small>{visit?.Hospital?.address}</small>
              <p>{localizePhoneNumber(visit?.Hospital?.phone_number)}</p>
            </section>
          </section>
          <section className="flex justify-between gap-6">
            <section className="flex flex-col text-left">
              <b>Start</b>
              <p>{formatDate({ date: visit?.date_start, style: "short", withTime: true })}</p>
            </section>
            <section className="flex flex-col text-right">
              <b>End</b>
              <p>{formatDate({ date: visit?.date_end, style: "short", withTime: true })}</p>
            </section>
          </section>
          <section className="flex justify-between gap-6">
            <section className="flex flex-col text-left">
              <b>Diagnosis</b>
              <p>{visit?.diagnosis}</p>
            </section>
            <section className="flex flex-col text-right">
              <b>Case Notes</b>
              <p>{visit?.case_notes}</p>
            </section>
          </section>
          <section className="flex justify-between gap-6">
            <section className="flex flex-col">
              <b>
                {visit?.User?.first_name} {visit?.User?.last_name}
              </b>
              <p>{getUserAge(visit?.User?.date_of_birth)}</p>
            </section>
            <section className="flex flex-col text-right">
              <p>
                <b>W:</b> {visit?.weight} kg
              </p>
              <p>
                <b>H:</b> {visit?.height} cm
              </p>
              <p>
                <b>T:</b> {getCelius(visit?.temperature)}
              </p>
              <p>
                <b>BP:</b> {visit?.blood_presure}
              </p>
            </section>
          </section>
          <section className="flex flex-col">
            <section className="flex justify-between items-end mb-2">
              <b>Treatments</b>
              <Button size="small" rounded="md" onClick={() => setModalTreatment(true)}>
                Add
              </Button>
            </section>
            {visit?.Treatments?.map((e) => (
              <section key={e?.id} className="flex justify-between">
                <p>{e.medical_treatment}</p>
                <p>{formatCurrency({ amount: e.price, currency: e.currency })}</p>
              </section>
            ))}
            {visit?.currency ? (
              <Fragment>
                <section className="flex justify-between">
                  <p>Due Amount</p>
                  <b>{formatCurrency({ amount: visit?.due_amount, currency: visit?.currency })}</b>
                </section>
                <section className="flex justify-between">
                  <p>Paid Amount</p>
                  <b>{formatCurrency({ amount: visit?.paid_amount, currency: visit?.currency })}</b>
                </section>
              </Fragment>
            ) : null}
          </section>
        </section>
      </article>
    </Fragment>
  );
}
