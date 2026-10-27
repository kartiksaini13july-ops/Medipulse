/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Department,
  Doctor,
  TimeSlot,
  Appointment,
  EmailNotification,
  DoctorStatus,
  ConsultationMode,
} from './types/hospital';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_SEED_APPOINTMENTS,
  INITIAL_SEED_EMAILS,
  generateInitialSlots,
  getDateOffset,
} from './data/hospitalData';
import {
  calculateSlotStatus,
  generateBookingReference,
  generateUHID,
  generateAutomatedConfirmationEmail,
} from './utils/bookingLogic';
import { playHospitalChime } from './utils/hospitalAudio';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DepartmentDoctorSelector } from './components/DepartmentDoctorSelector';
import { SlotPicker } from './components/SlotPicker';
import { PatientBookingForm } from './components/PatientBookingForm';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { EmailInboxDrawer } from './components/EmailInboxDrawer';
import { LiveQueueBoard } from './components/LiveQueueBoard';
import { MyAppointmentsView } from './components/MyAppointmentsView';
import { OPDStaffDesk } from './components/OPDStaffDesk';
import { PrintableOPDSlip } from './components/PrintableOPDSlip';
import { MiniProjectInfoModal } from './components/MiniProjectInfoModal';
import {
  HeartPulse,
  MailCheck,
  ShieldCheck,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // 1. Persistent State with localStorage fallback
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('medipulse_doctors_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_DOCTORS;
  });

  const [slots, setSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('medipulse_slots_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return generateInitialSlots();
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medipulse_appointments_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_SEED_APPOINTMENTS;
  });

  const [emails, setEmails] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('medipulse_emails_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_SEED_EMAILS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('medipulse_doctors_v3', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('medipulse_slots_v2', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('medipulse_appointments_v2', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medipulse_emails_v2', JSON.stringify(emails));
  }, [emails]);

  // UI Navigation & View State
  const [activeTab, setActiveTab] = useState<'book' | 'queue' | 'appointments' | 'desk'>('book');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(INITIAL_DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(getDateOffset(0));
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1); // 1: Choose Doctor, 2: Choose Slot, 3: Patient Form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modals & Drawers
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | undefined>(undefined);
  const [projectDocsOpen, setProjectDocsOpen] = useState<boolean>(false);
  const [printableAppointment, setPrintableAppointment] = useState<Appointment | null>(null);

  // Selected Doctor Object
  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const currentDepartment =
    departments.find((d) => d.id === currentDoctor.departmentId) || departments[0];
  const currentSlot = slots.find((s) => s.id === selectedSlotId);

  // Available slots count
  const availableSlotsCount = slots.filter(
    (s) => s.status === 'available' || s.status === 'filling-fast'
  ).length;

  // Real-time slot booking submission handler
  const handleBookingSubmit = (formData: {
    patientName: string;
    patientAge: number;
    patientGender: 'Male' | 'Female' | 'Other';
    patientPhone: string;
    patientEmail: string;
    bloodGroup: string;
    consultationMode: ConsultationMode;
    symptoms: string;
  }) => {
    if (!currentSlot || !currentDoctor) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Calculate new slot state with atomic decrement
      const updatedSlots = slots.map((s) => {
        if (s.id === currentSlot.id) {
          const newBooked = s.bookedCount + 1;
          const newStatus = calculateSlotStatus(s.maxCapacity, newBooked, currentDoctor.status);
          return {
            ...s,
            bookedCount: newBooked,
            status: newStatus,
          };
        }
        return s;
      });

      // 2. Compute token number for this doctor
      const existingDocAppointments = appointments.filter(
        (a) => a.doctorId === currentDoctor.id && a.date === currentSlot.date
      );
      const nextTokenNumber = currentDoctor.opdCurrentToken + existingDocAppointments.length + 1;

      // 3. Generate references
      const bookingRef = generateBookingReference(currentDepartment.code, nextTokenNumber);
      const uhid = generateUHID(1000 + appointments.length);

      // 4. Construct appointment entity
      const newAppointment: Appointment = {
        id: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        bookingRef,
        tokenNumber: nextTokenNumber,
        uhid,
        doctorId: currentDoctor.id,
        departmentId: currentDepartment.id,
        date: currentSlot.date,
        slotId: currentSlot.id,
        slotTime: currentSlot.startTime,
        patientName: formData.patientName,
        patientAge: formData.patientAge,
        patientGender: formData.patientGender,
        patientPhone: formData.patientPhone,
        patientEmail: formData.patientEmail,
        bloodGroup: formData.bloodGroup,
        consultationMode: formData.consultationMode,
        symptoms: formData.symptoms,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        emailDelivery: {
          status: 'delivered',
          sentAt: new Date().toISOString(),
          messageId: `<opd-${bookingRef.toLowerCase()}-${Date.now()}@mail.medipulse-hospital.org>`,
          smtpServer: 'smtp-relay.medipulse-hms.internal',
          attemptCount: 1,
        },
      };

      // 5. Generate automated confirmation email
      const newEmail = generateAutomatedConfirmationEmail(
        newAppointment,
        currentDoctor,
        currentDepartment
      );

      // 6. Update states
      setSlots(updatedSlots);
      setAppointments([newAppointment, ...appointments]);
      setEmails([newEmail, ...emails]);
      setIsSubmitting(false);

      // Play soft hospital chime for confirmation
      playHospitalChime();

      // Show success modal
      setConfirmedAppointment(newAppointment);
    }, 700);
  };

  // Cancellation handler
  const handleCancelAppointment = (appointmentId: string) => {
    const target = appointments.find((a) => a.id === appointmentId);
    if (!target) return;

    // Release slot in real-time
    const updatedSlots = slots.map((s) => {
      if (s.id === target.slotId) {
        const newBooked = Math.max(0, s.bookedCount - 1);
        const doc = doctors.find((d) => d.id === s.doctorId);
        const newStatus = calculateSlotStatus(s.maxCapacity, newBooked, doc?.status || 'on-duty');
        return {
          ...s,
          bookedCount: newBooked,
          status: newStatus,
        };
      }
      return s;
    });

    // Mark cancelled
    const updatedAppointments = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a
    );

    // Create cancellation confirmation email
    const cancelEmail: EmailNotification = {
      id: `EMAIL-CANCEL-${Date.now()}`,
      appointmentId: target.id,
      recipientEmail: target.patientEmail,
      recipientName: target.patientName,
      subject: `Cancelled: OPD Token #${target.tokenNumber} [Ref: ${target.bookingRef}]`,
      previewSnippet: `Your appointment with Dr. ${target.doctorId} on ${target.date} has been cancelled. Slot released.`,
      htmlBody: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #e11d48; margin-top: 0;">Appointment Cancelled</h2>
          <p>Dear <strong>${target.patientName}</strong>, your OPD Token #${target.tokenNumber} (Ref: ${target.bookingRef}) has been successfully cancelled in the MediPulse hospital system.</p>
          <p>The time slot has been returned to the hospital pool. If this was accidental, please book a fresh slot online.</p>
          <p style="font-size: 12px; color: #64748b;">MediPulse Central Scheduling Unit</p>
        </div>
      `,
      textBody: `Appointment Cancelled: Token #${target.tokenNumber} for ${target.patientName} has been cancelled.`,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      headers: {
        from: '"MediPulse OPD Automated Mailer" <appointments@medipulse-hospital.org>',
        to: `${target.patientName} <${target.patientEmail}>`,
        subject: `Cancelled: OPD Token #${target.tokenNumber} [Ref: ${target.bookingRef}]`,
        messageId: `<cancel-${Date.now()}@mail.medipulse.org>`,
        contentType: 'text/html; charset=UTF-8',
        smtpStatus: '250 2.0.0 OK: queued',
        tlsVersion: 'TLSv1.3',
      },
    };

    setSlots(updatedSlots);
    setAppointments(updatedAppointments);
    setEmails([cancelEmail, ...emails]);
  };

  // Advance Doctor Queue Token
  const handleAdvanceDoctorToken = (doctorId: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          return {
            ...doc,
            opdCurrentToken: doc.opdCurrentToken + 1,
          };
        }
        return doc;
      })
    );
  };

  // Update Doctor Status
  const handleUpdateDoctorStatus = (doctorId: string, status: DoctorStatus, note?: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          return {
            ...doc,
            status,
            statusNote: note,
          };
        }
        return doc;
      })
    );

    // Update affected slots for today
    setSlots((prev) =>
      prev.map((s) => {
        if (s.doctorId === doctorId && s.date === getDateOffset(0)) {
          const newStatus = calculateSlotStatus(s.maxCapacity, s.bookedCount, status);
          return {
            ...s,
            status: newStatus,
          };
        }
        return s;
      })
    );
  };

  // Walk-in token generator
  const handleBookWalkinToken = (
    doctorId: string,
    patientName: string,
    phone: string,
    email: string
  ) => {
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];
    const dept = departments.find((d) => d.id === doc.departmentId) || departments[0];

    const tokenNumber = doc.opdCurrentToken + 4;
    const bookingRef = generateBookingReference(dept.code, tokenNumber);
    const uhid = generateUHID(3000 + appointments.length);

    const walkinAppt: Appointment = {
      id: `walkin-${Date.now()}`,
      bookingRef,
      tokenNumber,
      uhid,
      doctorId: doc.id,
      departmentId: dept.id,
      date: getDateOffset(0),
      slotId: `walkin-slot-${doc.id}`,
      slotTime: 'Walk-in / Immediate',
      patientName,
      patientAge: 30,
      patientGender: 'Other',
      patientPhone: phone,
      patientEmail: email,
      bloodGroup: 'B+',
      consultationMode: 'in-person',
      symptoms: 'On-spot counter registration',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      emailDelivery: {
        status: 'delivered',
        sentAt: new Date().toISOString(),
        messageId: `<walkin-${Date.now()}@mail.medipulse-hospital.org>`,
        smtpServer: 'smtp-relay.medipulse-hms.internal',
        attemptCount: 1,
      },
    };

    const newEmail = generateAutomatedConfirmationEmail(walkinAppt, doc, dept);
    setAppointments([walkinAppt, ...appointments]);
    setEmails([newEmail, ...emails]);
    playHospitalChime();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openEmailModal={() => setEmailModalOpen(true)}
        openProjectDocs={() => setProjectDocsOpen(true)}
        unreadEmailCount={emails.length}
        appointmentCount={appointments.filter((a) => a.status === 'confirmed').length}
      />

      {/* 2. Main Tab Views */}
      <main className="flex-1">
        {/* Tab 1: Book Consultation Flow */}
        {activeTab === 'book' && (
          <div>
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDepartmentId={selectedDepartmentId}
              setSelectedDepartmentId={setSelectedDepartmentId}
              activeDoctorsCount={doctors.filter((d) => d.status === 'on-duty').length}
              availableSlotsCount={availableSlotsCount}
              onQuickBookClick={() => {
                const el = document.getElementById('booking-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
              {/* Step indicator breadcrumbs */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
                <button
                  onClick={() => setBookingStep(1)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                    bookingStep === 1
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center">
                    1
                  </span>
                  <span>Specialty & Doctor</span>
                </button>

                <span className="text-slate-300">→</span>

                <button
                  onClick={() => setBookingStep(2)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                    bookingStep === 2
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center">
                    2
                  </span>
                  <span>Real-Time Slot</span>
                </button>

                <span className="text-slate-300">→</span>

                <button
                  onClick={() => {
                    if (selectedSlotId) setBookingStep(3);
                  }}
                  disabled={!selectedSlotId}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                    bookingStep === 3
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center">
                    3
                  </span>
                  <span>Patient Details & Email</span>
                </button>
              </div>

              {/* Step 1: Department & Doctor Selector */}
              {bookingStep === 1 && (
                <DepartmentDoctorSelector
                  departments={departments}
                  doctors={doctors}
                  slots={slots}
                  selectedDepartmentId={selectedDepartmentId}
                  setSelectedDepartmentId={setSelectedDepartmentId}
                  selectedDoctorId={selectedDoctorId}
                  setSelectedDoctorId={setSelectedDoctorId}
                  searchQuery={searchQuery}
                  onDoctorSelected={(doc) => {
                    setSelectedDoctorId(doc.id);
                    setBookingStep(2);
                    // smooth scroll to slot picker
                    setTimeout(() => {
                      const el = document.getElementById('slot-picker-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                />
              )}

              {/* Step 2: Real-time Slot Picker */}
              {bookingStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                    >
                      ← Back to Doctor List
                    </button>
                    <span className="text-xs text-slate-500">
                      Step 2 of 3: Live Slot Selection
                    </span>
                  </div>

                  <SlotPicker
                    doctor={currentDoctor}
                    slots={slots}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedSlotId={selectedSlotId}
                    setSelectedSlotId={setSelectedSlotId}
                    onProceedToPatientForm={() => setBookingStep(3)}
                  />
                </div>
              )}

              {/* Step 3: Patient Form */}
              {bookingStep === 3 && currentSlot && (
                <PatientBookingForm
                  doctor={currentDoctor}
                  department={currentDepartment}
                  slot={currentSlot}
                  onBackToSlots={() => setBookingStep(2)}
                  onSubmitBooking={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Live OPD Queue Board */}
        {activeTab === 'queue' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <LiveQueueBoard
              doctors={doctors}
              departments={departments}
              appointments={appointments}
              onAdvanceToken={handleAdvanceDoctorToken}
            />
          </div>
        )}

        {/* Tab 3: My Appointments View */}
        {activeTab === 'appointments' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <MyAppointmentsView
              appointments={appointments}
              doctors={doctors}
              departments={departments}
              onOpenEmail={(emailId) => {
                if (emailId) setSelectedEmailId(emailId);
                setEmailModalOpen(true);
              }}
              onPrintSlip={(appt) => setPrintableAppointment(appt)}
              onTrackQueue={(tokenNum) => {
                setActiveTab('queue');
              }}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={(appt) => {
                setSelectedDoctorId(appt.doctorId);
                setSelectedDate(appt.date);
                setBookingStep(2);
                setActiveTab('book');
              }}
              onBookNewClick={() => {
                setBookingStep(1);
                setActiveTab('book');
              }}
            />
          </div>
        )}

        {/* Tab 4: Doctor / OPD Staff Desk */}
        {activeTab === 'desk' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <OPDStaffDesk
              doctors={doctors}
              departments={departments}
              appointments={appointments}
              slots={slots}
              onUpdateDoctorStatus={handleUpdateDoctorStatus}
              onAdvanceDoctorToken={handleAdvanceDoctorToken}
              onBookWalkinToken={handleBookWalkinToken}
            />
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sky-600 flex items-center justify-center text-white">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-200">
              MediPulse Multi-Speciality Hospital & Research Center
            </span>
            <span className="text-slate-600">|</span>
            <span>OPD Clinical Appointment System</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button
              onClick={() => setProjectDocsOpen(true)}
              className="hover:text-white transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>3rd Sem B.Tech Mini Project Viva Guide</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setEmailModalOpen(true)}
              className="hover:text-white transition"
            >
              Patient Confirmation Mailbox ({emails.length})
            </button>
            <span>•</span>
            <span className="text-slate-500">Emergency OPD 24x7</span>
          </div>
        </div>
      </footer>

      {/* 4. Booking Success Modal */}
      {confirmedAppointment && (
        <BookingSuccessModal
          appointment={confirmedAppointment}
          doctor={
            doctors.find((d) => d.id === confirmedAppointment.doctorId) || currentDoctor
          }
          department={
            departments.find((d) => d.id === confirmedAppointment.departmentId) || currentDepartment
          }
          onClose={() => {
            setConfirmedAppointment(null);
            setBookingStep(1);
          }}
          onOpenEmailInbox={(emailId) => {
            if (emailId) setSelectedEmailId(emailId);
            setConfirmedAppointment(null);
            setEmailModalOpen(true);
          }}
          onOpenLiveQueue={() => {
            setConfirmedAppointment(null);
            setActiveTab('queue');
          }}
          onPrintSlip={(appt) => {
            setConfirmedAppointment(null);
            setPrintableAppointment(appt);
          }}
        />
      )}

      {/* 5. Patient Email Inbox Drawer */}
      <EmailInboxDrawer
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        emails={emails}
        selectedEmailId={selectedEmailId}
        onSelectEmail={(id) => setSelectedEmailId(id)}
        onPrintEmail={(email) => {
          const appt = appointments.find((a) => a.id === email.appointmentId);
          if (appt) setPrintableAppointment(appt);
        }}
      />

      {/* 6. Printable Official OPD Slip */}
      <PrintableOPDSlip
        appointment={printableAppointment}
        doctors={doctors}
        departments={departments}
        onClose={() => setPrintableAppointment(null)}
      />

      {/* 7. Academic Mini Project Documentation Modal */}
      <MiniProjectInfoModal
        isOpen={projectDocsOpen}
        onClose={() => setProjectDocsOpen(false)}
      />
    </div>
  );
}
