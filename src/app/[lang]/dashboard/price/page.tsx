import { type SearchParams } from "@/types";
import PriceContainer from "./components/PriceContainer";

type Props = { searchParams: SearchParams };

export default function PricePage({ searchParams }: Props) {
  return <PriceContainer searchParams={searchParams} />;
}
