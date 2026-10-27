/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MailCheck,
  Search,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDepartmentId: string;
  setSelectedDepartmentId: (id: string) => void;
  activeDoctorsCount: number;
  availableSlotsCount: number;
  onQuickBookClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDepartmentId,
  setSelectedDepartmentId,
  activeDoctorsCount,
  availableSlotsCount,
  onQuickBookClick,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      {/* Background soft glow and grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, description, search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-800/60 border border-sky-600/40 text-sky-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>3rd Sem B.Tech Mini Project • Real-Time OPD Scheduling Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Hospital Appointment Booking with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
                Real-Time Availability
              </span>{' '}
              & Automated Email Confirmations
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Eliminate crowded hospital waiting lobbies. Track live consultant availability, book
              guaranteed time-slots, receive instant digital OPD tokens with automated email receipts,
              and monitor real-time queue progress directly from your phone.
            </p>

            {/* Quick search input */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-xl max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by doctor name, specialty, or symptoms (e.g. Cardiologist, Migraine, Dr. Sharma)..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Key feature pills */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Duplicate Bookings (Mutex Slot Lock)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MailCheck className="w-4 h-4 text-sky-400" />
                <span>Instant SMTP Email Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Live OPD Queue Counter</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl shadow-lg hover:border-sky-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Active Doctors</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-white">{activeDoctorsCount}</div>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Consulting in OPD Rooms
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl shadow-lg hover:border-sky-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Slots Available</span>
                <Calendar className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{availableSlotsCount}</div>
              <p className="text-[11px] text-slate-400 mt-1">Live tracking active</p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl shadow-lg hover:border-sky-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Automated Email</span>
                <MailCheck className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-sky-400">100%</div>
              <p className="text-[11px] text-slate-400 mt-1">Instant patient dispatch</p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl shadow-lg hover:border-sky-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Avg OPD Wait</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300">11 min</div>
              <p className="text-[11px] text-emerald-400 mt-1">Live token pacing</p>
            </div>

            {/* Quick Consultation CTA banner spanning 2 columns */}
            <div className="col-span-2 bg-gradient-to-r from-sky-600 to-teal-600 p-4 rounded-xl text-white shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-sky-100 uppercase tracking-wider">
                  Emergency or Walk-in?
                </p>
                <p className="text-sm font-bold">Fast-Track OPD Slot Allocation</p>
              </div>
              <button
                onClick={onQuickBookClick}
                className="px-4 py-2 bg-white text-sky-800 hover:bg-sky-50 text-xs font-bold rounded-lg shadow-sm transition"
              >
                Select Doctor & Slot ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
