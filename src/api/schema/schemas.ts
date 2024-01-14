import { PAGINATION_LIMIT } from "@/lib/constants";
import { number, string, z } from "zod";

const stringMessage = (field: string, min: number) => `${field} must contain at least ${min} character(s)`;
const numberMessage = (field: string, min: number) => `${field} must be greater than or equal to ${min}`;

export class schema {
  // enums
  static sorting = z.enum(["ASC", "DESC"]);
  static gender = z.enum(["MALE", "FEMALE"]);
  static roleName = z.enum(["superadmin", "hospital-manager", "hospital-admin", "doctor", "patient", "pharmacist"]);
  static paymentStatusName = z.enum(["full_paid", "partially_paid", "unpaid"]);
  static scheduleStatus = z.enum(["SCHEDULED", "CANCELLED", "NOT_SHOW", "DONE"]);

  // others
  static email = z.string().email();
  static pagination = { page: z.coerce.number().default(1), limit: z.coerce.number().default(PAGINATION_LIMIT) };
  static login = z.object({ email: schema.email, password: z.string().min(6, stringMessage("Password", 6)) });
  static phoneNumber = z
    .string()
    .regex(/^\d+$/, "Provide a valid phone number")
    .regex(/^62|61/, "Phone Number should starts with number 61 or 62")
    .min(9, "At least 9 characters")
    .max(14);
  static date = z.string().min(1, "Provide a date");

  // routers
  static user = class {
    static list = z.object({ ...schema.pagination, role_id: z.number().optional() });
    static register = z.object({
      body: z
        .object({
          first_name: z.string().min(1, "Required"),
          last_name: z.string().min(1, "Required"),
          date_of_birth: schema.date,
          email: z.string().optional(),
          password: z.string().optional(),
          phone_number: schema.phoneNumber,
          gender: schema.gender,
          country_id: z.number(),
          role_id: z.number(),
          hospital_id: z.number(),
          id_number: z.string().min(1, "Provide a ID Number"),
          // make it false after dev for verification proccess
          is_active: z.boolean().default(true),
        })
        .refine(
          ({ role_id, password }) => {
            if (role_id !== 5 && !password) return false;
            return true;
          },
          { message: "Password is required", path: ["password"] },
        )
        .refine(
          ({ role_id, email }) => {
            if (role_id !== 5 && !email) return false;
            return true;
          },
          { message: "Email is required", path: ["email"] },
        ),
    });
  };

  static hospital = class {
    static create = z.object({
      body: z.object({
        name: z.string(),
        address: z.string(),
        phone_number: schema.phoneNumber,
        is_active: z.boolean().default(true),
        max_users: z.number().min(1),
      }),
    });
    static update = z.object({
      hospitalId: z.number(),
      body: this.create.shape.body,
    });
  };

  static visit = class {
    static create = z.object({
      body: z.object({
        payment_status_id: z.number().nullable(),
        patient_id: z.number(),
        hospital_id: z.number(),
        due_amount: z.number().nullable(),
        paid_amount: z.number().nullable(),
        weight: z.number().min(1),
        height: z.number().min(1),
        temperature: z.number().min(1),
        blood_presure: z.number().min(1),
        diagnosis: z.string().min(1),
        case_notes: z.string().min(1),
        is_patient_discharged: z.boolean().default(false),
        date_start: schema.date,
        date_end: schema.date.optional(),
      }),
    });

    static update = z.object({
      visitId: z.number(),
      body: this.create.shape.body,
    });

    static list = z.object({
      ...schema.pagination,
      createdAt: z.string().optional(),
    });
  };

  static medicine = class {
    static list = z.object({ ...schema.pagination });
    static create = z.object({
      body: z.object({
        name: z.string().min(1, stringMessage("Medicine name", 1)),
        hospital_id: z.number(),
        article_number: z.string().min(1, stringMessage("Article number", 1)),
        currency: z.string(),
        price: z.number().min(1, numberMessage("Price", 1)),
        in_stock: z.number().nullable(),
        manufacturer: z.string().min(1, stringMessage("Manufacturer", 1)),
        expiry_date: z.string().min(1, "Select expiry date"),
        is_patient_discharged: z.boolean().default(false),
      }),
    });
    static update = z.object({
      medicineId: z.number(),
      body: this.create.shape.body,
    });
  };

  static treatment = class {
    static create = z.object({
      body: z.object({
        doctor_id: z.number(),
        visit_id: z.number(),
        medical_treatment: z.string().min(4, stringMessage("Medical treatment", 4)),
        currency: z.string().nullable(),
        price: z.number().nullable(),
      }),
    });
    static update = z.object({
      treatmentId: z.number(),
      body: z.object({
        doctor_id: z.number(),
        visit_id: z.number(),
        medical_treatment: z.string().min(4, stringMessage("Medical treatment", 4)),
        currency: z.string().min(1, "Pick a currency"),
        price: z.number().min(1, numberMessage("Price", 1)),
      }),
    });
    static updateByDoctor = z.object({
      treatmentId: z.number(),
      body: z.object({ medical_treatment: z.string().min(4, stringMessage("Medical treatment", 4)) }),
    });
  };

  static schedule = class {
    static list = z.object({
      ...schema.pagination,
      filter_by_date: z.coerce.boolean().default(true),
      date_time: z.string(),
      from_date_time: z.string().optional(),
      to_date_time: z.string().optional(),
      sort_doctor_id: schema.sorting,
    });

    static create = z.object({
      body: z.object({
        hospital_id: z.number(),
        doctor_id: z.number().min(1),
        patient_id: z.number().min(1),
        admin_id: z.number().optional(),
        is_admin_approved: z.boolean(),
        is_doctor_approved: z.boolean(),
        status: schema.scheduleStatus.default("SCHEDULED"),
        date_time: z.string(),
      }),
    });
  };

  static medicineTreatment = class {
    static create = z.object({
      body: z.object({
        medicine_id: z.number(),
        treatment_id: z.number(),
        medicines_treatment: z.string(),
        quantity: z.number().min(1, numberMessage("Quantity", 1)),
        visit_id: z.number(),
      }),
    });

    static update = z.object({
      medicineTreatmentId: z.number(),
      body: this.create.shape.body,
    });
  };

  static price = class {
    static list = z.object({
      ...schema.pagination,
    });

    static create = z.object({
      body: z.object({
        hospital_id: z.number(),
        treatment_name: z.string().min(1),
        price: z.number().min(1),
        currency: z.string(),
      }),
    });

    static update = z.object({
      list_price_id: z.number(),
      body: z.object({
        hospital_id: z.number(),
        treatment_name: z.string().min(1),
        price: z.number().min(1),
        currency: z.string(),
      }),
    });
  };
}

// type infereces from zod (enums, etc)
export type Gender = z.infer<typeof schema.gender>;
export type RoleName = z.infer<typeof schema.roleName>;
export type PaymentStatusName = z.infer<typeof schema.paymentStatusName>;
export type Login = z.infer<typeof schema.login>;
export type RoleId = 1 | 2 | 3 | 4 | 5 | 6;
export type ScheduleStatus = z.infer<typeof schema.scheduleStatus>;
