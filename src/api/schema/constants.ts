import { type PaymentStatusName, type RoleName } from "@schema/schemas";

export const ROLES: { id: number; name: RoleName; label?: string }[] = [
  { id: 2, name: "hospital-manager", label: "Hospital Manager" },
  { id: 3, name: "hospital-admin", label: "Hospital Admin" },
  { id: 4, name: "doctor", label: "Doctor" },
  { id: 5, name: "patient", label: "Patient" },
  { id: 6, name: "pharmacist", label: "Pharmacist" },
];

export const PAYMENT_STATUSES: { id: number; name: PaymentStatusName; label?: string }[] = [
  { id: 1, name: "full_paid", label: "Fully Paid" },
  { id: 2, name: "partially_paid", label: "Partially Paid" },
  { id: 3, name: "unpaid", label: "Unpaid" },
];
