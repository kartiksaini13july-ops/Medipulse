/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle2,
  ChevronLeft,
  Mail,
  Phone,
  Shield,
  Stethoscope,
  User,
  Video,
} from 'lucide-react';
import {
  Department,
  Doctor,
  TimeSlot,
  ConsultationMode,
} from '../types/hospital';
import { validateBookingInput } from '../utils/bookingLogic';

interface PatientBookingFormProps {
  doctor: Doctor;
  department: Department;
  slot: TimeSlot;
  onBackToSlots: () => void;
  onSubmitBooking: (formData: {
    patientName: string;
    patientAge: number;
    patientGender: 'Male' | 'Female' | 'Other';
    patientPhone: string;
    patientEmail: string;
    bloodGroup: string;
    consultationMode: ConsultationMode;
    symptoms: string;
  }) => void;
  isSubmitting: boolean;
}

const COMMON_SYMPTOMS = [
  'Routine Health Checkup',
  'Chest Tightness / Flutter',
  'Severe Migraine / Headache',
  'Persistent Joint & Knee Pain',
  'High Fever / Flu Symptoms',
  'Skin Rash / Allergy Flare',
  'Digestive Acidity & Nausea',
];

export const PatientBookingForm: React.FC<PatientBookingFormProps> = ({
  doctor,
  department,
  slot,
  onBackToSlots,
  onSubmitBooking,
  isSubmitting,
}) => {
  const [patientName, setPatientName] = useState('Kartik Tyagi');
  const [patientAge, setPatientAge] = useState<number | string>(21);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState('+91 9876543210');
  const [patientEmail, setPatientEmail] = useState('kt759122@gmail.com');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('in-person');
  const [symptoms, setSymptoms] = useState('Routine clinical checkup and seasonal consultation');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handlePresetEmail = (email: string) => {
    setPatientEmail(email);
    if (formErrors.patientEmail) {
      const updated = { ...formErrors };
      delete updated.patientEmail;
      setFormErrors(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBookingInput({
      patientName,
      patientAge,
      patientEmail,
      patientPhone,
      symptoms,
      slotId: slot.id,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    onSubmitBooking({
      patientName: patientName.trim(),
      patientAge: Number(patientAge),
      patientGender,
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      bloodGroup,
      consultationMode,
      symptoms: symptoms.trim(),
    });
  };

  return (
    <div id="patient-form-section" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <button
            type="button"
            onClick={onBackToSlots}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Change Slot / Doctor</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            4. Patient Details & Consultation Mode
          </h2>
          <p className="text-xs text-slate-500">
            An automated email with your clinical OPD Token will be instantly dispatched to your email address.
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400">Doctor & Time</span>
          <div className="text-xs font-bold text-slate-800">
            Dr. {doctor.name} • {slot.date} {slot.startTime}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Consultation Mode Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Consultation Mode:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setConsultationMode('in-person')}
              className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
                consultationMode === 'in-person'
                  ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/30 text-sky-950'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg ${
                  consultationMode === 'in-person' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">In-Person OPD Clinic Visit</span>
                  {consultationMode === 'in-person' && (
                    <Check className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Consult in person at Room {doctor.roomNumber}, {department.floorWing}.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setConsultationMode('video')}
              className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
                consultationMode === 'video'
                  ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/30 text-sky-950'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg ${
                  consultationMode === 'video' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Teleconsultation / HD Video</span>
                  {consultationMode === 'video' && (
                    <Check className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Secure encrypted video call link sent to your email.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Patient Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Patient Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Kartik Tyagi"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 ${
                  formErrors.patientName
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-sky-500'
                }`}
              />
            </div>
            {formErrors.patientName && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {formErrors.patientName}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age (Years) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="e.g. 21"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 ${
                formErrors.patientAge
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-200 focus:ring-sky-500'
              }`}
            />
            {formErrors.patientAge && (
              <p className="text-[11px] text-red-500 mt-1">{formErrors.patientAge}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value as 'Male' | 'Female' | 'Other')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="A+">A+ (Positive)</option>
              <option value="A-">A- (Negative)</option>
              <option value="B+">B+ (Positive)</option>
              <option value="B-">B- (Negative)</option>
              <option value="AB+">AB+ (Positive)</option>
              <option value="AB-">AB- (Negative)</option>
              <option value="O+">O+ (Positive)</option>
              <option value="O-">O- (Negative)</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number (SMS Updates) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 9876543210"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 ${
                  formErrors.patientPhone
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-sky-500'
                }`}
              />
            </div>
            {formErrors.patientPhone && (
              <p className="text-[11px] text-red-500 mt-1">{formErrors.patientPhone}</p>
            )}
          </div>
        </div>

        {/* Email for Automated Confirmation */}
        <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-sky-950">
              Patient Email Address (For Automated OPD Slip Dispatch) <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              Automated SMTP Email
            </span>
          </div>

          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="patient@example.com"
              className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 ${
                formErrors.patientEmail
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-300 focus:ring-sky-500'
              }`}
            />
          </div>
          {formErrors.patientEmail && (
            <p className="text-[11px] text-red-500 mt-1">{formErrors.patientEmail}</p>
          )}

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
            <span className="text-slate-500">Quick autofill:</span>
            <button
              type="button"
              onClick={() => handlePresetEmail('kt759122@gmail.com')}
              className="px-2.5 py-1 bg-white hover:bg-sky-100 border border-sky-300 rounded-md text-sky-800 font-medium transition cursor-pointer"
            >
              kt759122@gmail.com (Preset)
            </button>
            <button
              type="button"
              onClick={() => handlePresetEmail('student.btech@college.edu')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium transition cursor-pointer"
            >
              student.btech@college.edu
            </button>
          </div>
        </div>

        {/* Symptoms / Chief Complaints */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Chief Complaints & Clinical Symptoms <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe what you are experiencing, duration, prior medication..."
            className={`w-full p-3 bg-slate-50 border rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 ${
              formErrors.symptoms
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-200 focus:ring-sky-500'
            }`}
          />
          {formErrors.symptoms && (
            <p className="text-[11px] text-red-500 mt-1">{formErrors.symptoms}</p>
          )}

          {/* Symptom quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {COMMON_SYMPTOMS.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => setSymptoms(sym)}
                className="text-[10px] bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
              >
                + {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card and Submit Button */}
        <div className="pt-4 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="text-slate-500">Appointment Summary</div>
              <div className="font-bold text-slate-900">
                Dr. {doctor.name} ({department.name})
              </div>
              <div className="text-slate-600 text-[11px]">
                {slot.date} • {slot.startTime} • Room {doctor.roomNumber} ({consultationMode === 'video' ? 'Video Call' : 'In-Person'})
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Consultation Fee</span>
              <div className="text-base font-black text-slate-900">Rs. {doctor.consultationFee}</div>
              <span className="text-[10px] text-emerald-600 font-medium">To be settled at OPD Desk</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onBackToSlots}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition order-2 sm:order-1"
            >
              Back to Slots
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-70 order-1 sm:order-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Locking Slot & Dispatching Automated Confirmation Email...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Confirm Booking & Dispatch Automated Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
