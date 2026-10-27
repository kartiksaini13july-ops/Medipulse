/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Check,
  CheckCheck,
  ChevronRight,
  Copy,
  ExternalLink,
  Inbox,
  Mail,
  Printer,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Trash2,
  X,
} from 'lucide-react';
import { EmailNotification } from '../types/hospital';

interface EmailInboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailNotification[];
  selectedEmailId?: string;
  onSelectEmail: (id: string) => void;
  onClearEmails?: () => void;
  onPrintEmail: (email: EmailNotification) => void;
}

export const EmailInboxDrawer: React.FC<EmailInboxDrawerProps> = ({
  isOpen,
  onClose,
  emails,
  selectedEmailId,
  onSelectEmail,
  onClearEmails,
  onPrintEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'headers' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  // Active email or defaults to the first
  const currentEmail =
    emails.find((e) => e.id === selectedEmailId) || (emails.length > 0 ? emails[0] : null);

  const filteredEmails = emails.filter((e) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      e.recipientEmail.toLowerCase().includes(q) ||
      e.recipientName.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q)
    );
  });

  const handleCopyContent = () => {
    if (!currentEmail) return;
    const textToCopy =
      activeTab === 'raw'
        ? currentEmail.htmlBody
        : activeTab === 'headers'
        ? JSON.stringify(currentEmail.headers, null, 2)
        : currentEmail.textBody;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerMailto = () => {
    if (!currentEmail) return;
    const mailtoUrl = `mailto:${encodeURIComponent(currentEmail.recipientEmail)}?subject=${encodeURIComponent(
      currentEmail.subject
    )}&body=${encodeURIComponent(currentEmail.textBody)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Automated Patient Email Delivery Inbox</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SMTP Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated confirmation mail engine • 3rd Sem B.Tech Mini Project Component
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              aria-label="Close Email Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content split into Mailbox List and Preview Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Email List */}
          <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
            {/* Search filter in inbox */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter by email or subject..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span>Total Dispatched: {emails.length}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> All 250 OK
                </span>
              </div>
            </div>

            {/* Email list items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredEmails.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No automated emails found</p>
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isSelected = currentEmail?.id === email.id;
                  const dateStr = new Date(email.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <button
                      key={email.id}
                      onClick={() => onSelectEmail(email.id)}
                      className={`w-full p-3 text-left transition flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-white border-l-4 border-l-sky-600 shadow-xs'
                          : 'hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 truncate max-w-[170px]">
                          {email.recipientName}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">{dateStr}</span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {email.subject}
                      </div>

                      <div className="text-[11px] text-slate-500 line-clamp-2">
                        {email.previewSnippet}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                          250 OK
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono truncate">
                          {email.recipientEmail}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Email Viewer Pane */}
          {currentEmail ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Email Toolbar */}
              <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      activeTab === 'preview'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Formatted Email
                  </button>
                  <button
                    onClick={() => setActiveTab('headers')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      activeTab === 'headers'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SMTP Headers
                  </button>
                  <button
                    onClick={() => setActiveTab('raw')}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      activeTab === 'raw'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Raw HTML
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyContent}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                    title="Copy Email Content"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleTriggerMailto}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 transition"
                    title="Open in your machine email client"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send via Mail Client</span>
                  </button>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {activeTab === 'preview' && (
                  <div className="max-w-xl mx-auto space-y-4">
                    {/* Simulated Email Client Envelope */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">From:</span>
                        <span className="font-medium text-slate-800">{currentEmail.headers.from}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">To:</span>
                        <span className="font-semibold text-slate-900">{currentEmail.headers.to}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Sent:</span>
                        <span className="text-slate-700">
                          {new Date(currentEmail.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500">Subject:</span>
                        <span className="font-bold text-slate-900">{currentEmail.subject}</span>
                      </div>
                    </div>

                    {/* Rendered HTML */}
                    <div
                      className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                      dangerouslySetInnerHTML={{ __html: currentEmail.htmlBody }}
                    />
                  </div>
                )}

                {activeTab === 'headers' && (
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
                      <Terminal className="w-4 h-4" />
                      <span>SMTP Transaction Headers & TLS Verification</span>
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <div>
                        <span className="text-sky-400">Return-Path:</span> &lt;bounce@medipulse-hospital.org&gt;
                      </div>
                      <div>
                        <span className="text-sky-400">Received:</span> from mail.medipulse-hms.internal by smtp.relay (TLSv1.3)
                      </div>
                      <div>
                        <span className="text-sky-400">Message-ID:</span> {currentEmail.headers.messageId}
                      </div>
                      <div>
                        <span className="text-sky-400">Date:</span> {currentEmail.sentAt}
                      </div>
                      <div>
                        <span className="text-sky-400">From:</span> {currentEmail.headers.from}
                      </div>
                      <div>
                        <span className="text-sky-400">To:</span> {currentEmail.headers.to}
                      </div>
                      <div>
                        <span className="text-sky-400">Subject:</span> {currentEmail.headers.subject}
                      </div>
                      <div>
                        <span className="text-sky-400">Content-Type:</span> {currentEmail.headers.contentType}
                      </div>
                      <div>
                        <span className="text-sky-400">X-Priority:</span> 1 (High - OPD Confirmation Token)
                      </div>
                      <div className="pt-2 text-emerald-400">
                        <span className="text-slate-400">SMTP Response:</span> {currentEmail.headers.smtpStatus}
                      </div>
                      <div className="text-emerald-400">
                        <span className="text-slate-400">Cipher:</span> {currentEmail.headers.tlsVersion}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'raw' && (
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{currentEmail.htmlBody}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 p-8">
              Select an email from the left pane to view confirmation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
