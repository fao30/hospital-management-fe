"use client";

import { cn, getSelectedMenu } from "@/lib/functions";
import { COLORS } from "@/styles/theme";
import { type Lang } from "@/types";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { type ItemType, type MenuItemType } from "antd/es/menu/hooks/useItems";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  items: ItemType<MenuItemType>[];
  lang: Lang;
};

export default function DashboardMenu({ children, items }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
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
            {collapsed ? null : (
              <section className="w-full flex flex-col gap-4 text-cream items-center justify-center">
                <h5 className="text-dark font-bold">
                  DOCMOVE<span className="text-red">.</span>
                </h5>
              </section>
            )}
          </aside>
        </Layout.Sider>
      </Layout>

      <article className={cn("animate min-h-screen p-shorter bg-cream ml-[3.1rem]", { "xl:ml-64": !collapsed })}>{children}</article>
    </Fragment>
  );
}
