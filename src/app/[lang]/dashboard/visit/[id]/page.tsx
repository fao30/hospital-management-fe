import { getServerAuthSession } from "@/api/auth";
import { type Lang } from "@/types";
import VisitDetail from "./components/VisitDetail";

type Props = { params: { id: string; lang: Lang } };

export default async function VisitDetailPage({ params }: Props) {
  const session = await getServerAuthSession();

  if (session) return <VisitDetail id={params.id} session={session} />;
}
