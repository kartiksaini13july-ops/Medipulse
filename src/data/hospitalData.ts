/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Department,
  Doctor,
  TimeSlot,
  Appointment,
  EmailNotification,
} from '../types/hospital';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cardio',
    name: 'Cardiology & Heart Care',
    code: 'CARD',
    icon: 'HeartPulse',
    tagline: 'Comprehensive cardiac catheterization, rhythm disorders & preventive cardiology',
    description: 'Expert care for chest pain, arrhythmias, hypertension, heart failure, and coronary interventions.',
    headOfDepartment: 'Dr. Arvind Sharma',
    floorWing: 'Block B, 2nd Floor',
    averageWaitTimeMins: 12,
  },
  {
    id: 'dept-neuro',
    name: 'Neurology & Neuro Surgery',
    code: 'NEUR',
    icon: 'Brain',
    tagline: 'Precision brain, spine, stroke management & neuro-rehabilitation',
    description: 'Diagnosis and surgical interventions for headaches, epilepsy, stroke, neuropathy, and spine disorders.',
    headOfDepartment: 'Dr. Priya Raghavan',
    floorWing: 'Block A, 3rd Floor',
    averageWaitTimeMins: 15,
  },
  {
    id: 'dept-ortho',
    name: 'Orthopedics & Joint Care',
    code: 'ORTH',
    icon: 'Activity',
    tagline: 'Minimally invasive arthroscopy, fracture trauma & total joint replacements',
    description: 'Specialized diagnosis for sports injuries, joint wear, fractures, ligament tears, and arthritis.',
    headOfDepartment: 'Dr. Rajeshwar Saxena',
    floorWing: 'Block C, Ground Floor',
    averageWaitTimeMins: 10,
  },
  {
    id: 'dept-pedia',
    name: 'Pediatrics & Neonatology',
    code: 'PEDI',
    icon: 'Baby',
    tagline: 'Compassionate pediatric wellness, immunizations & newborn intensive care',
    description: 'Holistic care for infants, children, and adolescents with 24/7 pediatric emergency coverage.',
    headOfDepartment: 'Dr. Meera Nambiar',
    floorWing: 'Mother & Child Wing, 1st Floor',
    averageWaitTimeMins: 8,
  },
  {
    id: 'dept-derma',
    name: 'Dermatology & Cosmetology',
    code: 'DERM',
    icon: 'Sparkles',
    tagline: 'Clinical skin pathology, allergy testing & advanced laser therapeutics',
    description: 'Evidence-based treatment for eczema, psoriasis, acne, hair loss, and auto-immune skin conditions.',
    headOfDepartment: 'Dr. Vikramaditya Sen',
    floorWing: 'Block B, 1st Floor',
    averageWaitTimeMins: 10,
  },
  {
    id: 'dept-genmed',
    name: 'General Medicine & Diabetology',
    code: 'GMED',
    icon: 'Stethoscope',
    tagline: 'Primary clinical diagnostics, infectious disease control & metabolic health',
    description: 'Comprehensive consultations for fever, diabetes, thyroid disorders, and lifestyle medicine.',
    headOfDepartment: 'Dr. Ananya Roy',
    floorWing: 'Central OPD Wing, Ground Floor',
    averageWaitTimeMins: 7,
  },
  {
    id: 'dept-pulmo',
    name: 'Pulmonology & Chest Medicine',
    code: 'PULM',
    icon: 'Wind',
    tagline: 'Advanced spirometry, asthma care, COPD & sleep apnea diagnostics',
    description: 'Dedicated respiratory clinic for persistent cough, asthma, bronchitis, and post-viral recovery.',
    headOfDepartment: 'Dr. Tariq Farooq',
    floorWing: 'Block A, 2nd Floor',
    averageWaitTimeMins: 11,
  },
  {
    id: 'dept-gastro',
    name: 'Gastroenterology & Hepatology',
    code: 'GAST',
    icon: 'ShieldAlert',
    tagline: 'Endoscopy, liver disease management & gastrointestinal clinical health',
    description: 'Specialized management of GERD, IBS, fatty liver, ulcers, and inflammatory bowel diseases.',
    headOfDepartment: 'Dr. Sunita Deshmukh',
    floorWing: 'Block C, 2nd Floor',
    averageWaitTimeMins: 14,
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Arvind Sharma',
    gender: 'male',
    departmentId: 'dept-cardio',
    qualification: 'MD, DM (Cardiology) - AIIMS New Delhi, FACC (USA)',
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 428,
    consultationFee: 900,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-204',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Morning (09:00 - 13:00)',
    bio: 'Lead Interventional Cardiologist with over 4,500 successful coronary angioplasties and cardiac catheterizations.',
    opdCurrentToken: 14,
  },
  {
    id: 'doc-2',
    name: 'Priya Raghavan',
    gender: 'female',
    departmentId: 'dept-neuro',
    qualification: 'MBBS, M.Ch (Neuro Surgery) - PGIMER Chandigarh',
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 1000,
    photoUrl: 'https://images.unsplash.com/photo-1594824813715-37cbba2d9731?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-312',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Full Day (09:00 - 18:00)',
    bio: 'Pioneering micro-neurosurgery specialist in minimally invasive cranial and spinal disc reconstructions.',
    opdCurrentToken: 8,
  },
  {
    id: 'doc-3',
    name: 'Rajeshwar Saxena',
    gender: 'male',
    departmentId: 'dept-ortho',
    qualification: 'MS (Orthopedics) - CMC Vellore, Fellowship Arthroplasty (UK)',
    experienceYears: 16,
    rating: 4.8,
    reviewCount: 275,
    consultationFee: 750,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-108',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    shift: 'Morning (09:00 - 13:00)',
    bio: 'Chief Joint Replacement Surgeon specializing in computer-navigated knee and hip arthroplasty.',
    opdCurrentToken: 19,
  },
  {
    id: 'doc-4',
    name: 'Meera Nambiar',
    gender: 'female',
    departmentId: 'dept-pedia',
    qualification: 'MD (Pediatrics), DNB (Neonatology) - KEM Hospital Mumbai',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 520,
    consultationFee: 650,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-118',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Morning (09:00 - 13:00)',
    bio: 'Renowned child specialist focused on developmental milestones, pediatric respiratory allergies, and infant care.',
    opdCurrentToken: 11,
  },
  {
    id: 'doc-5',
    name: 'Vikramaditya Sen',
    gender: 'male',
    departmentId: 'dept-derma',
    qualification: 'MD (DVL) - Maulana Azad Medical College, FAM',
    experienceYears: 11,
    rating: 4.7,
    reviewCount: 198,
    consultationFee: 700,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-122',
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Evening (16:00 - 20:00)',
    bio: 'Dermatologist and clinical aesthetic physician specializing in trichology, psoriasis, and autoimmune dermatoses.',
    opdCurrentToken: 6,
  },
  {
    id: 'doc-6',
    name: 'Ananya Roy',
    gender: 'female',
    departmentId: 'dept-genmed',
    qualification: 'MD (Internal Medicine) - Lady Hardinge Medical College',
    experienceYears: 14,
    rating: 4.8,
    reviewCount: 460,
    consultationFee: 600,
    photoUrl: 'https://images.unsplash.com/photo-1594824813715-37cbba2d9731?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-102',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Full Day (09:00 - 18:00)',
    bio: 'Senior consultant internist focused on complex multimorbidity, hypertension, metabolic syndrome, and geriatric health.',
    opdCurrentToken: 24,
  },
  {
    id: 'doc-7',
    name: 'Tariq Farooq',
    gender: 'male',
    departmentId: 'dept-pulmo',
    qualification: 'DTCD, DNB (Respiratory Diseases) - Vallabhbhai Patel Chest Institute',
    experienceYears: 13,
    rating: 4.8,
    reviewCount: 220,
    consultationFee: 750,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    status: 'in-surgery',
    statusNote: 'Performing Emergency Bronchoscopy in ICU-3 (Expected back 11:30 AM)',
    roomNumber: 'OPD-215',
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
    shift: 'Morning (09:00 - 13:00)',
    bio: 'Interventional pulmonologist specializing in obstructive airway disorders, sarcoidosis, and sleep medicine.',
    opdCurrentToken: 4,
  },
  {
    id: 'doc-8',
    name: 'Sunita Deshmukh',
    gender: 'female',
    departmentId: 'dept-gastro',
    qualification: 'MD, DM (Gastroenterology) - Sanjay Gandhi PGIMS Lucknow',
    experienceYears: 17,
    rating: 4.9,
    reviewCount: 388,
    consultationFee: 850,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-230',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Evening (16:00 - 20:00)',
    bio: 'Expert hepatologist and therapeutic gastroenterologist managing chronic hepatitis, pancreatitis, and liver health.',
    opdCurrentToken: 9,
  },
];

