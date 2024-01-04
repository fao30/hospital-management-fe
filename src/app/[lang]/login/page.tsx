"use client";

import { schema, type Login } from "@/api/schema/schemas";
import { type Lang, type SearchParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default function LoginPage({ searchParams, params }: Props) {
  console.log(searchParams);
  const router = useRouter();
  const { register, handleSubmit } = useForm<Login>({ resolver: zodResolver(schema.login) });

  const onSubmit: SubmitHandler<Login> = (data) => logIn(data);

  const { mutate: logIn, isLoading: loading } = useMutation({
    mutationFn: async (data: Login) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res?.error) {
        alert("Logged In");
        router.push(`/${params.lang}${searchParams.callbackUrl ? (searchParams.callbackUrl as string) : "/dashboard"}`);
      } else alert("Email or password incorrect");
    },
  });

  return (
    <article className="flex min-h-screen justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 shadow-lg rounded-md bg-gray-50 w-[50%] flex flex-col gap-6">
        <input {...register("email")} type="email" />
        <input {...register("password")} type="password" />
        <button disabled={loading} type="submit">
          Login
        </button>
      </form>
    </article>
  );
}
