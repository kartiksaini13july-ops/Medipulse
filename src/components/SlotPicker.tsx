/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Check,
  Clock,
  Info,
  Sun,
  Sunset,
  Zap,
} from 'lucide-react';
import { Doctor, TimeSlot } from '../types/hospital';

interface SlotPickerProps {
  doctor: Doctor;
  slots: TimeSlot[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSlotId: string;
  setSelectedSlotId: (slotId: string) => void;
  onProceedToPatientForm: () => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  doctor,
  slots,
  selectedDate,
  setSelectedDate,
  selectedSlotId,
  setSelectedSlotId,
  onProceedToPatientForm,
}) => {
  // Extract distinct dates from slots for this doctor
  const doctorSlots = slots.filter((s) => s.doctorId === doctor.id);
  const distinctDates = Array.from(new Set(doctorSlots.map((s) => s.date))).sort();

  // Filter slots for the chosen date
  const dateSlots = doctorSlots.filter((s) => s.date === selectedDate);

  // Group into Morning vs Evening
  const morningSlots = dateSlots.filter((s) => s.startTime.includes('AM'));
  const eveningSlots = dateSlots.filter((s) => s.startTime.includes('PM'));

  // Calculate real-time stats for the day
  const totalSlotsCount = dateSlots.length;
  const availableSlotsCount = dateSlots.filter(
    (s) => s.status === 'available' || s.status === 'filling-fast'
  ).length;
  const bookedPercent =
    totalSlotsCount > 0
      ? Math.round(((totalSlotsCount - availableSlotsCount) / totalSlotsCount) * 100)
      : 0;

  const selectedSlot = doctorSlots.find((s) => s.id === selectedSlotId);

  // Format date readable
  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const isToday =
          today.getFullYear() === d.getFullYear() &&
          today.getMonth() === d.getMonth() &&
          today.getDate() === d.getDate();

        const isTomorrow =
          tomorrow.getFullYear() === d.getFullYear() &&
          tomorrow.getMonth() === d.getMonth() &&
          tomorrow.getDate() === d.getDate();

        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (isToday) return `Today (${monthDay})`;
        if (isTomorrow) return `Tomorrow (${monthDay})`;
        return `${weekday}, ${monthDay}`;
      }
    } catch {
      // Fallback
    }
    return dateStr;
  };

  return (
    <div id="slot-picker-section" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header and Doctor summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Real-Time Slot Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            3. Select Appointment Date & Time Slot
          </h2>
          <p className="text-xs text-slate-500">
            Booking for <strong className="text-slate-800">Dr. {doctor.name}</strong> • Room {doctor.roomNumber}
          </p>
        </div>

        {/* Real-time booking meter */}
        <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl text-right sm:min-w-44">
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between gap-3">
            <span>Availability Status</span>
            <span className="font-bold text-slate-800">{availableSlotsCount} of {totalSlotsCount} open</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                bookedPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${bookedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Date Selector Tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">
          Consultation Date:
        </label>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {distinctDates.map((dateStr) => {
            const isSelected = selectedDate === dateStr;
            const openInDate = doctorSlots.filter(
              (s) => s.date === dateStr && (s.status === 'available' || s.status === 'filling-fast')
            ).length;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(dateStr);
                  // Auto-unselect if the current slot isn't on this date
                  if (selectedSlot && selectedSlot.date !== dateStr) {
                    setSelectedSlotId('');
                  }
                }}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border transition text-left flex flex-col gap-0.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{formatDateLabel(dateStr)}</span>
                <span
                  className={`text-[10px] font-medium ${
                    isSelected ? 'text-sky-100' : 'text-slate-500'
                  }`}
                >
                  {openInDate > 0 ? `${openInDate} slots open` : 'Full / No slots'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Status Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-slate-600">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          Live Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span>Available (2+ spots)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-amber-800 font-medium">Filling Fast (1 spot left)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
          <span className="text-slate-400">Booked Out</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
          <span className="text-rose-600">Doctor In OT</span>
        </div>
      </div>

      {/* Slots Section */}
      <div className="space-y-6">
        {/* Morning Shift */}
        {morningSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Morning Shift (09:00 AM - 01:00 PM)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {morningSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isBlocked = slot.status === 'blocked';
                const isFull = slot.status === 'full';
                const isFillingFast = slot.status === 'filling-fast';
                const remaining = slot.maxCapacity - slot.bookedCount;

                return (
                  <button
                    key={slot.id}
                    disabled={isBlocked || isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600 text-sky-950 shadow-xs'
                        : isBlocked
                        ? 'bg-rose-50/50 border-rose-200 text-rose-400 cursor-not-allowed opacity-75'
                        : isFull
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : isFillingFast
                        ? 'bg-amber-50/60 border-amber-300 hover:border-amber-400 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {slot.startTime}
                      </span>
                      {isSelected && (
                        <span className="h-4 w-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] mt-1">
                      {isBlocked ? (
                        <span className="text-rose-600 font-semibold">Doctor in OT</span>
                      ) : isFull ? (
                        <span className="text-slate-500 font-medium">Fully Booked</span>
                      ) : isFillingFast ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                          Only 1 spot left!
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">
                          {remaining} spots available
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Evening Shift */}
        {eveningSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
              <Sunset className="w-4 h-4 text-orange-500" />
              <span>Evening Shift (04:00 PM - 07:00 PM)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {eveningSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isBlocked = slot.status === 'blocked';
                const isFull = slot.status === 'full';
                const isFillingFast = slot.status === 'filling-fast';
                const remaining = slot.maxCapacity - slot.bookedCount;

                return (
                  <button
                    key={slot.id}
                    disabled={isBlocked || isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600 text-sky-950 shadow-xs'
                        : isBlocked
                        ? 'bg-rose-50/50 border-rose-200 text-rose-400 cursor-not-allowed opacity-75'
                        : isFull
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : isFillingFast
                        ? 'bg-amber-50/60 border-amber-300 hover:border-amber-400 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {slot.startTime}
                      </span>
                      {isSelected && (
                        <span className="h-4 w-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] mt-1">
                      {isBlocked ? (
                        <span className="text-rose-600 font-semibold">Doctor in OT</span>
                      ) : isFull ? (
                        <span className="text-slate-500 font-medium">Fully Booked</span>
                      ) : isFillingFast ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                          Only 1 spot left!
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">
                          {remaining} spots available
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected slot notification banner and Next Step Button */}
      {selectedSlot && (
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-900">
                Selected Slot: <strong>{formatDateLabel(selectedSlot.date)} at {selectedSlot.startTime}</strong>
              </p>
              <p className="text-[11px] text-sky-700">
                Slot reservation temporarily locked for 10 minutes while you fill patient details.
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToPatientForm}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0"
          >
            Enter Patient Details →
          </button>
        </div>
      )}
    </div>
  );
};