// Helper to format date string YYYY-MM-DD
export function getDateOffset(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate realistic slots for doctors across 5 days
export function generateInitialSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const slotTimes = [
    { start: '09:00 AM', end: '09:30 AM' },
    { start: '09:30 AM', end: '10:00 AM' },
    { start: '10:00 AM', end: '10:30 AM' },
    { start: '10:30 AM', end: '11:00 AM' },
    { start: '11:00 AM', end: '11:30 AM' },
    { start: '11:30 AM', end: '12:00 PM' },
    { start: '12:00 PM', end: '12:30 PM' },
    { start: '12:30 PM', end: '01:00 PM' },
    { start: '04:00 PM', end: '04:30 PM' },
    { start: '04:30 PM', end: '05:00 PM' },
    { start: '05:00 PM', end: '05:30 PM' },
    { start: '05:30 PM', end: '06:00 PM' },
    { start: '06:00 PM', end: '06:30 PM' },
    { start: '06:30 PM', end: '07:00 PM' },
  ];

  INITIAL_DOCTORS.forEach((doc) => {
    // Generate for next 5 days
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const dateStr = getDateOffset(dayOffset);

      slotTimes.forEach((st, index) => {
        const slotId = `slot-${doc.id}-${dateStr}-${index}`;
        const maxCapacity = 3;

        // Create deterministic realistic booking variation
        let booked = 0;
        if (dayOffset === 0) {
          // Today's morning slots are mostly booked/filling
          if (index === 0 || index === 1) booked = 3; // full
          else if (index === 2 || index === 3) booked = 2; // filling fast (1 left)
          else if (index === 4) booked = 1; // available (2 left)
          else booked = 0; // available
        } else if (dayOffset === 1) {
          // Tomorrow
          if (index === 1) booked = 3; // full
          else if (index === 2) booked = 2; // filling fast
          else booked = (index % 3 === 0) ? 1 : 0;
        } else {
          booked = (index % 4 === 0) ? 1 : 0;
        }

        let status: 'available' | 'filling-fast' | 'full' | 'blocked' = 'available';
        if (doc.status === 'in-surgery' && dayOffset === 0 && index < 4) {
          status = 'blocked';
        } else if (booked >= maxCapacity) {
          status = 'full';
        } else if (maxCapacity - booked <= 1) {
          status = 'filling-fast';
        } else {
          status = 'available';
        }

        slots.push({
          id: slotId,
          doctorId: doc.id,
          date: dateStr,
          startTime: st.start,
          endTime: st.end,
          maxCapacity,
          bookedCount: booked,
          status,
        });
      });
    }
  });

  return slots;
}

