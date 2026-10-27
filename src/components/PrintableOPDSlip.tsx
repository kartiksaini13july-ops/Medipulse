/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Clock,
  HeartPulse,
  MapPin,
  Printer,
  QrCode,
  Shield,
  Stethoscope,
  User,
  X,
  CheckCircle2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Appointment, Department, Doctor } from '../types/hospital';

interface PrintableOPDSlipProps {
  appointment: Appointment | null;
  doctors: Doctor[];
  departments: Department[];
  onClose: () => void;
}

export const PrintableOPDSlip: React.FC<PrintableOPDSlipProps> = ({
  appointment,
  doctors,
  departments,
  onClose,
}) => {
  if (!appointment) return null;

  const doc = doctors.find((d) => d.id === appointment.doctorId);
  const dept = departments.find((d) => d.id === appointment.departmentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (hidden during actual browser print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold">Official Hospital OPD Consultation Slip</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 transition"
              aria-label="Close print modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div id="opd-printable-content" className="p-8 overflow-y-auto space-y-6 text-slate-900 font-sans">
          {/* Hospital Letterhead Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight uppercase text-slate-900">
                  MediPulse Multi-Speciality Hospital
                </h1>
                <p className="text-[11px] font-semibold text-slate-600">
                  Institute of Medical Sciences & Tertiary Care Research
                </p>
                <p className="text-[10px] text-slate-500">
                  Central Health District, Sector 12 • Emergency Helpline: 1800-PULSE-CARE
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-300">
                OPD RECEPTION PASS
              </span>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Ref: <strong className="text-slate-800">{appointment.bookingRef}</strong>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                UHID: <strong className="text-slate-800">{appointment.uhid}</strong>
              </div>
            </div>
          </div>

          {/* Token Callout Box with Dynamic QR Verification Code */}
          <div className="bg-slate-50 border-2 border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                OPD QUEUE TOKEN NUMBER
              </span>
              <div className="text-5xl font-black font-mono text-slate-900 tracking-tight">
                #{appointment.tokenNumber}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                Reporting: {appointment.slotTime} ({appointment.date})
              </span>
            </div>

            {/* Dynamically Generated QR Code embedding booking reference */}
            <div className="text-center shrink-0">
              <div
                className="bg-white border-2 border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center shadow-xs"
                title={`OPD Verification Reference: ${appointment.bookingRef}`}
              >
                <QRCodeSVG
                  value={`https://medipulse-hms.org/verify-opd?ref=${encodeURIComponent(
                    appointment.bookingRef
                  )}&token=${appointment.tokenNumber}&uhid=${encodeURIComponent(appointment.uhid)}`}
                  size={84}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  includeMargin={false}
                />
              </div>
              <div className="mt-1">
                <span className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-wider block">
                  OPD Desk QR Verify
                </span>
                <span className="text-[8px] font-mono text-slate-500 block truncate max-w-[110px]" title={appointment.bookingRef}>
                  {appointment.bookingRef}
                </span>
              </div>
            </div>
          </div>

          {/* Patient & Doctor Two-Column Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Patient Demographics
              </span>
              <p className="text-sm font-bold text-slate-900">{appointment.patientName}</p>
              <p className="text-slate-600">
                Age / Gender: <strong>{appointment.patientAge} Years / {appointment.patientGender}</strong>
              </p>
              <p className="text-slate-600">
                Blood Group: <strong>{appointment.bloodGroup}</strong>
              </p>
              <p className="text-slate-600">
                Contact: <strong>{appointment.patientPhone}</strong>
              </p>
              <p className="text-slate-600 truncate">
                Email: <strong>{appointment.patientEmail}</strong>
              </p>
            </div>

            <div className="space-y-1.5 border-l border-slate-200 pl-6">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Clinical Consultation
              </span>
              <p className="text-sm font-bold text-slate-900">Dr. {doc?.name}</p>
              <p className="text-slate-600 font-medium">{doc?.qualification}</p>
              <p className="text-slate-600">
                Specialty: <strong>{dept?.name}</strong>
              </p>
              <p className="text-slate-600">
                Consultation Chamber: <strong>Room {doc?.roomNumber}</strong> ({dept?.floorWing})
              </p>
              <p className="text-slate-600">
                Mode: <strong>{appointment.consultationMode === 'video' ? 'Teleconsultation / Video' : 'In-Person OPD Visit'}</strong>
              </p>
            </div>
          </div>

          {/* Clinical Vitals Triage Checklist */}
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
              OPD Triage / Nursing Vitals (To be filled by Staff Nurse):
            </span>
            <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500 block text-[9px]">BP (mmHg):</span>
                <span className="font-bold text-slate-700">____ / ____</span>
              </div>
              <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500 block text-[9px]">Pulse Rate:</span>
                <span className="font-bold text-slate-700">____ bpm</span>
              </div>
              <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500 block text-[9px]">SpO2 (%):</span>
                <span className="font-bold text-slate-700">____ %</span>
              </div>
              <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500 block text-[9px]">Temp (°F):</span>
                <span className="font-bold text-slate-700">____ °F</span>
              </div>
            </div>
          </div>

          {/* Doctor Prescription & Clinical Notes Space */}
          <div className="border border-slate-300 rounded-xl p-4 min-h-[140px] relative">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Doctor Clinical Notes & Prescription:
            </span>
            <div className="text-xs text-slate-500 italic mt-1">
              Chief complaints reported: &quot;{appointment.symptoms}&quot;
            </div>

            <div className="absolute bottom-3 right-4 text-right">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] text-slate-500 font-semibold">
                Signature of Dr. {doc?.name}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-200">
            Valid for 7 days from date of issue for follow-up • Generated via MediPulse Automated HMS Engine (3rd Sem B.Tech Mini Project)
          </div>
        </div>
      </div>
    </div>
  );
};
