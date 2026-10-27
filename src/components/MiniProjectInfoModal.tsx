/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Code2,
  Cpu,
  Database,
  FileCode,
  GraduationCap,
  Layers,
  Mail,
  Network,
  ShieldAlert,
  Terminal,
  X,
} from 'lucide-react';

interface MiniProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniProjectInfoModal: React.FC<MiniProjectInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'viva' | 'schema'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-900 text-white p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                  Academic Project Documentation
                </span>
                <span className="text-[10px] font-mono text-slate-400">3rd Sem B.Tech (CSE / IT)</span>
              </div>
              <h2 className="text-xl font-bold mt-1 text-white">
                MediPulse Hospital Appointment & Notification System
              </h2>
              <p className="text-xs text-slate-300">
                Course Mini Project • Real-Time Availability Tracking & Automated Email Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Project Synopsis', icon: BookOpen },
            { id: 'architecture', label: 'System Architecture', icon: Layers },
            { id: 'viva', label: 'Viva-Voce Q&A', icon: FileCode },
            { id: 'schema', label: 'Database Schema', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">1. Problem Statement</h3>
                <p className="text-slate-600">
                  Traditional hospital outpatient departments (OPD) suffer from severe overcrowding,
                  unpredictable queue lengths, manual paper slips that are easily misplaced, and the
                  risk of double-booked consultant slots. This project delivers an automated,
                  real-time web solution that provides dynamic slot availability tracking and instant
                  automated email confirmations for patients.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">2. Core Functional Requirements</h3>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-sky-900 block mb-1">
                      • Real-Time Slot Tracking
                    </span>
                    <p className="text-slate-600 text-xs">
                      Live status calculation (Available, Filling Fast, Booked, Blocked). Prevents race
                      conditions and guarantees doctor room pacing.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-sky-900 block mb-1">
                      • Automated Email Confirmations
                    </span>
                    <p className="text-slate-600 text-xs">
                      Instant generation of transactional clinical confirmation emails with unique
                      booking reference, token number, doctor instructions, and SMTP delivery verification.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-sky-900 block mb-1">
                      • Live OPD Queue Display Board
                    </span>
                    <p className="text-slate-600 text-xs">
                      Digital waiting room screen showing current serving tokens, audio chimes,
                      and individual patient queue estimation.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-sky-900 block mb-1">
                      • Doctor & Admin Operations Desk
                    </span>
                    <p className="text-slate-600 text-xs">
                      Allows staff to toggle emergency surgery states, call the next token in the
                      room, and issue on-spot walk-in slips.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">3. Technology Stack</h3>
                <p className="text-slate-600">
                  <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Lucide Icons.<br />
                  <strong>State & Persistence:</strong> Real-time reactive state engine with LocalStorage synchronization.<br />
                  <strong>Audio:</strong> Web Audio API synthesized hospital announcement chimes.<br />
                  <strong>Testing:</strong> Node 22 built-in test runner (<code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">node:test</code>).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">System Flow & Concurrency Pipeline</h3>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2">
                <div className="text-emerald-400 font-bold">[1] Patient Client Interaction:</div>
                <div className="pl-4">User chooses Specialty &rarr; Doctor &rarr; Date &rarr; Real-Time Time Slot</div>

                <div className="text-sky-400 font-bold mt-2">[2] Concurrency Mutex Lock:</div>
                <div className="pl-4">
                  Check: bookedCount &lt; maxCapacity &amp;&amp; doctorStatus === &apos;on-duty&apos;<br />
                  If valid: Atomically increment bookedCount, update status to &apos;filling-fast&apos; or &apos;full&apos;.
                </div>

                <div className="text-amber-400 font-bold mt-2">[3] Token &amp; UHID Generation:</div>
                <div className="pl-4">
                  Allocate Token #(N+1) &rarr; Assign Unique Health ID (UHID) &rarr; Generate Booking Reference.
                </div>

                <div className="text-purple-400 font-bold mt-2">[4] Automated Email Dispatch Pipeline:</div>
                <div className="pl-4">
                  Compile HTML Template with QR payload &rarr; Queue in SMTP Dispatcher &rarr; Deliver with 250 OK.
                </div>

                <div className="text-teal-400 font-bold mt-2">[5] Live OPD Waiting Room Synchronization:</div>
                <div className="pl-4">
                  Broadcast token to Central Waiting Hall display &rarr; Update estimated wait time.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Key Viva-Voce Questions & Model Answers for Examiners
              </h3>

              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <p className="font-bold text-slate-900">
                    Q1: How does the system handle real-time slot availability when multiple patients access simultaneously?
                  </p>
                  <p className="text-slate-600 mt-1 text-xs">
                    <strong>Ans:</strong> The application uses an atomic slot locking algorithm in <code className="bg-white px-1 py-0.5 rounded border border-slate-200">calculateSlotStatus()</code>.
                    Each slot has a strict capacity limit (e.g. 3 patients/slot). Upon booking, the slot counter is incremented, immediately transitioning the slot from <em>available</em> &rarr; <em>filling-fast</em> &rarr; <em>full</em>.
                    Cancellation automatically rolls back the counter and releases the slot.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <p className="font-bold text-slate-900">
                    Q2: What happens when a doctor is called for an emergency surgery?
                  </p>
                  <p className="text-slate-600 mt-1 text-xs">
                    <strong>Ans:</strong> In the Doctor/Staff Desk, changing the doctor&apos;s status to &apos;in-surgery&apos; propagates across the system, marking all pending slots as &apos;blocked&apos; and notifying waiting patients on the Live Queue board with an ETA note.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <p className="font-bold text-slate-900">
                    Q3: How are automated confirmation emails generated and tracked?
                  </p>
                  <p className="text-slate-600 mt-1 text-xs">
                    <strong>Ans:</strong> The automated email notification engine constructs a complete MIME-compliant HTML message with unique Message-ID, cryptographic token reference, consultation guidelines, and room directions. All dispatched emails are logged into the patient&apos;s digital mailbox for offline auditing and verification.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <p className="font-bold text-slate-900">
                    Q4: What data structures manage the OPD Queue?
                  </p>
                  <p className="text-slate-600 mt-1 text-xs">
                    <strong>Ans:</strong> A partitioned FIFO (First-In-First-Out) Queue per doctor. Tokens are ordered sequentially; advancing the token updates the pointer in O(1) time and updates remaining waiting patient times based on the department&apos;s average consultation rate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Relational Entity-Relationship (ER) Entities</h3>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-sky-800 font-sans block">Table: Appointments</span>
                  <div>id: UUID (PK)</div>
                  <div>bookingRef: VARCHAR (Unique)</div>
                  <div>tokenNumber: INT</div>
                  <div>uhid: VARCHAR (FK &rarr; Patients)</div>
                  <div>doctorId: VARCHAR (FK &rarr; Doctors)</div>
                  <div>slotId: VARCHAR (FK &rarr; TimeSlots)</div>
                  <div>date: DATE</div>
                  <div>consultationMode: ENUM</div>
                  <div>status: ENUM</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-sky-800 font-sans block">Table: TimeSlots</span>
                  <div>id: VARCHAR (PK)</div>
                  <div>doctorId: VARCHAR (FK)</div>
                  <div>date: DATE</div>
                  <div>startTime: TIME</div>
                  <div>maxCapacity: INT (Default 3)</div>
                  <div>bookedCount: INT</div>
                  <div>status: ENUM</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-sky-800 font-sans block">Table: EmailNotifications</span>
                  <div>id: VARCHAR (PK)</div>
                  <div>appointmentId: UUID (FK)</div>
                  <div>recipientEmail: VARCHAR</div>
                  <div>subject: TEXT</div>
                  <div>htmlBody: TEXT</div>
                  <div>smtpStatus: VARCHAR (250 OK)</div>
                  <div>sentAt: TIMESTAMP</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-sky-800 font-sans block">Table: Doctors</span>
                  <div>id: VARCHAR (PK)</div>
                  <div>name: VARCHAR</div>
                  <div>departmentId: VARCHAR</div>
                  <div>roomNumber: VARCHAR</div>
                  <div>status: ENUM</div>
                  <div>opdCurrentToken: INT</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-600 font-medium">
            Prepared by <strong className="text-slate-900">Kartik Tyagi</strong> (kt759122@gmail.com) • 3rd Sem B.Tech CSE / IT Mini Project
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
