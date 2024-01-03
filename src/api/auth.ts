import { env } from "@/env";
import { schema } from "@schema/schemas";
import { jwtDecode } from "jwt-decode";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; token: string; refreshToken: string } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  jwt: { maxAge: 604800 },
  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),
    session: async ({ session, token }) => {
      const updatedToken = token;
      const decodedToken = jwtDecode(token.token as string);

      if (Date.now() < decodedToken.exp!) {
        const res = await fetch(env.NEXT_PUBLIC_API + "/login/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: token.refresh_token }),
        });

        const data = (await res.json()) as { token: string };
        updatedToken.token = data.token;
      }

      return {
        ...session,
        user: { ...session.user, token: updatedToken.token, refreshToken: token.refresh_token },
      };
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
