import "@/styles/tailwind.css";
import "@/styles/stylesheet.css";
import { getServerAuthSession } from "@/api/auth";
import AuthLogoutHelper from "@/components/AuthLogoutHelper";
import { env } from "@/env";
import { TRPCReactProvider } from "@/trpc/react";
import { type Lang } from "@/types";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import jwt from "jsonwebtoken";
import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "faoMed",
  description: "faoMed",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function RootLayout({ children, params }: Props) {
  const session = await getServerAuthSession();
  let isTokenValid;

  if (session) {
    jwt.verify(session.user.token, env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) isTokenValid = false;
    });
  }

  return (
    <html lang={params.lang} className={montserrat.variable}>
      <body>
        <AuthLogoutHelper isTokenValid={isTokenValid} />
        <TRPCReactProvider cookies={cookies().toString()}>
          <AntdRegistry>
            <ConfigProvider>
              <main>{children}</main>
            </ConfigProvider>
          </AntdRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
