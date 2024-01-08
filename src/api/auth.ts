import { env } from "@/env";
import { schema } from "@schema/schemas";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      token: string;
      role_id: number;
      hospital_id: number;
      iat: number;
      exp: number;
      jti: string;
    } & DefaultSession["user"];
  }
}

type LoginData = {
  data: { token: string; id: number; role_id: number; hospital_id: number };
  iat: number;
  exp: number;
  jti: string;
};

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 86400 }, // 1 day
  jwt: { maxAge: 86400 }, // 1 day
  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),
    session: async ({ session, token }) => {
      const { data, ...rest } = token as LoginData;
      return { ...session, user: { ...session.user, ...data, ...rest } };
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        const validation = schema.login.safeParse(credentials);

        if (validation.success) {
          const res = await fetch(env.NEXT_PUBLIC_API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validation.data),
          });
          if (!res.ok) return null;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return await res.json();
        }

        return null;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
