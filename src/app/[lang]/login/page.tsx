"use client";

import { schema, type Login } from "@/api/schema/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function LoginPage() {
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
      } else alert("Email or password incorrect");
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} type="email" />
      <input {...register("password")} type="password" />
      <button disabled={loading} type="submit">
        Login
      </button>
    </form>
  );
}
