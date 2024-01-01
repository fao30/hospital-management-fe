import { env } from "@/env";
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
      authorize: async () => {
        return null;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
