import "@/styles/tailwind.css";
import "@/styles/stylesheet.css";
import { getServerAuthSession } from "@/api/auth";
import { env } from "@/env";
import HigherOrderComponent from "@/global/HigherOrderComponent";
import { useDictionary } from "@/lib/dictionary";
import { theme } from "@/styles/theme";
import { TRPCReactProvider } from "@/trpc/react";
import { type Lang } from "@/types";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import jwt from "jsonwebtoken";
import { type Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";
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
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

type Props = { children: React.ReactNode; params: { lang: Lang } };

export default async function RootLayout({ children, params }: Props) {
  const session = await getServerAuthSession();
  const t = await useDictionary(params.lang);
  let isTokenValid;

  if (session) {
    jwt.verify(session.user.token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) isTokenValid = false;
      if (decoded && typeof decoded !== "string" && Date.now() >= decoded.exp! * 1000) isTokenValid = false;
      if (Date.now() >= session.user.exp * 1000) isTokenValid = false;
    });
  }

  return (
    <html lang={params.lang} className={`${lato.variable} ${montserrat.variable}`}>
      <body>
        <HigherOrderComponent isTokenValid={isTokenValid} session={session} t={t} lang={params.lang}>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
              <TRPCReactProvider cookies={cookies().toString()}>
                <main>{children}</main>
              </TRPCReactProvider>
            </ConfigProvider>
          </AntdRegistry>
        </HigherOrderComponent>
      </body>
    </html>
  );
}