export const INITIAL_SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-seed-001',
    bookingRef: 'PULSE-CARD-015-882',
    tokenNumber: 15,
    uhid: 'UHID-2026-8910',
    doctorId: 'doc-1',
    departmentId: 'dept-cardio',
    date: getDateOffset(0),
    slotId: `slot-doc-1-${getDateOffset(0)}-3`,
    slotTime: '10:30 AM',
    patientName: 'Kartik Tyagi',
    patientAge: 21,
    patientGender: 'Male',
    patientPhone: '+91 9876543210',
    patientEmail: 'kt759122@gmail.com',
    bloodGroup: 'B+',
    consultationMode: 'in-person',
    symptoms: 'Mild chest discomfort during routine cardio exercises',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    emailDelivery: {
      status: 'delivered',
      sentAt: new Date(Date.now() - 3590000).toISOString(),
      messageId: '<opd-pulse-card-015-882@mail.medipulse-hospital.org>',
      smtpServer: 'smtp-relay.medipulse-hms.internal',
      attemptCount: 1,
    },
  },
  {
    id: 'appt-seed-002',
    bookingRef: 'PULSE-NEUR-009-411',
    tokenNumber: 9,
    uhid: 'UHID-2026-3401',
    doctorId: 'doc-2',
    departmentId: 'dept-neuro',
    date: getDateOffset(0),
    slotId: `slot-doc-2-${getDateOffset(0)}-2`,
    slotTime: '10:00 AM',
    patientName: 'Rohit Varma',
    patientAge: 34,
    patientGender: 'Male',
    patientPhone: '+91 9811223344',
    patientEmail: 'rohit.varma@example.com',
    bloodGroup: 'O+',
    consultationMode: 'in-person',
    symptoms: 'Recurring morning migraines and sensory aura',
    status: 'checked-in',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    emailDelivery: {
      status: 'delivered',
      sentAt: new Date(Date.now() - 7190000).toISOString(),
      messageId: '<opd-pulse-neur-009-411@mail.medipulse-hospital.org>',
      smtpServer: 'smtp-relay.medipulse-hms.internal',
      attemptCount: 1,
    },
  },
];

