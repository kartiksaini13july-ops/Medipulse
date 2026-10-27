/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Clock,
  Mail,
  CalendarCheck,
  Radio,
  FileCode,
  PhoneCall,
  Menu,
  X,
  Stethoscope,
  Users,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'book' | 'queue' | 'appointments' | 'desk';
  setActiveTab: (tab: 'book' | 'queue' | 'appointments' | 'desk') => void;
  openEmailModal: () => void;
  openProjectDocs: () => void;
  unreadEmailCount: number;
  appointmentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openEmailModal,
  openProjectDocs,
  unreadEmailCount,
  appointmentCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top emergency & system broadcast bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            OPD Central Server Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">
            Real-Time Slot Engine: <strong className="text-white">v3.4.1</strong>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-sky-300">
            Automated SMTP Dispatcher: <strong>Online</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openProjectDocs}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/80 hover:bg-sky-900 border border-sky-600/60 text-sky-200 transition text-[11px] font-medium"
            title="View 3rd Sem B.Tech Mini Project Documentation & Viva Guide"
            aria-label="View 3rd Sem B.Tech Mini Project Documentation & Viva Guide"
          >
            <FileCode className="w-3 h-3 text-sky-400" />
            <span>3rd Sem B.Tech Mini Project</span>
            <span className="bg-sky-500/30 text-sky-100 text-[9px] px-1.5 rounded uppercase font-bold tracking-wider">
              CSE / IT
            </span>
          </button>

          <div className="flex items-center gap-1 font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime || '09:00:00 AM'}</span>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('book')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center shadow-md shadow-sky-600/20 text-white">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Medi<span className="text-sky-600">Pulse</span>
                </span>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  OPD
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
                Hospital Clinical Scheduling & Notification Portal
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'book'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'queue'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>Live OPD Queue</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'appointments'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>My Appointments</span>
              {appointmentCount > 0 && (
                <span className="bg-sky-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {appointmentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('desk')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'desk'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>OPD Doctor Desk</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Automated Email Inbox Launcher */}
            <button
              onClick={openEmailModal}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-medium transition cursor-pointer"
              title="Open Automated Patient Confirmation Email Mailbox"
              aria-label="Open Automated Patient Confirmation Email Mailbox"
            >
              <Mail className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline font-semibold">Patient Mailbox</span>
              {unreadEmailCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* Emergency Hotline */}
            <a
              href="tel:108"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition shadow-xs"
              title="Hospital Emergency Trauma Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>Emergency 108</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('book');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold ${
              activeTab === 'book' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
            }`}
          >
            <Stethoscope className="w-5 h-5 text-sky-600" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('queue');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              activeTab === 'queue' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-emerald-600" />
              <span>Live OPD Queue Board</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
              Live
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('appointments');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              activeTab === 'appointments' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-5 h-5 text-sky-600" />
              <span>My Appointments</span>
            </div>
            {appointmentCount > 0 && (
              <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {appointmentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('desk');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold ${
              activeTab === 'desk' ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
            }`}
          >
            <Users className="w-5 h-5 text-sky-600" />
            <span>OPD Doctor Desk & Queue Control</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                openProjectDocs();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
            >
              <FileCode className="w-4 h-4 text-sky-600" />
              <span>3rd Sem B.Tech Mini Project Viva Guide</span>
            </button>
            <button
              onClick={() => {
                openEmailModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-sky-600 text-white text-xs font-semibold"
            >
              <Mail className="w-4 h-4" />
              <span>Open Patient Confirmation Mailbox ({unreadEmailCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
