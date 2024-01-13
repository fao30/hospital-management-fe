import { getServerAuthSession } from "@/api/auth";
import { type SearchParams } from "@/types";
import PriceContainer from "./components/PriceContainer";

type Props = { searchParams: SearchParams };

export default async function PricePage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (session) return <PriceContainer searchParams={searchParams} session={session} />;
}
