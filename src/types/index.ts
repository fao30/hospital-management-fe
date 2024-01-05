import { type AppRouter } from "@/api/root";
import { type MENU_ITEMS } from "@/lib/constants";
import { type useDictionary } from "@/lib/dictionary";
import { type internationalization } from "@/lib/internationalization";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type SearchParams = Record<string, string | string[] | undefined>;
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEventHandler<HTMLButtonElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type Lang = (typeof internationalization)["locales"][number];
export type Dictionary = UnwrapPromise<ReturnType<typeof useDictionary>>;
export type MenuItemKey = (typeof MENU_ITEMS)[number];
