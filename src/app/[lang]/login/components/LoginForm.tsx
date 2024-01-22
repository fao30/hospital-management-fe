"use client";

import { schema, type Login } from "@/api/schema/schemas";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { ICONS } from "@/lib/constants";
import { type Dictionary, type Lang, type SearchParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import io from "socket.io-client";

type Props = { searchParams: SearchParams; lang: Lang; t: Dictionary };

export default function LoginForm({ searchParams, lang, t }: Props) {
  const router = useRouter();
  const socket = io("wss://fao-med.faotech.dev", {
    path: "/socket.io/",
    transports: ["websocket"],
    autoConnect: true,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({ resolver: zodResolver(schema.login) });

  const onSubmit: SubmitHandler<Login> = (data) => logIn(data);

  const { mutate: logIn, isPending: loading } = useMutation({
    mutationFn: async (data: Login) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res?.error) {
        socket.emit("add-socket-id", data.email);
        toastSuccess({ t, description: t.Login.success });
        router.push(`/${lang}${searchParams.callbackUrl ? searchParams.callbackUrl : "/dashboard"}`);
      } else toastError({ t, description: t.Login.failed });
    },
  });

  return (
    <article className="flex min-h-screen justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 shadow-lg rounded-md bg-gray-50 w-[24rem] flex flex-col gap-8">
        <h3 className="text-dark font-bold">
          faoTech<span className="text-briquette">.</span>
        </h3>
        <section className="flex flex-col gap-6">
          <Input
            placeholder="admin@faoTech.com.my "
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
