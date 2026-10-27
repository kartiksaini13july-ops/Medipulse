/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSlotStatus,
  generateBookingReference,
  generateUHID,
  calculateEstimatedWaitTime,
  advanceQueue,
  validateBookingInput,
  generateAutomatedConfirmationEmail,
  calculatePeakHourDensity,
  identifyPeakWindows,
} from './bookingLogic.ts';
import type { Department, Doctor, Appointment, TimeSlot } from '../types/hospital.ts';

test('calculateSlotStatus handles doctor availability and slot capacities', () => {
  // When doctor is in surgery or off duty -> blocked
  assert.equal(calculateSlotStatus(4, 0, 'in-surgery'), 'blocked');
  assert.equal(calculateSlotStatus(4, 1, 'off-duty'), 'blocked');

  // When bookedCount equals or exceeds capacity -> full
  assert.equal(calculateSlotStatus(4, 4, 'on-duty'), 'full');
  assert.equal(calculateSlotStatus(4, 5, 'on-duty'), 'full');

  // When 1 slot remains -> filling-fast
  assert.equal(calculateSlotStatus(4, 3, 'on-duty'), 'filling-fast');

  // When plenty remains -> available
  assert.equal(calculateSlotStatus(4, 1, 'on-duty'), 'available');
  assert.equal(calculateSlotStatus(4, 0, 'on-duty'), 'available');
});

test('generateBookingReference produces standardized hospital prefix and department code', () => {
  const ref = generateBookingReference('CARD', 14);
  assert.match(ref, /^PULSE-CARD-014-\d{3}$/);

  const neuroRef = generateBookingReference('NEUR', 7);
  assert.match(neuroRef, /^PULSE-NEUR-007-\d{3}$/);
});

test('generateUHID formats medical registration sequence', () => {
  const uhid = generateUHID(2500);
  assert.match(uhid, /^UHID-\d{4}-\d+$/);
});

test('calculateEstimatedWaitTime computes accurate wait time', () => {
  // If current token is 10 and patient token is 14 with 10 min/patient
  const result = calculateEstimatedWaitTime(10, 14, 10);
  assert.equal(result.tokensAhead, 4);
  assert.equal(result.waitMins, 40);

  // If patient token is already being served or passed
  const passedResult = calculateEstimatedWaitTime(12, 12, 10);
  assert.equal(passedResult.tokensAhead, 0);
  assert.equal(passedResult.waitMins, 0);
});

test('advanceQueue increments to next waiting token in sorted order', () => {
  const current = 5;
  const waiting = [6, 8, 9, 11];
  const next = advanceQueue(current, waiting);

  assert.equal(next.newServingToken, 6);
  assert.deepEqual(next.remainingWaitingTokens, [8, 9, 11]);

  // When waiting list is empty
  const emptyQueue = advanceQueue(6, []);
  assert.equal(emptyQueue.newServingToken, 6);
  assert.deepEqual(emptyQueue.remainingWaitingTokens, []);
});

