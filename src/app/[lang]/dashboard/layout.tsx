import { getServerAuthSession } from "@/api/auth";
import DashboardMenu from "@/components/DashboardMenu";
import DashboardNavigator from "@/components/DashboardNavigator";
import Iconify from "@/components/Iconify";
import { ICONS, MENU_ICON_SIZE, MENU_ITEMS_TO_REMOVE } from "@/lib/constants";
import { type Lang, type MenuItemKey } from "@/types";
import { redirect } from "next/navigation";
import Socket from "../../../components/Socket";

type Props = {
  params: { lang: Lang };
  children: React.ReactNode;
};

export default async function DashboardLayout({ params, children }: Props) {
  const { lang } = params;
  const session = await getServerAuthSession();
  if (!session) redirect(`/${params.lang}/login/?callbackUrl=/dashboard`);

  const items: { title: string; key: MenuItemKey; label: React.JSX.Element; icon: React.JSX.Element }[] = [
    {
      title: "",
      key: "/",
      label: (
        <DashboardNavigator href="/" lang={lang}>
          Home
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.home} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/visit",
      label: (
        <DashboardNavigator href="/visit" lang={lang}>
          Visit
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.visit} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/medicine",
      label: (
        <DashboardNavigator href="/medicine" lang={lang}>
          Medicine
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.medicine} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/schedule",
      label: (
        <DashboardNavigator href="/schedule" lang={lang}>
          Schedule
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.schedule} width={MENU_ICON_SIZE} />,
    },
    {
      title: "",
      key: "/user",
      label: (
        <DashboardNavigator href="/user" lang={lang}>
          User
        </DashboardNavigator>
      ),
      icon: <Iconify icon={ICONS.visitor} width={MENU_ICON_SIZE} />,
    },
  ];

  const filteredItems = items.filter((item) => {
    const itemsToRemove = MENU_ITEMS_TO_REMOVE[session.user.role_id];
    return !itemsToRemove.includes(item.key);
  });

  return (
    <DashboardMenu items={filteredItems} lang={lang}>
      {children}
      <Socket></Socket>
    </DashboardMenu>
  );
}
