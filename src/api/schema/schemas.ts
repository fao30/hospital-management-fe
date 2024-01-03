import { z } from "zod";

export class schema {
  // enums
  static gender = z.enum(["MALE", "FEMALE"]);
  static roleName = z.enum(["superadmin", "hospital-manager", "hospital-admin", "doctor", "patient", "pharmacist"]);
  static paymentStatusName = z.enum(["full_paid", "partially_paid", "unpaid"]);

  // others
  static pagination = { page: z.number().min(1), limit: z.number().optional() };
  static login = z.object({ email: z.string().email(), password: z.string().min(4) });

  static user = {
    list: z.object({ params: z.object({ ...schema.pagination }) }),
    create: z.object({ body: z.object({ name: z.string() }) }),
  };
}

export type Gender = z.infer<typeof schema.gender>;
export type RoleName = z.infer<typeof schema.roleName>;
export type PaymentStatusName = z.infer<typeof schema.paymentStatusName>;
