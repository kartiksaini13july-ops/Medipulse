/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Clock,
  MapPin,
  Play,
  Radio,
  Search,
  Sparkles,
  Stethoscope,
  Volume2,
  Zap,
} from 'lucide-react';
import { Doctor, Department, Appointment } from '../types/hospital';
import { playHospitalChime } from '../utils/hospitalAudio';

interface LiveQueueBoardProps {
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  onAdvanceToken: (doctorId: string) => void;
}

export const LiveQueueBoard: React.FC<LiveQueueBoardProps> = ({
  doctors,
  departments,
  appointments,
  onAdvanceToken,
}) => {
  const [tokenSearch, setTokenSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleCallNextWithSound = (doctorId: string) => {
    if (soundEnabled) {
      playHospitalChime();
    }
    onAdvanceToken(doctorId);
  };

  // Check if patient searched for their token
  const patientSearchResult = (() => {
    if (!tokenSearch.trim()) return null;
    const query = tokenSearch.trim().toLowerCase();

    const matchedAppt = appointments.find(
      (a) =>
        String(a.tokenNumber) === query ||
        a.bookingRef.toLowerCase().includes(query) ||
        a.uhid.toLowerCase().includes(query) ||
        a.patientName.toLowerCase().includes(query)
    );

    if (!matchedAppt) return null;

    const doc = doctors.find((d) => d.id === matchedAppt.doctorId);
    const dept = departments.find((d) => d.id === matchedAppt.departmentId);

    const currentServing = doc?.opdCurrentToken || 1;
    const tokensAhead = Math.max(0, matchedAppt.tokenNumber - currentServing);
    const estWait = tokensAhead * (dept?.averageWaitTimeMins || 10);

    return {
      appointment: matchedAppt,
      doctor: doc,
      department: dept,
      currentServing,
      tokensAhead,
      estWait,
      isNowServing: currentServing === matchedAppt.tokenNumber,
      isPassed: currentServing > matchedAppt.tokenNumber,
    };
  })();

  return (
    <div className="space-y-8">
      {/* Big Screen Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE OPD CLINIC BROADCAST</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Central OPD Live Token Display
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time synchronization between doctors&apos; consulting chambers and patient waiting lobbies.
              Estimated wait times automatically update as tokens advance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Audio chime toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playHospitalChime();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                soundEnabled
                  ? 'bg-sky-600/30 border-sky-500/60 text-sky-200 hover:bg-sky-600/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${soundEnabled ? 'text-sky-400 animate-pulse' : ''}`} />
              <span>{soundEnabled ? 'Chime Alert: ON' : 'Chime Alert: OFF'}</span>
            </button>

            <button
              onClick={() => playHospitalChime()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Test Chime</span>
            </button>
          </div>
        </div>

        {/* Patient Track My Token Search Box */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Track Your Appointment Position in Real-Time:
          </label>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                placeholder="Enter Token # (e.g. 15), UHID, or Patient Name..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500"
              />
            </div>
            {tokenSearch && (
              <button
                onClick={() => setTokenSearch('')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Result Card */}
          {patientSearchResult && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-sky-500/50 text-white animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center font-mono font-black text-xl shadow-md">
                    #{patientSearchResult.appointment.tokenNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {patientSearchResult.appointment.patientName}
                      </span>
                      <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                        {patientSearchResult.appointment.uhid}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Dr. {patientSearchResult.doctor?.name} • Room {patientSearchResult.doctor?.roomNumber} ({patientSearchResult.department?.name})
                    </p>
                  </div>
                </div>

                {/* Queue status tag */}
                <div className="sm:text-right">
                  {patientSearchResult.isNowServing ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs animate-bounce">
                      <BellRing className="w-4 h-4" />
                      <span>YOU ARE BEING CALLED NOW! Enter Room {patientSearchResult.doctor?.roomNumber}</span>
                    </div>
                  ) : patientSearchResult.isPassed ? (
                    <span className="text-xs text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-800 font-semibold">
                      Token Passed • Contact OPD Desk 4 for re-entry
                    </span>
                  ) : patientSearchResult.tokensAhead === 1 ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs ring-4 ring-amber-400/60 animate-pulse shadow-md">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                      </span>
                      <BellRing className="w-3.5 h-3.5 animate-bounce" />
                      <span>
                        YOU ARE NEXT IN LINE! Please stand by Room {patientSearchResult.doctor?.roomNumber}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-emerald-400">
                        {`${patientSearchResult.tokensAhead} patients ahead in queue`}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Approx wait: ~{patientSearchResult.estWait} mins
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OPD Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((doc) => {
          const dept = departments.find((d) => d.id === doc.departmentId);
          const currentToken = doc.opdCurrentToken;

          // Next 3 waiting tokens
          const nextTokens = [currentToken + 1, currentToken + 2, currentToken + 3];

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Header: Room & Doctor info */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold">
                    ROOM {doc.roomNumber} • {dept?.floorWing}
                  </span>
                  <h3 className="text-base font-bold text-white truncate max-w-[220px]">
                    Dr. {doc.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">{dept?.name}</p>
                </div>

                <div className="text-right">
                  {doc.status === 'on-duty' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      CONSULTING
                    </span>
                  ) : doc.status === 'in-surgery' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      IN SURGERY
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                      OFF-DUTY
                    </span>
                  )}
                </div>
              </div>

              {/* Main Token Display Panel */}
              <div className="p-5 text-center bg-slate-50 border-y border-slate-100">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                  NOW SERVING TOKEN
                </span>
                <div className="text-5xl font-black font-mono text-sky-900 my-1 tracking-tight">
                  #{currentToken}
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pacing: ~{dept?.averageWaitTimeMins || 10} mins per consultation</span>
                </div>
              </div>

              {/* Next in Queue Tokens with Visual Alert Pulse Animation */}
              <div className="p-4 space-y-3">
                {/* Visual Alert Pulse Banner for the token that is next in line to see the doctor */}
                {doc.status === 'on-duty' && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                      </span>
                      <span className="text-amber-950 font-medium text-[11px]">
                        Next to Consult:{' '}
                        <strong className="font-mono text-xs font-black text-amber-950">
                          Token #{currentToken + 1}
                        </strong>
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                      <Zap className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      Stand By Door
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Queue Sequence:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    {nextTokens.map((t, idx) => {
                      const isNextInLine = idx === 0;
                      return isNextInLine ? (
                        <div key={t} className="relative inline-flex items-center">
                          {/* Pulsing beacon glow ring */}
                          <span className="absolute -inset-1 rounded-lg bg-amber-400/40 animate-ping opacity-60"></span>
                          <span
                            className="relative inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-950 rounded-lg border-2 border-amber-400 text-xs font-black shadow-xs ring-2 ring-amber-400/50 animate-pulse"
                            title={`Token #${t} is NEXT IN LINE to see Dr. ${doc.name}`}
                          >
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600"></span>
                            </span>
                            <span>#{t}</span>
                            <span className="text-[9px] uppercase font-bold tracking-wider bg-amber-500 text-white px-1 py-0.2 rounded leading-tight">
                              NEXT
                            </span>
                          </span>
                        </div>
                      ) : (
                        <span
                          key={t}
                          className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-600 font-medium"
                        >
                          #{t}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Simulation button for demo & examiner evaluation */}
                <button
                  onClick={() => handleCallNextWithSound(doc.id)}
                  disabled={doc.status !== 'on-duty'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-sky-700 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Call Next Token (#{currentToken + 1})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
