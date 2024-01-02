import { z } from "zod";

export class schema {
  static gender = z.enum(["MALE", "FEMALE"]);
  static pagination = { page: z.number().min(1), limit: z.number().optional() };

  static user = {
    list: z.object({ params: z.object({ ...schema.pagination }) }),
    create: z.object({ body: z.object({ name: z.string() }) }),
  };
}

export type Gender = z.infer<typeof schema.gender>;
