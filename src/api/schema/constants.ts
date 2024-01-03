import { type PaymentStatusName, type RoleName } from "@schema/schemas";

export const ICONS = {};

export const COLORS = {};

export const ROLES: { id: number; name: RoleName }[] = [
  { id: 1, name: "superadmin" },
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

export const PAYMENT_STATUSES: { id: number; name: PaymentStatusName }[] = [
  {
    id: 1,
    name: "full_paid",
  },
  {
    id: 2,
    name: "partially_paid",
  },
  {
    id: 3,
    name: "unpaid",
  },
];
