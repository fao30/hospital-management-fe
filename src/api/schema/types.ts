import { type Gender, type RoleName, type ScheduleStatus } from "@schema/schemas";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  date_of_birth: Date;
  gender: Gender;
  email: string;
  phone_number: string;
  is_active: boolean;
  is_on_duty: boolean;
  socket_id: string;

  // relations
  country_id: number;
  role_id: number;
  hospital_id: number;
};

export type Role = {
  id: number;
  name: RoleName;
};

export type Country = {
  id: number;
  name: string;
};

export type Visit = {
  id: number;
  date_start: Date;
  date_end: Date;
  weight: number;
  height: number;
  temperature: number;
  blood_presure: number;
  due_amount: number;
  paid_amount: number;
  diagnosis: string;
  case_notes: string;
  gender: Gender;
  is_patient_discharged: boolean;
  has_insurance: boolean;

  // relations
  payment_status_id: number;
  patient_id: number;
  hospital_id: number;
} & CreatorModifier;

export type PaymentStatus = {
  id: number;
  name: string;
};

export type File = {
  id: number;
  name: string;

  // relations
  treatment_id: number;
};

export type Hospital = {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  max_users: number;
};

export type Treatment = {
  id: number;
  medical_treatment: string;
  currency: string;
  price: number;
  start_time: Date;
  end_time: Date;

  // relations
  doctor_id: number;
  visit_id: number;
} & CreatorModifier;

export type MedicinesTreatment = {
  id: number;
  medicines_treatment: string;
  quantity: number;

  // relations
  visit_id: number;
  medicine_id: number;
  Medicine: Medicine;
};

export type Medicine = {
  id: number;
  name: string;
  article_number: string;
  currency: string;
  price: number;
  in_stock: number;
  manufacturer: string;
  expiry_date: Date;

  // relations
  hospital_id: number;
};

export type Alergy = {
  id: number;
  name: string;
};

export type AlergiesUser = {
  id: number;

  // relations
  alergy_id: number;
  user_id: number;
};

export type Schedule = {
  id: number;
  is_admin_approved: boolean;
  is_doctor_approved: boolean;
  date_time: Date;
  from_from_date_time: Date;
  to_from_date_time: Date;
  status: ScheduleStatus;

  // relations
  doctor_id: number;
  patient_id: number;
  admin_id: number;
} & CreatorModifier;

export type Price = {
  id: number;
  hospital_id: null;
  treatment_name: string;
  currency: string;
  price: number;
};

export type DateTime = { updatedAt: Date; createdDate: Date };
export type PaginationResponse = { count: number; totalPage: number };
export type CreatorModifier = { creator_id: number; modifier_id: number };
