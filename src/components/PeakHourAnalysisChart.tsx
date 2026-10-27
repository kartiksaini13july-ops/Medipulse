/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  Legend,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { Doctor, Department, TimeSlot, Appointment } from '../types/hospital';
import { calculatePeakHourDensity, identifyPeakWindows } from '../utils/bookingLogic';

interface PeakHourAnalysisChartProps {
  doctors: Doctor[];
  departments: Department[];
  slots: TimeSlot[];
  appointments: Appointment[];
}

export const PeakHourAnalysisChart: React.FC<PeakHourAnalysisChartProps> = ({
  doctors,
  departments,
  slots,
  appointments,
}) => {
  // Filters
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'density' | 'occupancy' | 'comparison'>('density');

  // Available dates
  const availableDates = useMemo(() => {
    return Array.from(new Set(slots.map((s) => s.date))).sort();
  }, [slots]);

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates[0] || new Date().toISOString().split('T')[0]
  );

  // Density metrics
  const densityData = useMemo(() => {
    return calculatePeakHourDensity(slots, selectedDoctorId, selectedDate);
  }, [slots, selectedDoctorId, selectedDate]);

  // Peak window analytics
  const peakInsights = useMemo(() => {
    return identifyPeakWindows(densityData);
  }, [densityData]);

  // Overall statistics
  const totalSlotsCount = useMemo(() => {
    return densityData.reduce((sum, d) => sum + d.capacity, 0);
  }, [densityData]);

  const totalBookedCount = useMemo(() => {
    return densityData.reduce((sum, d) => sum + d.booked, 0);
  }, [densityData]);

  const overallOccupancy = useMemo(() => {
    return totalSlotsCount > 0 ? Math.round((totalBookedCount / totalSlotsCount) * 100) : 0;
  }, [totalBookedCount, totalSlotsCount]);

  // Morning vs Evening breakdown
  const shiftDistribution = useMemo(() => {
    const morningBooked = densityData
      .filter((d) => d.time.includes('AM'))
      .reduce((sum, d) => sum + d.booked, 0);
    const eveningBooked = densityData
      .filter((d) => d.time.includes('PM'))
      .reduce((sum, d) => sum + d.booked, 0);
    const total = morningBooked + eveningBooked || 1;
    return {
      morningPct: Math.round((morningBooked / total) * 100),
      eveningPct: Math.round((eveningBooked / total) * 100),
      morningBooked,
      eveningBooked,
    };
  }, [densityData]);

  // Doctor comparison data for comparison view
  const doctorComparisonData = useMemo(() => {
    return doctors.map((doc) => {
      const dept = departments.find((d) => d.id === doc.departmentId);
      const docSlots = slots.filter((s) => s.doctorId === doc.id && s.date === selectedDate);
      const booked = docSlots.reduce((sum, s) => sum + s.bookedCount, 0);
      const capacity = docSlots.reduce((sum, s) => sum + s.maxCapacity, 0);
      const occupancy = capacity > 0 ? Math.round((booked / capacity) * 100) : 0;

      return {
        doctorName: `Dr. ${doc.name.split(' ')[0]}`,
        fullName: `Dr. ${doc.name}`,
        specialty: dept?.name || 'Specialist',
        booked,
        capacity,
        occupancy,
        status: doc.status,
      };
    });
  }, [doctors, departments, slots, selectedDate]);

  // Selected doctor object
  const currentDocObj = doctors.find((d) => d.id === selectedDoctorId);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2 min-w-56 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-sky-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Slot: {label}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                data.occupancyRate >= 75
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : data.occupancyRate >= 50
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {data.occupancyRate >= 75
                ? 'Peak Surge'
                : data.occupancyRate >= 50
                ? 'Moderate Load'
                : 'Optimal Flow'}
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Booked Appointments:</span>
              <strong className="text-white font-mono text-sm">{data.booked} patients</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Slot Capacity:</span>
              <span className="font-mono text-slate-400">{data.capacity} spots</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800">
              <span>Occupancy Rate:</span>
              <strong
                className={`font-mono text-sm ${
                  data.occupancyRate >= 75 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {data.occupancyRate}%
              </strong>
            </div>
          </div>

          {/* Progress bar inside tooltip */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                data.occupancyRate >= 75
                  ? 'bg-rose-500'
                  : data.occupancyRate >= 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, data.occupancyRate)}%` }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-bold">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
              <span>OPD Load & Capacity Intelligence</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
            Peak Hour Analysis & Appointment Density
          </h3>
          <p className="text-xs text-slate-500">
            Real-time statistical visualization of clinical load distribution across time slots for each consultant.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Doctor Selector */}
          <div className="relative min-w-56">
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              aria-label="Select Doctor for Peak Hour Analysis"
            >
              <option value="all">All Doctors (Hospital Aggregate Load)</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.name} (Room {doc.roomNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              aria-label="Select Date for Peak Hour Analysis"
            >
              {availableDates.map((dateStr, idx) => (
                <option key={dateStr} value={dateStr}>
                  {idx === 0 ? `Today (${dateStr})` : dateStr}
                </option>
              ))}
            </select>
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs border border-slate-200/80">
            <button
              onClick={() => setViewMode('density')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'density'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Density (Bar)
            </button>
            <button
              onClick={() => setViewMode('occupancy')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'occupancy'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curve (Area %)
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'comparison'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctors Comparison
            </button>
          </div>
        </div>
      </div>

      {/* 4 Peak Intelligence Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Busiest Time Slot</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {peakInsights.busiestSlot}
          </div>
          <p className="text-[11px] text-rose-700 font-semibold mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Peak Load: {peakInsights.highestBooked} Patients ({peakInsights.highestOccupancy}% Capacity)
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Optimal Off-Peak Slot</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
            {peakInsights.recommendedOffPeak}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Recommended for shortest queue wait times</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Shift Split (AM / PM)</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {shiftDistribution.morningPct}% <span className="text-sm font-medium text-slate-400">/</span> {shiftDistribution.eveningPct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {shiftDistribution.morningBooked} morning vs {shiftDistribution.eveningBooked} evening
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">OPD Capacity Utilization</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-950 font-mono">
            {overallOccupancy}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalBookedCount} of {totalSlotsCount} total available slots booked
          </p>
        </div>
      </div>

      {/* Main Recharts Visualization Container */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-inner space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-slate-300">
              Visualizing:{' '}
              <strong className="text-white">
                {selectedDoctorId === 'all'
                  ? 'All 8 OPD Clinical Specialties Combined'
                  : `Dr. ${currentDocObj?.name} (Room ${currentDocObj?.roomNumber})`}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block"></span>
              <span>Available / Optimal (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500 inline-block"></span>
              <span>Filling Fast (50-74%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-500 inline-block"></span>
              <span>Peak Surge (&ge;75%)</span>
            </div>
          </div>
        </div>

        {/* Chart View 1: Density Bar Chart */}
        {viewMode === 'density' && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={densityData}
                margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={selectedDoctorId === 'all' ? 18 : 2}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Peak Capacity Threshold',
                    fill: '#fca5a5',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
                <Bar dataKey="booked" radius={[6, 6, 0, 0]}>
                  {densityData.map((entry, index) => {
                    let fillColor = '#10b981'; // Green
                    if (entry.occupancyRate >= 75) {
                      fillColor = '#ef4444'; // Red
                    } else if (entry.occupancyRate >= 50) {
                      fillColor = '#f59e0b'; // Amber
                    }
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart View 2: Occupancy Rate Area Chart */}
        {viewMode === 'occupancy' && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={densityData}
                margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={75}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: 'High Congestion Alert (75%)',
                    fill: '#fca5a5',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="occupancyRate"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#occupancyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart View 3: Doctor Workload Comparison */}
        {viewMode === 'comparison' && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorComparisonData}
                layout="vertical"
                margin={{ top: 10, right: 25, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="doctorName"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} ${name === 'booked' ? 'Patients Booked' : 'Total Slots'}`,
                    name === 'booked' ? 'Appointments' : 'Capacity',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="booked" fill="#38bdf8" name="Booked Patients" radius={[0, 4, 4, 0]} />
                <Bar dataKey="capacity" fill="#475569" name="Max Capacity" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Analytical Recommendations Footnote */}
      <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-950">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Clinical Operations Recommendation:</span>
            <p className="text-slate-600 text-[11px] mt-0.5">
              The morning 10:00 AM - 11:30 AM block experiences the highest concurrent arrival velocity.
              Hospital staff are advised to station an additional triage nurse at OPD Desk 4 during this peak window.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedDoctorId('all');
            setViewMode('density');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-sky-300 hover:bg-sky-100 text-sky-800 font-bold transition text-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          Reset to Hospital Aggregate
        </button>
      </div>
    </div>
  );
};