export const INITIAL_SEED_EMAILS: EmailNotification[] = [
  {
    id: 'EMAIL-INIT-001',
    appointmentId: 'appt-seed-001',
    recipientEmail: 'kt759122@gmail.com',
    recipientName: 'Kartik Tyagi',
    subject: 'Confirmed: OPD Token #15 with Dr. Arvind Sharma [Ref: PULSE-CARD-015-882]',
    previewSnippet: `Your consultation is booked for ${getDateOffset(0)} at 10:30 AM. Room: OPD-204, Wing: Block B, 2nd Floor. Token #15.`,
    sentAt: new Date(Date.now() - 3590000).toISOString(),
    status: 'delivered',
    headers: {
      from: '"MediPulse OPD Automated Mailer" <appointments@medipulse-hospital.org>',
      to: 'Kartik Tyagi <kt759122@gmail.com>',
      subject: 'Confirmed: OPD Token #15 with Dr. Arvind Sharma [Ref: PULSE-CARD-015-882]',
      messageId: '<opd-pulse-card-015-882@mail.medipulse-hospital.org>',
      contentType: 'text/html; charset=UTF-8',
      smtpStatus: '250 2.0.0 OK: queued as 7F8D41C091',
      tlsVersion: 'TLSv1.3 (ECDHE-RSA-AES256-GCM-SHA384)',
    },
    textBody: `MediPulse Hospital - OPD Confirmation
Token: #15 | Ref: PULSE-CARD-015-882
Patient: Kartik Tyagi
Doctor: Dr. Arvind Sharma (MD, DM Cardiology)
Date: ${getDateOffset(0)} at 10:30 AM
Room: OPD-204 (Block B, 2nd Floor)
Status: Confirmed`,
    htmlBody: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>OPD Confirmation</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 20px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; padding: 24px; text-align: center;">
      <h2 style="margin: 0 0 6px 0; font-size: 20px;">MediPulse Multi-Speciality Hospital</h2>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Automated Clinical OPD Scheduling Notification Engine</p>
    </div>
    <div style="background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 8px; margin: 20px; padding: 16px; text-align: center;">
      <div style="font-size: 11px; font-weight: 700; color: #15803d; letter-spacing: 1px;">CLINICAL OPD TOKEN NUMBER</div>
      <div style="font-size: 42px; font-weight: 900; color: #15803d; margin: 4px 0;">#15</div>
      <div style="font-size: 12px; color: #475569; font-family: monospace;">Ref: PULSE-CARD-015-882 | UHID-2026-8910</div>
    </div>
    <div style="padding: 0 20px 20px;">
      <p>Dear <strong>Kartik Tyagi</strong>, your consultation is scheduled with <strong>Dr. Arvind Sharma</strong> (Cardiology) on <strong>${getDateOffset(0)}</strong> at <strong>10:30 AM</strong> in <strong>OPD-204 (Block B, 2nd Floor)</strong>.</p>
      <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px; color: #475569;">
        <strong>Instructions:</strong> Please arrive 15 minutes before your time slot for preliminary vitals registration at Desk 4.
      </div>
    </div>
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
      24/7 Helpline: 1800-PULSE-CARE | MediPulse Research Institute
    </div>
  </div>
</body>
</html>
    `,
  },
];
