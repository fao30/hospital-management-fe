import Iconify from "@/components/Iconify";
import { formatDate } from "@/lib/functions";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import Link from "next/link";

type Props = { params: { id: string; lang: Lang } };

export default async function VisitDetail({ params }: Props) {
  const { visit } = await api.visit.detail.query({ visitId: parseInt(params.id) });
  console.log(visit);

  return (
    <article className="flex items-center justify-center min-h-screen flex-col gap-6">
      <section className="flex justify-start items-start w-full">
        <Link href={`/${params.lang}/dashboard/visit`}>
          <Iconify icon="mdi:arrow-collapse-left" width={40} />
        </Link>
      </section>
      <h6>Visit</h6>
      <section className="flex flex-col">
        <p>from {formatDate({ date: visit?.date_start, style: "short", withTime: true })}</p>
        <p>to {formatDate({ date: visit?.date_end, style: "short", withTime: true })}</p>
      </section>
      <section className="flex flex-col gap-4">
        <p>
          Name: {visit?.User?.first_name} {visit?.User?.last_name}
        </p>
      </section>
    </article>
  );
}
