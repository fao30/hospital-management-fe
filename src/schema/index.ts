import { z } from "zod";

export class schema {
  static user = {
    list: { params: z.object({ page: z.number() }) },
  };
}
