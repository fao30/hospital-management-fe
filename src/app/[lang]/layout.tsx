import "@/styles/tailwind.css";
import "@/styles/stylesheet.css";
import { TRPCReactProvider } from "@/trpc/react";
import { type Lang } from "@/types";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
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

export default function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.lang} className={montserrat.variable}>
      <body>
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
