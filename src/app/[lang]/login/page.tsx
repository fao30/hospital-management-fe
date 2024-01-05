"use client";

import { schema, type Login } from "@/api/schema/schemas";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { ICONS } from "@/lib/constants";
import { type Lang, type SearchParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

type Props = { searchParams: SearchParams; params: { lang: Lang } };

export default function LoginPage({ searchParams, params }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({ resolver: zodResolver(schema.login) });

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
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 shadow-lg rounded-md bg-gray-50 w-[24rem] flex flex-col gap-8">
        <h3 className="text-dark font-bold">
          DOCMOVE<span className="text-red">.</span>
        </h3>
        <section className="flex flex-col gap-6">
          <Input
            placeholder="admin@docmove.com.my "
            error={errors.email?.message}
            {...register("email")}
            type="email"
            icon={ICONS.email}
          />
          <Input error={errors.password?.message} {...register("password")} type="password" withPasswordIcon />
        </section>
        <Button loading={loading} type="submit">
          Login
        </Button>
      </form>
    </article>
  );
}
