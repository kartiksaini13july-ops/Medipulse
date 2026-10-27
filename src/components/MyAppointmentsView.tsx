/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MapPin,
  Printer,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  User,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import { Appointment, Department, Doctor } from '../types/hospital';

interface MyAppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  departments: Department[];
  onOpenEmail: (emailId?: string) => void;
  onPrintSlip: (appointment: Appointment) => void;
  onTrackQueue: (tokenNumber: number) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onBookNewClick: () => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  appointments,
  doctors,
  departments,
  onOpenEmail,
  onPrintSlip,
  onTrackQueue,
  onCancelAppointment,
  onRescheduleAppointment,
  onBookNewClick,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalAppt, setCancelModalAppt] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = filterStatus === 'all' || appt.status === filterStatus;
    if (!searchQuery.trim()) return matchesStatus;

    const q = searchQuery.toLowerCase();
    const doc = doctors.find((d) => d.id === appt.doctorId);
    const matchesDoc = doc?.name.toLowerCase().includes(q) || false;
    const matchesRef = appt.bookingRef.toLowerCase().includes(q);
    const matchesUhid = appt.uhid.toLowerCase().includes(q);
    const matchesName = appt.patientName.toLowerCase().includes(q);
    const matchesEmail = appt.patientEmail.toLowerCase().includes(q);

    return matchesStatus && (matchesDoc || matchesRef || matchesUhid || matchesName || matchesEmail);
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed (Active)
          </span>
        );
      case 'checked-in':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Checked-in at OPD
          </span>
        );
      case 'in-consultation':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            In Doctor Chamber
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Consultation Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled (Slot Released)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Patient Appointments & OPD Passes
          </h2>
          <p className="text-xs text-slate-500">
            View active booking passes, track queue numbers, reschedule, or review automated emails
          </p>
        </div>

        <button
          onClick={onBookNewClick}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          + Book New Consultation
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by UHID, ref, patient or doctor..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          {['all', 'confirmed', 'checked-in', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? `All (${appointments.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search query or reset the status filter.'
              : 'You have not booked any consultations yet. Choose a doctor and reserve your OPD slot.'}
          </p>
          <button
            onClick={onBookNewClick}
            className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg"
          >
            Book Appointment Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => {
            const doc = doctors.find((d) => d.id === appt.doctorId);
            const dept = departments.find((d) => d.id === appt.departmentId);

            return (
              <div
                key={appt.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
              >
                {/* Header Strip */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Ref: {appt.bookingRef}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-medium">
                      UHID: {appt.uhid}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(appt.status)}
                    <span className="text-[11px] text-slate-400">
                      Booked on {new Date(appt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="p-6 grid md:grid-cols-12 gap-6 items-center">
                  {/* Token Box */}
                  <div className="md:col-span-3 text-center md:text-left md:border-r border-slate-100 md:pr-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      CLINICAL OPD TOKEN
                    </span>
                    <div className="text-5xl font-black font-mono text-sky-900 tracking-tight my-0.5">
                      #{appt.tokenNumber}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-semibold mt-1">
                      {appt.consultationMode === 'video' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-sky-600" />
                          <span>Teleconsultation</span>
                        </>
                      ) : (
                        <>
                          <Building className="w-3.5 h-3.5 text-sky-600" />
                          <span>In-Person OPD</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Doctor & Appointment Details */}
                  <div className="md:col-span-5 space-y-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Dr. {doc?.name || 'Specialist'}
                      </h4>
                      <p className="text-xs text-sky-700 font-medium">{dept?.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{appt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{appt.slotTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Room {doc?.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{appt.patientName} ({appt.patientAge}y)</span>
                      </div>
                    </div>

                    {appt.symptoms && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                        &quot;{appt.symptoms}&quot;
                      </p>
                    )}
                  </div>

                  {/* Action CTAs */}
                  <div className="md:col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEmail()}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition"
                      >
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        <span>View Email</span>
                      </button>

                      <button
                        onClick={() => onPrintSlip(appt)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>Print Slip</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onTrackQueue(appt.tokenNumber)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Track Live Queue Position</span>
                    </button>

                    {appt.status === 'confirmed' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onRescheduleAppointment(appt)}
                          className="flex-1 text-[11px] text-slate-600 hover:text-slate-900 font-semibold py-1 hover:underline text-center"
                        >
                          Reschedule Slot
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => setCancelModalAppt(appt)}
                          className="flex-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold py-1 hover:underline text-center"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancelModalAppt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cancel OPD Appointment?</h3>
                <p className="text-xs text-slate-500">Token #{cancelModalAppt.tokenNumber}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this booking for <strong>{cancelModalAppt.patientName}</strong>?
              The real-time slot will be instantly released back to other patients in the OPD pool,
              and an automated cancellation confirmation will be sent to <strong>{cancelModalAppt.patientEmail}</strong>.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setCancelModalAppt(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  onCancelAppointment(cancelModalAppt.id);
                  setCancelModalAppt(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Yes, Cancel & Release Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
