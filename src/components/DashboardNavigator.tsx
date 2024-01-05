import { cn } from "@/lib/functions";
import { type Lang } from "@/types";
import Link from "next/link";

const DashboardNavigator = ({
  href,
  newTab,
  className,
  isChildren,
  children,
  lang,
}: {
  href: string;
  isChildren?: boolean;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  lang: Lang;
}) => {
  return (
    <Link
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn(`text-base select-none font-medium ${className}`, { "ml-3 text-sm": isChildren })}
      href={`/${lang}/dashboard${href}`}
    >
      {children}
    </Link>
  );
};

export default DashboardNavigator;
