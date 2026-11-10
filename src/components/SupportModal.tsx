import React, { useState } from 'react';
import { X, MessageSquare, Mail, Phone, Clock, ShieldCheck, Copy, Check, ExternalLink, Send, Sparkles, HelpCircle } from 'lucide-react';
import { AnshenWinLogo } from './AnshenWinLogo';

interface SupportModalProps {
  onClose: () => void;
  userIgn?: string;
  userUid?: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  onClose,
  userIgn = 'Player',
  userUid = '',
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [quickQuery, setQuickQuery] = useState('');

  const WHATSAPP_NUMBER = '9569167476';
  const WHATSAPP_DISPLAY = '+91 95691 67476';
  const SUPPORT_EMAIL = 'anshengaming@gmail.com';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getWhatsAppUrl = (customText?: string) => {
    const text = customText?.trim() 
      ? `Hello AnshenWin Support, I am ${userIgn} (UID: ${userUid || 'Not set'}). Issue: ${customText}`
      : `Hello AnshenWin Team, I need help regarding Free Fire Tournament. IGN: ${userIgn}`;
    return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const getMailtoUrl = () => {
    const subject = `AnshenWin Support Request - ${userIgn}`;
    const body = `Hi AnshenWin Team,\n\nI need assistance with:\n${quickQuery || '[Describe your issue here]'}\n\nMy Details:\nIGN: ${userIgn}\nUID: ${userUid}\n\nThank you!`;
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-[#111622] border-t border-x border-[#263248] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0C121C] via-[#101A29] to-[#0A1812] border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Help & Support 24/7</h3>
                <span className="flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">AnshenWin Free Fire Customer Care & Assistance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-[#1E2536] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-100 flex-1 no-scrollbar">
          {/* Welcome Banner */}
          <div className="p-3.5 bg-gradient-to-r from-[#0E1A14] to-[#121B2A] border border-[#00FF66]/30 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#00FF66] tracking-wider">
                Direct Official Support
              </span>
              <h4 className="text-sm font-black text-white mt-0.5">
                Koi bhi problem ho? Turant contact karein!
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Room ID issue, wallet deposit, winning prize payout ya slot inquiry.
              </p>
            </div>
            <AnshenWinLogo size="sm" showSubtitle={false} />
          </div>

          {/* Option 1: WhatsApp Support (Primary) */}
          <div className="p-4 bg-gradient-to-br from-[#091E15] via-[#0E261B] to-[#121D24] border-2 border-emerald-500/50 rounded-2xl space-y-3 relative overflow-hidden shadow-lg shadow-emerald-950/40">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                {/* Official WhatsApp Green Badge Icon */}
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Official WhatsApp Support
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                      Fastest Reply
                    </span>
                  </div>
                  <p className="text-lg font-black text-white font-mono mt-0.5">
                    {WHATSAPP_DISPLAY}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(WHATSAPP_NUMBER, 'phone')}
                className="p-2 bg-[#172620] hover:bg-[#20362C] border border-emerald-500/40 rounded-xl text-emerald-300 transition-all cursor-pointer"
                title="Copy WhatsApp Number"
              >
                {copiedType === 'phone' ? (
                  <Check className="w-4 h-4 text-[#00FF66]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-200">
              WhatsApp par direct message karein for instant solution. Typical reply time: <strong>under 2 minutes</strong>!
            </p>

            <a
              href={getWhatsAppUrl(quickQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#22bf5b] active:scale-[0.99] text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp ({WHATSAPP_NUMBER})</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {/* Option 2: Email Support */}
          <div className="p-4 bg-[#0F1420] border border-[#232F46] rounded-2xl space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                    Official Email Support
                  </span>
                  <p className="text-sm font-black text-white font-mono mt-0.5">
                    {SUPPORT_EMAIL}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(SUPPORT_EMAIL, 'email')}
                className="p-2 bg-[#182030] hover:bg-[#212C42] border border-sky-500/40 rounded-xl text-sky-300 transition-all cursor-pointer"
                title="Copy Support Email"
              >
                {copiedType === 'email' ? (
                  <Check className="w-4 h-4 text-sky-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Formal complaints, payment receipts, screenshot verification & sponsorship queries.
            </p>

            <a
              href={getMailtoUrl()}
              className="w-full py-2.5 bg-[#1B2436] hover:bg-[#25324C] border border-sky-500/40 text-sky-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Send Email to {SUPPORT_EMAIL}</span>
            </a>
          </div>

          {/* Quick Query Box */}
          <div className="p-3.5 bg-[#0C1018] border border-[#1E273A] rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Describe your issue (Optional quick message):</span>
            </div>
            <textarea
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="e.g. Deposit ₹100 done but balance not updated / Need Room ID help..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-[#121724] border border-[#26334A] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
            />
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
            <div className="p-2.5 bg-[#0E131E] rounded-xl border border-[#1E2536] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00FF66] shrink-0" />
              <span>100% Refund if Match gets canceled</span>
            </div>
            <div className="p-2.5 bg-[#0E131E] rounded-xl border border-[#1E2536] flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Instant Payout Support via UPI</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0A0D14] border-t border-[#1E2536] flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            AnshenWin • Trusted Free Fire Platform
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1B2332] hover:bg-[#253147] text-slate-200 font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
