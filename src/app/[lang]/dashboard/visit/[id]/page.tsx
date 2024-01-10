import { getServerAuthSession } from "@/api/auth";
import { api } from "@/trpc/server";
import { type Lang } from "@/types";
import { revalidatePath } from "next/cache";
import VisitDetail from "./components/VisitDetail";

type Props = { params: { id: string; lang: Lang } };

export default async function VisitDetailPage({ params }: Props) {
  const data = await api.visit.detail.query({ visitId: parseInt(params.id) });
  const session = await getServerAuthSession();

  const revalidateVisit = async () => {
    "use server";
    revalidatePath(`/${params.lang}/dashboard/visit`);
  };

  return <VisitDetail data={data} revalidateVisit={revalidateVisit} session={session} />;
}
