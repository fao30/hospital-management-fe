import { type RoleName } from "@/api/schema/schemas";

export const ICONS = {};

export const COLORS = {};

export const ROLES: { id: number; name: RoleName }[] = [
  { id: 2, name: "hospital-manager" },
  { id: 3, name: "hospital-admin" },
  {
    id: 4,
    name: "doctor",
  },
  {
    id: 5,
    name: "patient",
  },
  { id: 6, name: "pharmacist" },
];
