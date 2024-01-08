import { type SearchParams } from "@/types";
import VisitContainer from "./components/VisitContainer";

type Props = { searchParams: SearchParams };

export default async function VisitPage({ searchParams }: Props) {
  return <VisitContainer searchParams={searchParams} />;
}
