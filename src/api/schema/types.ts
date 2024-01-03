import { type Gender, type RoleName } from "@schema/schemas";

export type User = {
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  email: string;
  password?: string;
  phoneNumber: string;
  isActive: boolean;

  // relations
  countryId: number;
  roleId: number;
};

export type Role = {
  id: number;
  name: RoleName;
};

export type Country = {
  id: number;
  countryCode: string;
  name: string;
};

export type HospitalEmployee = {
  id: string;
  isHospitalAdmin: boolean;

  // relations
  hospitalId: number;
  userId: number;
};

export type Visit = {
  dateStart: Date;
  dateEnd: Date;
  weight: number;
  height: number;
  temperature: number;
  bloodPressure: number;
  dueAmount: number;
  paidAmount: number;
  diagnosis: string;
  caseNotes: string;
  gender: Gender;

  // relations
  statusId: number;
  patientId: number;
  hospitalId: number;
};

export type PaymentStatus = {
  id: number;
  name: string;
};

export type File = {
  id: number;
  name: string;

  // relations
  treatmentId: number;
};

export type Hospital = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
};

export type Treatment = {
  id: number;
  medicalTreatment: string;
  currency: string;
  price: number;

  // relations
  doctorId: number;
  visitId: number;
};

export type MedicinesTreatment = {
  id: number;
  medicinesTreatment: string;
  quantity: number;

  // relations
  visitId: number;
  medicineId: number;
};

export type Medicine = {
  id: number;
  articleNumber: string;
  currency: string;
  price: string;
  inStock: number;

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
  alergyId: number;
  userId: number;
};
