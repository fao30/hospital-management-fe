import { getServerAuthSession } from "@/api/auth";
import DashboardMenu from "@/components/DashboardMenu";
import DashboardNavigator from "@/components/DashboardNavigator";
import Iconify from "@/components/Iconify";
import { ICONS } from "@/lib/constants";
import { type Lang } from "@/types";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { redirect } from "next/navigation";

type Props = {
  params: { lang: Lang };
  children: React.ReactNode;
};

export default async function DashboardLayout({ params, children }: Props) {
  const { lang } = params;
  const session = await getServerAuthSession();
  if (!session) redirect(`/${params.lang}/login/?callbackUrl=/dashboard`);

  const items: ItemType<MenuItemType>[] = [
    {
      title: "",
      key: "/",
      label: (
        <DashboardNavigator href="/" lang={lang}>
          Home
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.home} width={25} />,
    },
    {
      title: "",
      key: "/medicine",
      label: (
        <DashboardNavigator href="/medicine" lang={lang}>
          Medicine
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.medicine} width={25} />,
    },
  ];

  return (
    <DashboardMenu items={items} lang={lang}>
      {children}
    </DashboardMenu>
  );
}
