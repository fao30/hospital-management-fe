import { type Gender, type RoleName } from "@schema/schemas";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  date_of_birth: string;
  gender: Gender;
  email: string;
  password: string;
  phone_number: string;
  is_active: boolean;

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

  // relations
  status_id: number;
  patient_id: number;
  hospital_id: number;
};

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

  // relations
  doctor_id: number;
  visit_id: number;
};

export type MedicinesTreatment = {
  id: number;
  medicines_treatment: string;
  quantity: number;
  amount: string;

  // relations
  visit_id: number;
  medicine_id: number;
};

export type Medicine = {
  id: number;
  article_number: string;
  currency: string;
  price: string;
  in_stock: number;

  // relations
  hospitalid: number;
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

export type DateTime = { updatedAt: Date; createdDate: Date };
