import { z } from "zod";

export class schema {
  // enums
  static gender = z.enum(["MALE", "FEMALE"]);
  static roleName = z.enum(["superadmin", "hospital-manager", "hospital-admin", "doctor", "patient", "pharmacist"]);
  static paymentStatusName = z.enum(["full_paid", "partially_paid", "unpaid"]);

  // others
  static email = z.string().email();
  static pagination = { page: z.number().min(1), limit: z.number().optional() };
  static login = z.object({ email: schema.email, password: z.string().min(4) });

  // routers
  static user = class {
    static list = z.object({ params: z.object({ ...schema.pagination }) });
    static register = z.object({
      body: z.object({
        first_name: z.string(),
        last_name: z.string(),
        date_of_birth: z.string(),
        email: schema.email,
        password: z.string(),
        phone_number: z.string(),
        gender: schema.gender,
        country_id: z.number(),
        role_id: z.number(),
        hospital_id: z.number(),
        // make it false after dev for verification proccess
        is_active: z.boolean().default(true),
      }),
    });
  };

  static hospital = class {
    static create = z.object({
      body: z.object({
        name: z.string(),
        address: z.string(),
        phone_number: z.string(),
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
        payment_status_id: z.number(),
        patient_id: z.number(),
        hospital_id: z.number(),
        due_amount: z.number(),
        paid_amount: z.number(),
        weight: z.number(),
        heigh: z.number(),
        temperature: z.number(),
        blood_presure: z.number(),
        diagnosis: z.string(),
        case_notes: z.string(),
        is_patient_discharged: z.boolean(),
        // date_start, date_end
      }),
    });

    static update = z.object({
      visitId: z.number(),
      body: this.create.shape.body,
    });
  };

  static medicine = class {
    static create = z.object({
      body: z.object({
        hospital_id: z.number(),
        article_number: z.string(),
        currency: z.string(),
        price: z.string(),
        in_stock: z.number(),
        manufacturer: z.string(),
        expiry_date: z.string(),
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
        visit_id: z.string(),
        medical_treatment: z.string(),
        currency: z.string(),
        price: z.number(),
      }),
    });
    static update = z.object({
      treatmentId: z.number(),
      body: this.create.shape.body,
    });
  };

  static medicineTreatment = class {
    static create = z.object({
      body: z.object({
        medicine_id: z.number(),
        medicines_treatment: z.string(),
        quantity: z.number().min(1),
        visit_id: z.number(),
        dischardged: z.boolean(),
        newProperty: z.string(),
      }),
    });

    static update = z.object({
      medicineTreatmentId: z.number(),
      body: this.create.shape.body,
    });
  };
}

// type infereces from zod (enums, etc)
export type Gender = z.infer<typeof schema.gender>;
export type RoleName = z.infer<typeof schema.roleName>;
export type PaymentStatusName = z.infer<typeof schema.paymentStatusName>;
export type Login = z.infer<typeof schema.login>;
