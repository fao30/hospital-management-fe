import { useDictionary } from "@/lib/dictionary";
import { type Lang, type SearchParams } from "@/types";
import LoginForm from "./components/LoginForm";

type Props = {
  params: { lang: Lang };
  searchParams: SearchParams;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const t = await useDictionary(params.lang);
  return <LoginForm lang={params.lang} t={t} searchParams={searchParams} />;
}
