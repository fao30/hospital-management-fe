"use client";

import { type VisitDetailOutput } from "@/api/routers/visit";
import { type RoleId } from "@/api/schema/schemas";
import { type Treatment } from "@/api/schema/types";
import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { toastSuccess } from "@/components/Toast";
import { useStore } from "@/global/store";
import { ICONS } from "@/lib/constants";
import { formatCurrency, formatDate, getCelius, getUserAge, localizePhoneNumber } from "@/lib/functions";
import { COLORS } from "@/styles/theme";
import { api } from "@/trpc/react";
import { type Session } from "next-auth";
import Link from "next/link";
import { Fragment, useState } from "react";
import TreatmentCreateModal from "./TreatmentCreateModal";
import TreatmentEditModal from "./TreatmentEditModal";

type Props = { data: VisitDetailOutput; revalidateVisit: () => Promise<void>; session: Session };

export default function VisitDetail({ data, revalidateVisit, session }: Props) {
  const { visit } = data;
  const { lang, t } = useStore();
  const [modalTreatment, setModalTreatment] = useState(false);
  const [modalTreatmentEdit, setModalTreatmentEdit] = useState(false);
  const [isEditTeatmentDoctor, setIsEditTreatmentDoctor] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isEditPaidAmount, setIsEditPaidAmount] = useState<boolean>(false);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const { mutate: updatePaidAmount } = api.visit.updatePaidAmount.useMutation({
    onSuccess: async () => {
      await revalidateVisit();
      setIsEditPaidAmount(false);
      toastSuccess({ t, description: "Paid Amount updated" });
    },
  });

  const allowedToAddTreatment: RoleId[] = [1, 4];
  const allowedToEditPaidAmount: RoleId[] = [1, 2, 3];
  const allowedToEditTreatment: RoleId[] = [1, 2, 3, 4];

  return (
    <Fragment>
      <TreatmentCreateModal
        revalidateVisit={revalidateVisit}
        showModal={modalTreatment}
        closeModal={() => setModalTreatment(false)}
        data={data}
        session={session}
        isEdit={isEditTeatmentDoctor}
        selectedTreatment={selectedTreatment}
      />
      <TreatmentEditModal
        visit={data}
        revalidateVisit={revalidateVisit}
        data={selectedTreatment}
        showModal={modalTreatmentEdit}
        closeModal={() => setModalTreatmentEdit(false)}
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
              <section className="flex gap-2">
                {allowedToAddTreatment.includes(session.user.role_id) ? (
                  <Button size="small" rounded="md" onClick={() => setModalTreatment(true)}>
                    Add
                  </Button>
                ) : null}
              </section>
            </section>
            {visit?.Treatments?.map((e) => (
              <section key={e?.id} className="flex justify-between items-center">
                <Fragment>
                  <p>{e.medical_treatment}</p>
                  <section className="flex gap-2 items-center">
                    <p>{e?.currency && e?.price ? formatCurrency({ amount: e.price, currency: e.currency }) : "Unassigned"}</p>

                    {allowedToEditTreatment.includes(session.user.role_id) ? (
                      <Iconify
                        onClick={() => {
                          if (session?.user?.role_id === 4) {
                            setModalTreatment(true);
                            setIsEditTreatmentDoctor(true);
                          } else {
                            setModalTreatmentEdit(true);
                          }
                          setSelectedTreatment(e);
                        }}
                        icon={ICONS.edit}
                        color={COLORS.blue}
                      />
                    ) : null}
                  </section>
                </Fragment>
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

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updatePaidAmount({ visitId: visit.id, body: { paid_amount: paidAmount } });
                    }}
                    className="flex gap-2 items-center"
                  >
                    {isEditPaidAmount ? (
                      <Input
                        max={visit.due_amount}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(+e.target.value)}
                        type="number"
                      />
                    ) : (
                      <b>{formatCurrency({ amount: visit?.paid_amount, currency: visit?.currency })}</b>
                    )}
                    {allowedToEditPaidAmount.includes(session.user.role_id) && !isEditPaidAmount ? (
                      <Iconify
                        onClick={() => {
                          setIsEditPaidAmount(true);
                          setPaidAmount(visit?.paid_amount ?? 0);
                        }}
                        icon={ICONS.edit}
                        color={COLORS.blue}
                      />
                    ) : (
                      allowedToEditPaidAmount.includes(session.user.role_id) && (
                        <button type="submit">
                          <Iconify color={COLORS.blue} icon="mdi:check" />
                        </button>
                      )
                    )}
                  </form>
                </section>
              </Fragment>
            ) : null}
          </section>
        </section>
      </article>
    </Fragment>
  );
}
