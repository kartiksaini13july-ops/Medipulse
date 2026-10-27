/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  Appointment,
  Department,
  Doctor,
  DoctorStatus,
  EmailNotification,
  SlotStatus,
  TimeSlot,
} from '../types/hospital.ts';

/**
 * Computes slot status based on capacity, current bookings, and doctor availability.
 */
export function calculateSlotStatus(
  maxCapacity: number,
  bookedCount: number,
  doctorStatus: DoctorStatus
): SlotStatus {
  if (doctorStatus === 'off-duty' || doctorStatus === 'in-surgery') {
    return 'blocked';
  }
  if (bookedCount >= maxCapacity) {
    return 'full';
  }
  const remaining = maxCapacity - bookedCount;
  if (remaining <= 1) {
    return 'filling-fast';
  }
  return 'available';
}

/**
 * Generates an official OPD Booking Reference (e.g., PULSE-CARD-1048-A)
 */
export function generateBookingReference(deptCode: string, tokenNumber: number): string {
  const cleanCode = (deptCode || 'GEN').toUpperCase().slice(0, 4);
  const tokenPadded = String(tokenNumber).padStart(3, '0');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `PULSE-${cleanCode}-${tokenPadded}-${randomSuffix}`;
}

/**
 * Generates a Unique Health Identifier (UHID) for medical record persistence.
 */
export function generateUHID(seed: number = 1000): string {
  const currentYear = new Date().getFullYear();
  const sequence = String(Math.floor(seed + Math.random() * 8999));
  return `UHID-${currentYear}-${sequence}`;
}

/**
 * Calculates real-time estimated wait time based on the active queue and doctor rate.
 */
export function calculateEstimatedWaitTime(
  currentlyServingToken: number,
  patientToken: number,
  avgMinsPerPatient: number = 10
): { waitMins: number; tokensAhead: number } {
  if (patientToken <= currentlyServingToken) {
    return { waitMins: 0, tokensAhead: 0 };
  }
  const tokensAhead = patientToken - currentlyServingToken;
  const waitMins = tokensAhead * avgMinsPerPatient;
  return { waitMins, tokensAhead };
}

/**
 * Advances the hospital queue to the next waiting patient token.
 */
export function advanceQueue(
  currentlyServing: number,
  waitingTokens: number[]
): { newServingToken: number; remainingWaitingTokens: number[] } {
  if (!waitingTokens || waitingTokens.length === 0) {
    return {
      newServingToken: currentlyServing,
      remainingWaitingTokens: [],
    };
  }

  // Next token is the smallest waiting token that is strictly greater than currentlyServing
  const sorted = [...waitingTokens].sort((a, b) => a - b);
  const nextToken = sorted.find((t) => t > currentlyServing);

  if (nextToken === undefined) {
    // If all existing tokens are <= currentlyServing, increment or take head
    const nextVal = currentlyServing + 1;
    return {
      newServingToken: nextVal,
      remainingWaitingTokens: [],
    };
  }

  const remaining = sorted.filter((t) => t !== nextToken);
  return {
    newServingToken: nextToken,
    remainingWaitingTokens: remaining,
  };
}

/**
 * Validates appointment booking inputs with descriptive error messages.
 */
