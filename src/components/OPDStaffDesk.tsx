/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  Play,
  PlusCircle,
  RefreshCw,
  Shield,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { Doctor, Department, Appointment, DoctorStatus, TimeSlot } from '../types/hospital';
import { playHospitalChime } from '../utils/hospitalAudio';
import { PeakHourAnalysisChart } from './PeakHourAnalysisChart';

interface OPDStaffDeskProps {
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  slots: TimeSlot[];
  onUpdateDoctorStatus: (doctorId: string, status: DoctorStatus, note?: string) => void;
  onAdvanceDoctorToken: (doctorId: string) => void;
  onBookWalkinToken: (doctorId: string, patientName: string, phone: string, email: string) => void;
}

export const OPDStaffDesk: React.FC<OPDStaffDeskProps> = ({
  doctors,
  departments,
  appointments,
  slots,
  onUpdateDoctorStatus,
  onAdvanceDoctorToken,
  onBookWalkinToken,
}) => {
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || '');
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('+91 9876543210');
  const [walkinEmail, setWalkinEmail] = useState('kt759122@gmail.com');
  const [walkinSuccess, setWalkinSuccess] = useState(false);

  const selectedDoc = doctors.find((d) => d.id === selectedDocId) || doctors[0];
  const docDept = departments.find((d) => d.id === selectedDoc?.departmentId);

  // Stats calculations
  const totalBookings = appointments.length;
  const activeBookings = appointments.filter((a) => a.status === 'confirmed').length;
  const bookedSlots = slots.filter((s) => s.bookedCount > 0).length;
  const totalRevenue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => {
      const doc = doctors.find((d) => d.id === a.doctorId);
      return sum + (doc?.consultationFee || 500);
    }, 0);

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !selectedDoc) return;
    onBookWalkinToken(selectedDoc.id, walkinName.trim(), walkinPhone.trim(), walkinEmail.trim());
    setWalkinSuccess(true);
    setWalkinName('');
    setTimeout(() => setWalkinSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-2 border border-sky-500/30">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>OPD Administrator & Clinical Staff Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hospital Operations & Doctor Availability Control
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              This administrative dashboard simulates how hospital receptionists and consulting doctors
              dynamically manage live patient queues, toggle emergency duty, and issue on-spot tokens.
            </p>
          </div>

          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-xs flex items-center gap-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Revenue</span>
              <span className="text-lg font-black text-emerald-400">Rs. {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Tokens</span>
              <span className="text-lg font-black text-white">{activeBookings}</span>
            </div>
          </div>
        </div>

        {/* 4 Quick Operational Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
            <div className="text-xl font-bold text-white mt-0.5">{totalBookings}</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Doctors On Duty</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {doctors.filter((d) => d.status === 'on-duty').length} / {doctors.length}
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">In Emergency Surgery</span>
            <div className="text-xl font-bold text-rose-400 mt-0.5">
              {doctors.filter((d) => d.status === 'in-surgery').length}
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Automated Mail Engine</span>
            <div className="text-xl font-bold text-sky-400 mt-0.5">100% Operational</div>
          </div>
        </div>
      </div>

      {/* Peak Hour Analysis Chart using Recharts */}
      <PeakHourAnalysisChart
        doctors={doctors}
        departments={departments}
        slots={slots}
        appointments={appointments}
      />

      {/* Doctor Status & Live Queue Control Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Doctor Selection & Live Status Switcher */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Doctor Real-Time Availability Switcher
            </h3>
            <p className="text-xs text-slate-500">
              Toggle doctor duty state to observe real-time slot blocking across patient portals
            </p>
          </div>

          <div className="space-y-4">
            {doctors.map((doc) => {
              const dept = departments.find((d) => d.id === doc.departmentId);

              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Dr. {doc.name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                          Room {doc.roomNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{dept?.name}</p>
                      <p className="text-[11px] text-sky-700 font-mono mt-0.5">
                        Current Serving Token: <strong>#{doc.opdCurrentToken}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Duty status buttons */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <button
                      onClick={() => onUpdateDoctorStatus(doc.id, 'on-duty')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        doc.status === 'on-duty'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Set to On Duty"
                    >
                      On Duty
                    </button>

                    <button
                      onClick={() =>
                        onUpdateDoctorStatus(
                          doc.id,
                          'in-surgery',
                          'Performing emergency operation in OT-2'
                        )
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        doc.status === 'in-surgery'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
                      }`}
                      title="Set to Emergency Surgery"
                    >
                      In Surgery
                    </button>

                    <button
                      onClick={() => onUpdateDoctorStatus(doc.id, 'on-break')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        doc.status === 'on-break'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Set to Break"
                    >
                      Break
                    </button>

                    <button
                      onClick={() => {
                        playHospitalChime();
                        onAdvanceDoctorToken(doc.id);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold transition flex items-center gap-1"
                      title="Advance to next token and play chime"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Next Token</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Walk-in Patient Token Desk */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Hospital Counter Walk-in Registration
            </h3>
            <p className="text-xs text-slate-500">
              For on-spot emergency or elderly patients without app bookings
            </p>
          </div>

          {walkinSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Walk-in Token successfully generated and automated confirmation dispatched!</span>
            </div>
          )}

          <form onSubmit={handleWalkinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assign Doctor & OPD Chamber:
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.name} (Room {d.roomNumber} - {d.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Full Name:
              </label>
              <input
                type="text"
                required
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Mobile Number:
              </label>
              <input
                type="tel"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient Email (Automated OPD Pass Dispatch):
              </label>
              <input
                type="email"
                required
                value={walkinEmail}
                onChange={(e) => setWalkinEmail(e.target.value)}
                placeholder="kt759122@gmail.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate Immediate Walk-in Token</span>
            </button>
          </form>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Queue Ingestion Logic:</span>
            <p>
              Walk-in patients are appended directly to the end of the doctor&apos;s active token array.
              The automated SMTP gateway triggers immediately to provide a digital receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
