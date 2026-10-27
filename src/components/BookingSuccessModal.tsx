/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Mail,
  MapPin,
  Printer,
  QrCode,
  Radio,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { Appointment, Department, Doctor } from '../types/hospital';
import { QRCodeSVG } from 'qrcode.react';

interface BookingSuccessModalProps {
  appointment: Appointment;
  doctor: Doctor;
  department: Department;
  onClose: () => void;
  onOpenEmailInbox: (emailId?: string) => void;
  onOpenLiveQueue: () => void;
  onPrintSlip: (appointment: Appointment) => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  appointment,
  doctor,
  department,
  onClose,
  onOpenEmailInbox,
  onOpenLiveQueue,
  onPrintSlip,
}) => {
  const [pipelineStep, setPipelineStep] = useState(1);

  // Animate the automated SMTP dispatch steps
  useEffect(() => {
    const t1 = setTimeout(() => setPipelineStep(2), 500);
    const t2 = setTimeout(() => setPipelineStep(3), 1100);
    const t3 = setTimeout(() => setPipelineStep(4), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Celebration Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md mb-2 shadow-inner">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            OPD Appointment Confirmed!
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Real-time slot locked & automated confirmation email generated
          </p>
        </div>

        {/* Automated Email Pipeline Progress Tracker */}
        <div className="bg-slate-900 text-slate-200 p-4 border-b border-slate-800 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Send className="w-3.5 h-3.5 animate-pulse" />
              Automated SMTP Email Pipeline
            </span>
            <span>Gateway: smtp-relay.medipulse.org</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>[1/4] Real-time slot mutex locked (Slot ID: {appointment.slotId})</span>
            </div>
            <div className={`flex items-center gap-2 ${pipelineStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>[2/4] OPD Token #{appointment.tokenNumber} allocated & UHID mapped</span>
            </div>
            <div className={`flex items-center gap-2 ${pipelineStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>[3/4] HTML receipt compiled with QR verification hash</span>
            </div>
            <div className={`flex items-center gap-2 ${pipelineStep >= 4 ? 'text-sky-300 font-bold' : 'text-slate-500'}`}>
              {pipelineStep >= 4 ? (
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <span className="h-3 w-3 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block"></span>
              )}
              <span>
                [4/4] Automated email dispatched to{' '}
                <strong className="text-white underline">{appointment.patientEmail}</strong> (250 OK)
              </span>
            </div>
          </div>
        </div>

        {/* Digital OPD Pass Card */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border-2 border-dashed border-emerald-500/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Clinical OPD Token
                </span>
                <div className="text-5xl font-black text-slate-900 mt-1 font-mono tracking-tight">
                  #{appointment.tokenNumber}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Ref: <strong className="text-slate-700">{appointment.bookingRef}</strong>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  UHID: <strong className="text-slate-700">{appointment.uhid}</strong>
                </div>
              </div>

              {/* Dynamically Generated QR Code embedding booking reference */}
              <div className="text-center shrink-0">
                <div
                  className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center"
                  title={`Embedded Verification Reference: ${appointment.bookingRef}`}
                >
                  <QRCodeSVG
                    value={`https://medipulse-hms.org/verify-opd?ref=${encodeURIComponent(
                      appointment.bookingRef
                    )}&token=${appointment.tokenNumber}&uhid=${encodeURIComponent(appointment.uhid)}`}
                    size={72}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    includeMargin={false}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 block">Scan at OPD Gate</span>
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Consultant</span>
                <p className="font-bold text-slate-800 truncate">Dr. {doctor.name}</p>
                <p className="text-[11px] text-slate-500">{department.name}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Date & Slot</span>
                <p className="font-bold text-slate-800">{appointment.date}</p>
                <p className="text-[11px] text-slate-500">{appointment.slotTime}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Location</span>
                <p className="font-bold text-slate-800">Room {doctor.roomNumber}</p>
                <p className="text-[11px] text-slate-500">{department.floorWing}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Patient</span>
                <p className="font-bold text-slate-800 truncate">{appointment.patientName}</p>
                <p className="text-[11px] text-slate-500">
                  {appointment.patientAge}y • {appointment.bloodGroup}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onOpenEmailInbox()}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-sky-600" />
              <span>View Automated Email In Mailbox</span>
            </button>

            <button
              onClick={() => onPrintSlip(appointment)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Print Official OPD Slip</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onOpenLiveQueue}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Track Live Queue Position (#Token {appointment.tokenNumber})</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