test('validateBookingInput catches missing or invalid fields', () => {
  const invalid = validateBookingInput({
    patientName: '',
    patientAge: 0,
    patientEmail: 'not-an-email',
    patientPhone: '123',
    symptoms: 'hi',
    slotId: '',
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.patientAge);
  assert.ok(invalid.errors.patientEmail);
  assert.ok(invalid.errors.patientPhone);
  assert.ok(invalid.errors.symptoms);
  assert.ok(invalid.errors.slotId);

  const valid = validateBookingInput({
    patientName: 'Kartik Saini',
    patientAge: 21,
    patientEmail: 'kartiksaini0905@gmail.com',
    patientPhone: '+91 9876543210',
    symptoms: 'Mild chest discomfort and palpitations during exertion',
    slotId: 'slot-card-1',
  });

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateAutomatedConfirmationEmail constructs full email payload with SMTP headers', () => {
  const mockDept: Department = {
    id: 'dept-cardio',
    name: 'Department of Cardiology & Heart Care',
    code: 'CARD',
    icon: 'HeartPulse',
    tagline: 'Advanced cardiac catheterization and preventive heart care',
    description: 'Comprehensive cardiology care',
    headOfDepartment: 'Dr. Arvind Sharma',
    floorWing: 'Block B, 2nd Floor',
    averageWaitTimeMins: 12,
  };

  const mockDoc: Doctor = {
    id: 'doc-1',
    name: 'Arvind Sharma',
    gender: 'male',
    departmentId: 'dept-cardio',
    qualification: 'MD, DM (Cardiology), AIIMS New Delhi',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 340,
    consultationFee: 800,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    status: 'on-duty',
    roomNumber: 'OPD-204',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shift: 'Morning (09:00 - 13:00)',
    bio: 'Chief Interventional Cardiologist specializing in adult cardiac care.',
    opdCurrentToken: 12,
  };

  const mockAppt: Appointment = {
    id: 'appt-123',
    bookingRef: 'PULSE-CARD-014-491',
    tokenNumber: 14,
    uhid: 'UHID-2026-9041',
    doctorId: 'doc-1',
    departmentId: 'dept-cardio',
    date: '2026-10-20',
    slotId: 'slot-1',
    slotTime: '10:30 AM',
    patientName: 'Kartik Saini',
    patientAge: 21,
    patientGender: 'Male',
    patientPhone: '+91 9876543210',
    patientEmail: 'kartiksaini0905@gmail.com',
    bloodGroup: 'B+',
    consultationMode: 'in-person',
    symptoms: 'Chest flutter after exercise',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    emailDelivery: {
      status: 'delivered',
      sentAt: new Date().toISOString(),
      messageId: '<test-msg-id>',
      smtpServer: 'smtp-relay.medipulse-hms.internal',
      attemptCount: 1,
    },
  };

  const email = generateAutomatedConfirmationEmail(mockAppt, mockDoc, mockDept);
  assert.equal(email.recipientEmail, 'kartiksaini0905@gmail.com');
  assert.ok(email.subject.includes('Token #14'));
  assert.ok(email.htmlBody.includes('MediPulse Multi-Speciality Hospital'));
  assert.ok(email.htmlBody.includes('#14'));
  assert.ok(email.htmlBody.includes('OPD-204'));
  assert.ok(email.headers.smtpStatus.includes('250 2.0.0 OK'));
});

test('calculatePeakHourDensity aggregates slot volume and identifies peak congestion', () => {
  const sampleSlots: TimeSlot[] = [
    {
      id: 's1',
      doctorId: 'doc-1',
      date: '2026-10-24',
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      maxCapacity: 3,
      bookedCount: 3, // 100% capacity
      status: 'full',
    },
    {
      id: 's2',
      doctorId: 'doc-2',
      date: '2026-10-24',
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      maxCapacity: 3,
      bookedCount: 2, // 66% capacity
      status: 'filling-fast',
    },
    {
      id: 's3',
      doctorId: 'doc-1',
      date: '2026-10-24',
      startTime: '04:00 PM',
      endTime: '04:30 PM',
      maxCapacity: 3,
      bookedCount: 0,
      status: 'available',
    },
  ];

  const overallMetrics = calculatePeakHourDensity(sampleSlots, 'all', '2026-10-24');
  const slot1000 = overallMetrics.find((m) => m.time === '10:00 AM');
  assert.ok(slot1000);
  assert.equal(slot1000.booked, 5);
  assert.equal(slot1000.capacity, 6);
  assert.equal(slot1000.occupancyRate, 83);
  assert.equal(slot1000.isPeak, true);

  // Filter for doc-1 only
  const doc1Metrics = calculatePeakHourDensity(sampleSlots, 'doc-1', '2026-10-24');
  const doc1Slot1000 = doc1Metrics.find((m) => m.time === '10:00 AM');
  assert.ok(doc1Slot1000);
  assert.equal(doc1Slot1000.booked, 3);
  assert.equal(doc1Slot1000.capacity, 3);
  assert.equal(doc1Slot1000.occupancyRate, 100);

  // Peak window identification
  const windows = identifyPeakWindows(overallMetrics);
  assert.equal(windows.busiestSlot, '10:00 AM');
  assert.equal(windows.highestOccupancy, 83);
  assert.equal(windows.highestBooked, 5);
});

