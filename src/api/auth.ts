import { env } from "@/env";
import { schema } from "@schema/schemas";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; token: string } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),
    session: async ({ session, token }) => ({ ...session, user: { ...session.user, id: token.id, token: token.token } }),
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
          console.log(res.json());
          return res.json();
        }

        return null;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
