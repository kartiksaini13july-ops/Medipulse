/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DoctorStatus = 'on-duty' | 'in-surgery' | 'on-break' | 'off-duty';

export type SlotStatus = 'available' | 'filling-fast' | 'full' | 'blocked';

export type AppointmentStatus =
  | 'confirmed'
  | 'checked-in'
  | 'in-consultation'
  | 'completed'
  | 'cancelled';

export type ConsultationMode = 'in-person' | 'video';

export interface Department {
  id: string;
  name: string;
  code: string;
  icon: string;
  tagline: string;
  description: string;
  headOfDepartment: string;
  floorWing: string;
  averageWaitTimeMins: number;
}

export interface Doctor {
  id: string;
  name: string;
  gender: 'male' | 'female';
  departmentId: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  photoUrl: string;
  status: DoctorStatus;
  statusNote?: string;
  roomNumber: string;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  shift: 'Morning (09:00 - 13:00)' | 'Evening (16:00 - 20:00)' | 'Full Day (09:00 - 18:00)';
  bio: string;
  opdCurrentToken: number;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  maxCapacity: number;
  bookedCount: number;
  status: SlotStatus;
}

export interface Appointment {
  id: string;
  bookingRef: string; // e.g. "PULSE-CARD-8924"
  tokenNumber: number; // e.g. 14
  uhid: string; // Unique Health ID e.g. "UHID-2026-9041"
  doctorId: string;
  departmentId: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  slotTime: string; // e.g. "10:30 AM"
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail: string;
  bloodGroup: string;
  consultationMode: ConsultationMode;
  symptoms: string;
  status: AppointmentStatus;
  createdAt: string; // ISO string
  emailDelivery: {
    status: 'delivered' | 'failed' | 'queued';
    sentAt: string;
    messageId: string;
    smtpServer: string;
    attemptCount: number;
  };
}

export interface EmailNotification {
  id: string;
  appointmentId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  previewSnippet: string;
  htmlBody: string;
  textBody: string;
  sentAt: string;
  status: 'delivered' | 'opened';
  headers: {
    from: string;
    to: string;
    subject: string;
    messageId: string;
    contentType: string;
    smtpStatus: string;
    tlsVersion: string;
  };
}

export interface HospitalQueueDoctorState {
  doctorId: string;
  doctorName: string;
  departmentName: string;
  roomNumber: string;
  status: DoctorStatus;
  currentlyServingToken: number;
  totalTokensIssuedToday: number;
  waitingTokens: number[];
  estimatedWaitMinutesPerPatient: number;
}
