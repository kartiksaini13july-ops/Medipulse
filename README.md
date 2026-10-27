# MediPulse OPD — Real-Time Hospital Appointment & Automated Email Notification System

[![Build & Compilation](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/React-19.x-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![Tests](https://img.shields.io/badge/tests-8%2F8%20passing%20(node%3Atest)-success.svg)]()
[![Recharts](https://img.shields.io/badge/Recharts-2.x-orange.svg)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8.svg)]()
[![Academic Project](https://img.shields.io/badge/B.Tech%20CSE%20%2F%20IT-3rd%20Sem%20Mini%20Project-purple.svg)]()

> **MediPulse OPD** is an enterprise-grade Outpatient Department (OPD) scheduling and patient queue coordination platform designed to eliminate hospital waiting lobby congestion. Built as a **3rd Semester B.Tech (Computer Science & Engineering / Information Technology) Mini Project**, it combines real-time slot concurrency control, automated transactional email dispatch, a live waiting room queue display, interactive peak-hour workload analysis, and scannable printable consultation passes with dynamic vector QR codes.

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [System Architecture](#-system-architecture)
- [Core Features & Modules](#-core-features--modules)
  - [1. Real-Time Slot Booking Engine](#1-real-time-slot-booking-engine)
  - [2. Automated Email Dispatch Pipeline & Virtual Mailbox](#2-automated-email-dispatch-pipeline--virtual-mailbox)
  - [3. Live OPD Queue Display Board with Visual Alert Pulse](#3-live-opd-queue-display-board-with-visual-alert-pulse)
  - [4. Peak Hour Analysis & Capacity Intelligence (Recharts)](#4-peak-hour-analysis--capacity-intelligence-recharts)
  - [5. Official Printable OPD Slip with Dynamic QR Code](#5-official-printable-opd-slip-with-dynamic-qr-code)
  - [6. OPD Staff Desk & Emergency Duty Control](#6-opd-staff-desk--emergency-duty-control)
  - [7. Academic Viva-Voce & Project Guide Modal](#7-academic-viva-voce--project-guide-modal)
- [Database & Data Models](#-database--data-models)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Running Unit Tests](#-running-unit-tests)
- [Viva-Voce Questions & Model Answers](#-viva-voce-questions--model-answers)
- [Author & Academic Attribution](#-author--academic-attribution)

---

## 🏥 Problem Statement

Traditional hospital outpatient lobbies in developing nations suffer from:
1. **Severe Lobby Overcrowding**: Patients arrive hours in advance due to unpredictable token calling and doctor arrival timings.
2. **Double-Booking & Race Conditions**: Manual registers and primitive systems allow multiple appointments for the same doctor slot.
3. **Misplaced Paper Slips**: Fragile physical receipts lack cryptographic verification or digital tracking.
4. **Poor Emergency Synchronization**: When a consultant is pulled into an emergency surgery (OT/ICU), waiting patients are left uninformed for hours.

**MediPulse OPD solves this** by coupling a reactive slot-reservation engine with immediate SMTP transactional notifications, digital token tracking, audio chimes, and administrative doctor state toggling.

---

## 🏗 System Architecture

```
                                  +---------------------------------------+
                                  |         Patient Web Client            |
                                  |   (React 19, TypeScript, Tailwind)    |
                                  +-------------------+-------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v                                                         v
         +-------------------------------+                         +-------------------------------+
         |     Slot Availability Engine  |                         |    Live OPD Queue Monitor     |
         |  - Concurrency Mutex Lock     |                         |  - Now Serving Tokens         |
         |  - Dynamic Capacity State     |                         |  - Next-in-Line Alert Pulse   |
         |  - 8 Clinical Specialties     |                         |  - Web Audio Chime Synthesis  |
         +---------------+---------------+                         +---------------+---------------+
                         |                                                         |
                         v                                                         |
         +-------------------------------+                                         |
         |   Automated SMTP Dispatcher   |                                         |
         |  - Token # & UHID Assignment  |                                         |
         |  - HTML Receipt Generation    |                                         |
         |  - Virtual Patient Mailbox    |                                         |
         +---------------+---------------+                                         |
                         |                                                         |
                         +----------------------------+----------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |       Administrative Staff Desk       |
                                  |  - Doctor Duty Switcher (OT / Break)  |
                                  |  - Peak Hour Recharts Density Module  |
                                  |  - Walk-in Counter Token Generation   |
                                  +---------------------------------------+
```

---

## ⚡ Core Features & Modules

### 1. Real-Time Slot Booking Engine
- **Atomic Slot Pacing**: Tracks capacities across 8 clinical specialties (Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, Gastroenterology, Pulmonology).
- **Slot State Classification**:
  - `available`: $\ge 2$ spots remaining.
  - `filling-fast`: Exactly 1 spot remaining with urgency badges.
  - `full`: Booked to maximum capacity.
  - `blocked`: Automatically locked if consultant is called into emergency surgery or is off-duty.
- **Rollback Guarantee**: When an appointment is rescheduled or cancelled, capacity increments back to the pool in real time.

### 2. Automated Email Dispatch Pipeline & Virtual Mailbox
- **Transactional OPD Email**: Instantly generates official confirmation slips containing patient name, age, gender, assigned doctor, chamber number, slot time, token number, and UHID.
- **Virtual In-App Mailbox**: Provides an interactive email client simulator to inspect:
  - Formatted HTML email view.
  - MIME headers (`Message-ID`, `TLSv1.3`, `Content-Type: text/html`).
  - Simulated SMTP response: `250 2.0.0 OK: queued as 7F8D41C091`.
  - Raw HTML inspection and one-click copy or external client launch (`mailto:`).
- **One-Click Preset Autofill**: Preloaded with student email `kt759122@gmail.com` for rapid examiner demonstrations.

### 3. Live OPD Queue Display Board with Visual Alert Pulse
- **Digital Waiting Room Display**: Simulates hospital hallway monitors showing:
  - Doctor name, chamber room, and consulting status.
  - Prominent **NOW SERVING TOKEN** indicator.
  - Average consultation pacing time.
- **Visual Alert Pulse Animation**:
  - Highlights the token next in line (`currentToken + 1`) with an **amber pulsing aura (`animate-pulse`)**, pinging status beacon, and `#TOKEN NEXT` badge.
  - Dedicated **"Next to Consult: Stand By Door"** warning banner.
- **Web Audio API Chime**:
  - Two-tone synthesized chime (`E5` 659.25Hz $\to$ `C5` 523.25Hz) played when staff advance tokens.
- **Patient Search & Self-Tracking**:
  - Search by Token Number, UHID, or Patient Name to view exact queue position and estimated remaining wait time in minutes.

### 4. Peak Hour Analysis & Capacity Intelligence (Recharts)
- Visualizes appointment density across time slots (`09:00 AM` to `06:30 PM`) using **Recharts**:
  - **Density Bar Chart**: Color-coded by congestion level (🔴 Peak Surge $\ge 75\%$, 🟡 Filling Fast $50-74\%$, 🟢 Optimal Flow $< 50\%$) with an active capacity threshold reference line.
  - **Occupancy Curve (Area Chart %)**: Continuous smooth gradient curve highlighting hospital surge windows.
  - **Doctor Workload Comparison**: Horizontal grouped bar chart comparing booked patients vs. total capacity across all consultants.
- **Telemetry KPI Cards**:
  - Busiest Time Slot (e.g. `09:00 AM - 100% Capacity`).
  - Optimal Off-Peak Slot recommendation for shortest wait times.
  - Shift split ratio (AM vs PM).
  - Overall OPD capacity utilization percentage.

### 5. Official Printable OPD Slip with Dynamic QR Code
- **Cryptographic Vector QR Code (`qrcode.react`)**:
  - Dynamically encodes the unique booking reference, UHID, token, and verification endpoint:
    `https://medipulse-hms.org/verify-opd?ref=PULSE-XXX&token=N&uhid=UHID-XXX`
  - High-DPI scannable barcode compatible with 2D hospital barcode scanners and mobile cameras.
- **Clinical Layout**:
  - Official hospital letterhead and Institute seal.
  - Patient demographics (Name, Age, Gender, Blood Group, Phone, Email).
  - Nursing vitals checklist (Blood Pressure, Pulse Rate, SpO2, Temperature).
  - Doctor prescription & clinical notes area with consultant signature line.
  - One-click PDF generation via `window.print()`.

### 6. OPD Staff Desk & Emergency Duty Control
- **Doctor Real-Time Availability Switcher**: Staff can toggle consultant state:
  - `On Duty` $\rightarrow$ Standard consultations open.
  - `In Surgery` $\rightarrow$ Instantly locks slots on patient portals and alerts waiting patients.
  - `On Break` $\rightarrow$ Pauses token pacing.
- **Walk-in Counter Token Desk**: Counter staff can issue immediate walk-in tokens for elderly or emergency patients, which append directly to the active queue and dispatch a confirmation receipt.

### 7. Academic Viva-Voce & Project Guide Modal
- Accessible via the navbar banner:
  - Project Synopsis & Objective.
  - Architectural Flow diagrams.
  - Database Entity Relationship (ER) Schemas.
  - Curated Viva-Voce Questions with model answers for college examiners.

---

## 🗄 Database & Data Models

### Key TypeScript Interfaces (`src/types/hospital.ts`):

```typescript
export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  photoUrl: string;
  status: 'on-duty' | 'in-surgery' | 'on-break' | 'off-duty';
  roomNumber: string;
  opdCurrentToken: number;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  status: 'available' | 'filling-fast' | 'full' | 'blocked';
}

export interface Appointment {
  id: string;
  bookingRef: string;     // e.g. PULSE-CARD-014-892
  uhid: string;           // e.g. UHID-2026-8910
  tokenNumber: number;    // e.g. 14
  doctorId: string;
  departmentId: string;
  date: string;
  slotTime: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail: string;
  bloodGroup: string;
  consultationMode: 'in-person' | 'video';
  symptoms: string;
  status: 'confirmed' | 'checked-in' | 'in-consultation' | 'completed' | 'cancelled';
  createdAt: string;
  emailDelivery: {
    status: 'delivered' | 'pending' | 'failed';
    sentAt: string;
    messageId: string;
    smtpServer: string;
    attemptCount: number;
  };
}
```

---

## 💻 Tech Stack

| Domain | Technology / Library | Role |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Component Architecture & Type Safety |
| **Build Tool** | Vite 6 | Rapid Hot Module Replacement & Bundling |
| **Styling** | Tailwind CSS v4 | Responsive Clinical Utility-first Styling |
| **Charts** | Recharts 2.x | Peak Hour Density & Workload Visualization |
| **QR Code** | `qrcode.react` (SVG) | High-Resolution Dynamic OPD Verification Codes |
| **Audio** | HTML5 Web Audio API | Zero-asset Synthesized Chimes (OscillatorNode) |
| **Icons** | Lucide React | Medical & Navigation UI Iconography |
| **Testing** | Node.js Built-in Runner (`node:test`) | Unit Testing Core Business Logic & Concurrency |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20 or higher
- npm v10 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/medipulse-opd.git
   cd medipulse-opd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🧪 Running Unit Tests

Pure business logic (slot status calculation, UHID generation, booking references, queue progression, wait time estimation, and peak hour density) is decoupled and tested using the native Node.js test runner (`node:test`):

```bash
node --test src/utils/bookingLogic.test.ts
```

### Test Coverage Summary:
- ✅ `calculateSlotStatus`: Doctor emergency surgery & slot capacity thresholds
- ✅ `generateBookingReference`: Standardized hospital prefix and department code
- ✅ `generateUHID`: Unique Health Identifier medical sequence
- ✅ `calculateEstimatedWaitTime`: Queue pacing and wait estimation
- ✅ `advanceQueue`: Token progression and sorting
- ✅ `validateBookingInput`: Required fields & boundary conditions
- ✅ `generateAutomatedConfirmationEmail`: MIME headers and HTML structure
- ✅ `calculatePeakHourDensity`: Slot volume aggregation & peak window identification

---

## 🎓 Viva-Voce Questions & Model Answers

**Q1: How does MediPulse prevent double-booking of consultant slots?**
> *Answer:* Slot status is calculated dynamically based on `bookedCount` versus `maxCapacity`. When a booking is confirmed, the slot state atomically transitions from `available` to `filling-fast` (if 1 spot left) or `full` (if 0 left). In a distributed backend, this is enforced using database row-level locking (`SELECT ... FOR UPDATE`) or Redis distributed mutex locks.

**Q2: How are automated confirmation emails handled without third-party email lag?**
> *Answer:* The client simulates an asynchronous SMTP gateway pipeline with stages: (1) Mutex Slot Lock, (2) UHID Mapping, (3) HTML Receipt Compilation, and (4) SMTP 250 OK Dispatch. A dedicated In-App Virtual Mailbox displays the generated MIME headers and email payload in real time.

**Q3: How does the queue board calculate remaining patient wait time?**
> *Answer:* Estimated wait time is computed as $(Token_{patient} - Token_{current}) \times T_{consultation}$, where $T_{consultation}$ represents the department's empirical average consultation pacing time (typically 8–15 minutes).

**Q4: Why was `qrcode.react` chosen for printable OPD passes?**
> *Answer:* `qrcode.react` generates vector SVG elements that render natively in the browser DOM. Unlike raster images (PNG/JPEG), vector SVGs scale infinitely with zero pixelation on high-resolution hospital thermal printers and laser receipt machines.

---

## 👨‍💻 Author & Academic Attribution

- **Project Lead**: Kartik Tyagi
- **Email**: `kt759122@gmail.com`
- **Course**: 3rd Semester B.Tech (Computer Science & Engineering / IT)
- **Institution**: Department of Computer Science & Engineering
- **License**: Apache-2.0