export function validateBookingInput(input: {
  patientName: string;
  patientAge: number | string;
  patientEmail: string;
  patientPhone: string;
  symptoms: string;
  slotId: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.patientName || input.patientName.trim().length < 2) {
    errors.patientName = 'Patient full name must be at least 2 characters.';
  }

  const ageNum = Number(input.patientAge);
  if (!input.patientAge || isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
    errors.patientAge = 'Please enter a valid age between 1 and 125.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.patientEmail || !emailRegex.test(input.patientEmail.trim())) {
    errors.patientEmail = 'A valid email address is required for automated confirmation dispatch.';
  }

  const phoneClean = (input.patientPhone || '').replace(/\D/g, '');
  if (phoneClean.length < 10) {
    errors.patientPhone = 'Phone number must be at least 10 digits.';
  }

  if (!input.symptoms || input.symptoms.trim().length < 4) {
    errors.symptoms = 'Please describe the symptoms or reason for visit (minimum 4 characters).';
  }

  if (!input.slotId) {
    errors.slotId = 'Please select a valid consultation time slot.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Builds the automated transactional email object for patient confirmation.
 */
export function generateAutomatedConfirmationEmail(
  appointment: Appointment,
  doctor: Doctor,
  department: Department
): EmailNotification {
  const messageId = `<opd-${appointment.bookingRef.toLowerCase()}-${Date.now()}@mail.medipulse-hospital.org>`;
  const subject = `Confirmed: OPD Token #${appointment.tokenNumber} with Dr. ${doctor.name} [Ref: ${appointment.bookingRef}]`;
  const preview = `Your consultation is booked for ${appointment.date} at ${appointment.slotTime}. Room: ${doctor.roomNumber}, Wing: ${department.floorWing}. Token #${appointment.tokenNumber}.`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b; }
    .email-container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.9; }
    .token-card { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 8px; padding: 18px; margin: 24px; text-align: center; }
    .token-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #15803d; letter-spacing: 1px; }
    .token-val { font-size: 44px; font-weight: 900; color: #15803d; margin: 4px 0; line-height: 1; }
    .token-ref { font-size: 12px; color: #475569; font-family: monospace; }
    .content { padding: 0 24px 24px 24px; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .details-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .details-table td.label { color: #64748b; font-weight: 500; width: 38%; }
    .details-table td.val { color: #0f172a; font-weight: 600; }
    .guidelines { background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px; border-radius: 4px; font-size: 13px; color: #334155; margin-bottom: 20px; line-height: 1.5; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; }
    .badge { display: inline-block; padding: 4px 8px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-weight: 600; font-size: 11px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>MediPulse Multi-Speciality Hospital</h1>
      <p>Automated Clinical OPD Scheduling Notification Engine</p>
    </div>

    <div class="token-card">
      <div class="token-label">Clinical OPD Token Number</div>
      <div class="token-val">#${appointment.tokenNumber}</div>
      <div class="token-ref">Reference ID: ${appointment.bookingRef} | UHID: ${appointment.uhid}</div>
    </div>

    <div class="content">
      <p style="font-size: 15px; margin-bottom: 18px;">
        Dear <strong>${appointment.patientName}</strong>,<br>
        Your consultation request has been successfully registered and confirmed in our hospital management database.
      </p>

      <table class="details-table">
        <tr>
          <td class="label">Consultant Doctor</td>
          <td class="val">Dr. ${doctor.name} (${doctor.qualification})</td>
        </tr>
        <tr>
          <td class="label">Specialty & Department</td>
          <td class="val">${department.name}</td>
        </tr>
        <tr>
          <td class="label">Appointment Date</td>
          <td class="val">${appointment.date}</td>
        </tr>
        <tr>
          <td class="label">Scheduled Time Slot</td>
          <td class="val">${appointment.slotTime}</td>
        </tr>
        <tr>
          <td class="label">Consultation Mode</td>
          <td class="val"><span class="badge">${appointment.consultationMode === 'video' ? 'Teleconsultation / Video' : 'In-Person OPD Visit'}</span></td>
        </tr>
        <tr>
          <td class="label">Room & Wing Location</td>
          <td class="val">Room ${doctor.roomNumber}, ${department.floorWing}</td>
        </tr>
        <tr>
          <td class="label">Reported Symptoms</td>
          <td class="val">${appointment.symptoms}</td>
        </tr>
        <tr>
          <td class="label">Consultation Fee</td>
          <td class="val">₹${doctor.consultationFee} (To be settled at Reception counter)</td>
        </tr>
      </table>

      <div class="guidelines">
        <strong>Important Patient Instructions:</strong><br>
        • Please arrive 15 minutes before your scheduled slot (${appointment.slotTime}) for vitals check (BP, SpO2, Pulse).<br>
        • Present this token email or your UHID (${appointment.uhid}) at Central OPD Counter 04.<br>
        • Keep any previous medical prescriptions and diagnostic reports handy.<br>
        • Live token queue status can be tracked anytime on the MediPulse Live OPD Board.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">MediPulse Institute of Medical Sciences & Research | 24/7 Helpline: 1800-PULSE-CARE</p>
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">This is an automated dispatch from MediPulse SMTP Gateway (Server: smtp-relay.medipulse-hms.internal [TLS 1.3]).</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
MediPulse Hospital - OPD Confirmation
--------------------------------------------------
Token Number: #${appointment.tokenNumber}
Booking Reference: ${appointment.bookingRef}
UHID: ${appointment.uhid}

Patient: ${appointment.patientName}
Doctor: Dr. ${doctor.name} (${doctor.qualification})
Department: ${department.name}
Date: ${appointment.date}
Slot Time: ${appointment.slotTime}
Room: ${doctor.roomNumber}, ${department.floorWing}
Mode: ${appointment.consultationMode}
Fee: Rs. ${doctor.consultationFee}

Please report 15 minutes before your slot time at OPD Reception.
Helpline: 1800-PULSE-CARE
  `.trim();

  return {
    id: `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    appointmentId: appointment.id,
    recipientEmail: appointment.patientEmail,
    recipientName: appointment.patientName,
    subject,
    previewSnippet: preview,
    htmlBody,
    textBody,
    sentAt: new Date().toISOString(),
    status: 'delivered',
    headers: {
      from: '"MediPulse OPD Automated Mailer" <appointments@medipulse-hospital.org>',
      to: `${appointment.patientName} <${appointment.patientEmail}>`,
      subject,
      messageId,
      contentType: 'text/html; charset=UTF-8',
      smtpStatus: '250 2.0.0 OK: queued as 7F8D41C091',
      tlsVersion: 'TLSv1.3 (ECDHE-RSA-AES256-GCM-SHA384)',
    },
  };
}

export interface PeakHourSlotMetric {
  time: string;
  booked: number;
  capacity: number;
  occupancyRate: number;
  isPeak: boolean;
  doctorBreakdown: Record<string, number>;
}

/**
 * Aggregates appointment density across standard time slots for specific doctors or the entire OPD.
 */
export function calculatePeakHourDensity(
  slots: TimeSlot[],
  filterDoctorId: string = 'all',
  filterDate?: string
): PeakHourSlotMetric[] {
  const filtered = slots.filter((s) => {
    const matchesDoc = filterDoctorId === 'all' || s.doctorId === filterDoctorId;
    const matchesDate = !filterDate || s.date === filterDate;
    return matchesDoc && matchesDate;
  });

  const ORDERED_SLOTS = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
  ];

  const timeBuckets: Record<
    string,
    { booked: number; capacity: number; doctorBreakdown: Record<string, number> }
  > = {};

  ORDERED_SLOTS.forEach((t) => {
    timeBuckets[t] = { booked: 0, capacity: 0, doctorBreakdown: {} };
  });

  filtered.forEach((slot) => {
    if (!timeBuckets[slot.startTime]) {
      timeBuckets[slot.startTime] = { booked: 0, capacity: 0, doctorBreakdown: {} };
    }
    timeBuckets[slot.startTime].booked += slot.bookedCount;
    timeBuckets[slot.startTime].capacity += slot.maxCapacity;
    timeBuckets[slot.startTime].doctorBreakdown[slot.doctorId] =
      (timeBuckets[slot.startTime].doctorBreakdown[slot.doctorId] || 0) + slot.bookedCount;
  });

  return ORDERED_SLOTS.map((time) => {
    const bucket = timeBuckets[time] || { booked: 0, capacity: 0, doctorBreakdown: {} };
    const occupancyRate =
      bucket.capacity > 0 ? Math.round((bucket.booked / bucket.capacity) * 100) : 0;
    const isPeak = occupancyRate >= 70;
    return {
      time,
      booked: bucket.booked,
      capacity: bucket.capacity,
      occupancyRate,
      isPeak,
      doctorBreakdown: bucket.doctorBreakdown,
    };
  });
}

/**
 * Identifies the highest-load peak window and optimal off-peak consultation hours.
 */
export function identifyPeakWindows(metrics: PeakHourSlotMetric[]): {
  busiestSlot: string;
  highestOccupancy: number;
  highestBooked: number;
  peakHourLabel: string;
  recommendedOffPeak: string;
} {
  if (!metrics || metrics.length === 0) {
    return {
      busiestSlot: 'N/A',
      highestOccupancy: 0,
      highestBooked: 0,
      peakHourLabel: 'Normal Distribution',
      recommendedOffPeak: '04:00 PM - 05:30 PM',
    };
  }

  let busiest = metrics[0];
  let quietest = metrics[0];

  metrics.forEach((m) => {
    if (
      m.booked > busiest.booked ||
      (m.booked === busiest.booked && m.occupancyRate > busiest.occupancyRate)
    ) {
      busiest = m;
    }
    if (m.capacity > 0 && (quietest.capacity === 0 || m.occupancyRate < quietest.occupancyRate)) {
      quietest = m;
    }
  });

  return {
    busiestSlot: busiest.time,
    highestOccupancy: busiest.occupancyRate,
    highestBooked: busiest.booked,
    peakHourLabel:
      busiest.occupancyRate >= 70
        ? 'High Surge / Overcrowding Risk'
        : 'Moderate Clinical Flow',
    recommendedOffPeak: quietest ? quietest.time : '04:30 PM',
  };
}
