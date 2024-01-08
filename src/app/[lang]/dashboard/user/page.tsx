import { getServerAuthSession } from "@/api/auth";
import { useDictionary } from "@/lib/dictionary";
import { type Lang, type SearchParams } from "@/types";
import UserContainer from "./components/UserContainer";

type Props = { params: { lang: Lang }; searchParams: SearchParams };

export default async function UserPage({ params, searchParams }: Props) {
  const session = await getServerAuthSession();
  const t = await useDictionary(params.lang);

  return <UserContainer session={session} lang={params.lang} searchParams={searchParams} t={t} />;
}
