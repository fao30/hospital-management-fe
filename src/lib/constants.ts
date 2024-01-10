import { type Gender, type RoleId } from "@/api/schema/schemas";
import { COLORS } from "@/styles/theme";
import { type MenuItemKey } from "@/types";

export const PAGINATION_LIMIT = 50;

export const MENU_ICON_SIZE = 25;

export const MENU_ITEMS = ["/", "/medicine", "/visit", "/schedule", "/user"] as const;

export const MENU_ITEMS_TO_REMOVE: Record<RoleId, MenuItemKey[]> = {
  1: [],
  2: [],
  3: ["/user"],
  4: ["/user"],
  5: ["/user"],
  6: ["/user"],
};

export const GENDERS: {
  value: Gender;
  icon: string;
  label: string;
  color: string;
}[] = [
  {
    icon: "material-symbols:male",
    value: "MALE",
    label: "Male",
    color: COLORS.blue,
  },
  {
    icon: "material-symbols:female",
    value: "FEMALE",
    label: "Female",
    color: "#ec4899",
  },
];

export const CURRENCIES = [
  {
    label: "IDR - Indonesian Rupiah",
    value: "IDR",
  },
  {
    label: "MYR - Malaysian Ringgit",
    value: "MYR",
  },
];

export const ICONS = {
  search: "material-symbols:search",
  searchName: "icon-park-outline:edit-name",
  email: "ic:outline-email",
  noProfileImage: "fluent:person-32-regular",
  female: "mdi:face-female",
  male: "mdi:face-male",
  signout: "material-symbols:logout",
  phone: "ph:phone",
  password: "mdi:password-outline",
  arrow: "typcn:arrow-up-outline",
  loading: "line-md:loading-loop",
  close: "mdi:close",
  add: "mdi:plus",
  home: "tabler:home",
  visitor: "ic:baseline-people",
  trainer: "icon-park-outline:gymnastics",
  package: "iconoir:gym",
  product: "material-symbols:grocery",
  transaction: "icon-park-outline:transaction",
  visit: "fluent-mdl2:user-event",
  schedule: "akar-icons:schedule",
  promo_codes: "ic:outline-local-offer",
  sport: "icon-park-outline:sport",
  place: "ic:outline-place",
  payment_method: "material-symbols:payments-outline",
  person: "material-symbols:person-outline",
  success: "icon-park-solid:folder-success",
  error: "icon-park-solid:folder-failed",
  info: "icon-park-solid:info",
  warning: "material-symbols:warning",
  check: "mdi:check",
  session: "carbon:prompt-session",
  validity: "game-icons:duration",
  url: "tabler:link",
  name: "mdi:rename-outline",
  invoice: "iconamoon:invoice",
  detail: "carbon:folder-details-reference",
  medicine: "icon-park-outline:medicine-chest",
  edit: "uil:edit",
};
