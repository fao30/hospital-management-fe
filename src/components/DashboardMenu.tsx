"use client";

import { ROLES } from "@/api/schema/constants";
import { useStore } from "@/global/store";
import { ICONS } from "@/lib/constants";
import { cn, getSelectedMenu } from "@/lib/functions";
import { COLORS } from "@/styles/theme";
import { type Lang } from "@/types";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Iconify from "./Iconify";

type Props = {
  children: React.ReactNode;
  items: ItemType<MenuItemType>[];
  lang: Lang;
};

export default function DashboardMenu({ children, items }: Props) {
  const { session } = useStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(getSelectedMenu(pathname));
  // const handleCollapse = () => (collapsed ? undefined : setCollapsed(true));

  useEffect(() => {
    setSelectedMenu(getSelectedMenu(pathname));
  }, [pathname]);

  return (
    <Fragment>
      <Layout>
        <Layout.Sider
          style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 20 }}
          collapsedWidth={50}
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
        >
          <aside className="min-h-screen flex flex-col gap-6 justify-between pb-6">
            <nav className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="gap-2 flex items-center w-full justify-center h-14 text-cream"
              >
                {!collapsed ? (
                  <MenuFoldOutlined style={{ fontSize: "30px", color: COLORS.dark }} />
                ) : (
                  <MenuUnfoldOutlined style={{ fontSize: "30px", color: COLORS.dark }} />
                )}
              </button>
              <Menu selectedKeys={selectedMenu} mode="inline" items={items} />
            </nav>

            <section className="w-full flex flex-col gap-4 text-cream items-center justify-center">
              <button
                type="button"
                onClick={() => signOut()}
                className="items-center justify-center w-full bg-briquette py-2 flex gap-2 text-white"
              >
                <Iconify icon={ICONS.signout} width={30} />
                <p className={collapsed ? "hidden" : "text-lg"}>Logout</p>
              </button>
              {collapsed ? null : (
                <h5 className="text-dark font-bold">
                  faoTech<span className="text-briquette">.</span>
                </h5>
              )}
            </section>
          </aside>
        </Layout.Sider>
      </Layout>

      <section className={cn(`animate fixed top-0 w-full ml-[3.1rem] px-shorter py-2 bg-hover`, { "xl:ml-[15rem]": !collapsed })}>
        <p>{ROLES.find((e) => e.id === session?.user.role_id)?.label}</p>
      </section>

      <article className={cn("animate min-h-screen p-shorter bg-cream ml-[3.1rem]", { "xl:ml-[15rem]": !collapsed })}>
        {children}
      </article>
    </Fragment>
  );
}
