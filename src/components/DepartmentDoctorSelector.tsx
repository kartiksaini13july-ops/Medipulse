/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  Baby,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  HeartPulse,
  MapPin,
  ShieldAlert,
  Sparkles,
  Star,
  Stethoscope,
  Wind,
} from 'lucide-react';
import { Department, Doctor, TimeSlot } from '../types/hospital';

interface DepartmentDoctorSelectorProps {
  departments: Department[];
  doctors: Doctor[];
  slots: TimeSlot[];
  selectedDepartmentId: string;
  setSelectedDepartmentId: (id: string) => void;
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  searchQuery: string;
  onDoctorSelected: (doctor: Doctor) => void;
}

const DEPARTMENT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  HeartPulse: HeartPulse,
  Brain: Brain,
  Activity: Activity,
  Baby: Baby,
  Sparkles: Sparkles,
  Stethoscope: Stethoscope,
  Wind: Wind,
  ShieldAlert: ShieldAlert,
};

export const DepartmentDoctorSelector: React.FC<DepartmentDoctorSelectorProps> = ({
  departments,
  doctors,
  slots,
  selectedDepartmentId,
  setSelectedDepartmentId,
  selectedDoctorId,
  setSelectedDoctorId,
  searchQuery,
  onDoctorSelected,
}) => {
  // Filter doctors based on department & search query
  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept =
      selectedDepartmentId === 'all' || doc.departmentId === selectedDepartmentId;

    if (!searchQuery.trim()) {
      return matchesDept;
    }

    const query = searchQuery.toLowerCase();
    const matchesName = doc.name.toLowerCase().includes(query);
    const matchesQual = doc.qualification.toLowerCase().includes(query);
    const matchesBio = doc.bio.toLowerCase().includes(query);
    const dept = departments.find((d) => d.id === doc.departmentId);
    const matchesDeptName = dept?.name.toLowerCase().includes(query) || false;

    return (matchesName || matchesQual || matchesBio || matchesDeptName) && matchesDept;
  });

  // Calculate available slots per doctor for today & tomorrow
  const getDoctorSlotsSummary = (doctorId: string) => {
    const docSlots = slots.filter((s) => s.doctorId === doctorId);
    const availableCount = docSlots.filter(
      (s) => s.status === 'available' || s.status === 'filling-fast'
    ).length;
    const firstAvailable = docSlots.find(
      (s) => s.status === 'available' || s.status === 'filling-fast'
    );
    return {
      availableCount,
      nextSlotTime: firstAvailable ? `${firstAvailable.date} ${firstAvailable.startTime}` : 'No slots',
    };
  };

  return (
    <div id="booking-section" className="space-y-8">
      {/* Department Tabs Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              1. Select Clinical Specialty
            </h2>
            <p className="text-xs text-slate-500">
              Choose from 8 super-speciality departments with real-time queue synchronization
            </p>
          </div>
          {selectedDepartmentId !== 'all' && (
            <button
              onClick={() => setSelectedDepartmentId('all')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800"
            >
              Show All Specialties
            </button>
          )}
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedDepartmentId('all')}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
              selectedDepartmentId === 'all'
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>All Specialties</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedDepartmentId === 'all' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {doctors.length} Doctors
            </span>
          </button>

          {departments.map((dept) => {
            const IconComponent = DEPARTMENT_ICONS[dept.icon] || Stethoscope;
            const isSelected = selectedDepartmentId === dept.id;
            const doctorCount = doctors.filter((d) => d.departmentId === dept.id).length;

            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartmentId(dept.id)}
                className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                <span>{dept.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {doctorCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctors Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              2. Choose Consultant Doctor
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredDoctors.length} specialist doctors with live clinical status
            </p>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No doctors match your query</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try searching with a broader term or reset the department filter to view all specialists.
            </p>
            <button
              onClick={() => {
                setSelectedDepartmentId('all');
              }}
              className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredDoctors.map((doc) => {
              const dept = departments.find((d) => d.id === doc.departmentId);
              const isSelected = selectedDoctorId === doc.id;
              const slotInfo = getDoctorSlotsSummary(doc.id);

              return (
                <div
                  key={doc.id}
                  className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-sky-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top ribbon: Status and Department */}
                  <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      {dept?.name}
                    </span>

                    {/* Doctor live status indicator */}
                    {doc.status === 'on-duty' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        On Duty (Room {doc.roomNumber})
                      </span>
                    )}

                    {doc.status === 'in-surgery' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        In Emergency OT / ICU
                      </span>
                    )}

                    {doc.status === 'on-break' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Short Clinical Break
                      </span>
                    )}

                    {doc.status === 'off-duty' && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Shift Complete
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col sm:flex-row gap-4 items-start">
                    {/* Doctor Photo */}
                    <div className="relative shrink-0">
                      <img
                        src={doc.photoUrl}
                        alt={`Dr. ${doc.name}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80';
                        }}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-inner"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                        <CheckCircle className="w-4 h-4 text-sky-600" />
                      </span>
                    </div>

                    {/* Doctor Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          Dr. {doc.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({doc.reviewCount})
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-slate-600 leading-snug">
                        {doc.qualification}
                      </p>

                      <p className="text-[11px] text-slate-500 line-clamp-2">{doc.bio}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-sky-600" />
                          <span>{doc.experienceYears}+ yrs exp</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dept?.floorWing}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor surgery warning if active */}
                  {doc.statusNote && (
                    <div className="mx-5 mb-3 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span>{doc.statusNote}</span>
                    </div>
                  )}

                  {/* Footer with fee and Action */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        Consultation Fee
                      </span>
                      <div className="text-sm font-bold text-slate-900">
                        Rs. {doc.consultationFee}{' '}
                        <span className="text-[11px] font-normal text-slate-500">/ OPD Visit</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        onDoctorSelected(doc);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                        isSelected
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Doctor Selected' : 'Choose Slot'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
