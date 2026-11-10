import React, { useState } from 'react';
import { TournamentMatch, UserProfile } from '../types';
import { FreeFireLogo } from './FreeFireLogo';
import { AnshenWinLogo } from './AnshenWinLogo';
import { getMatchPrizeBreakdown } from '../utils/prizeCalculator';
import { X, Gamepad2, ShieldAlert, CheckCircle2, User, Hash, AlertCircle, Trophy, Award } from 'lucide-react';

interface JoinMatchModalProps {
  match: TournamentMatch;
  userProfile: UserProfile;
  onClose: () => void;
  onConfirmJoin: (matchId: string, ign: string, uid: string) => void;
}

export const JoinMatchModal: React.FC<JoinMatchModalProps> = ({
  match,
  userProfile,
  onClose,
  onConfirmJoin,
}) => {
  const [ign, setIgn] = useState(userProfile.ign);
  const [uid, setUid] = useState(userProfile.uid);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ign.trim()) {
      setError('Free Fire In-Game Name (IGN) is required.');
      return;
    }
    if (!uid.trim()) {
      setError('Free Fire UID is required.');
      return;
    }
    if (!/^\d{6,14}$/.test(uid.trim())) {
      setError('Free Fire UID must be a valid numeric ID (6-14 digits).');
      return;
    }

    if (match.entryFee > 0 && userProfile.walletBalance < match.entryFee) {
      setError(`Insufficient wallet balance. You need ₹${match.entryFee} to join.`);
      return;
    }

    onConfirmJoin(match.id, ign.trim(), uid.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-[#131720] border-t border-x border-[#263042] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottom-Sheet Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#1E2536] bg-[#0E121A] shrink-0">
          <div className="flex items-center gap-3">
            <AnshenWinLogo size="sm" showSubtitle={true} subtitleText="SLOT JOIN" />
            <div className="border-l border-[#263042] pl-3">
              <h3 className="text-xs font-black text-white tracking-wide truncate max-w-[180px]">{match.title}</h3>
              <p className="text-[10px] text-slate-400">Entry: ₹{match.entryFee} · FF Solo Room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-[#1E2536] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Quick Summary */}
        <div className="px-6 py-3 bg-[#0A0C10] border-b border-[#1E2536] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Entry:</span>
            <span className="font-bold text-amber-400 font-mono">₹{match.entryFee}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Booyah:</span>
            <span className="font-bold text-[#00FF66] font-mono">₹{match.booyahPrize} 🏆</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Slots:</span>
            <span className="font-semibold text-slate-200">{match.participants.length}/{match.maxSlots}</span>
          </div>
        </div>

        {/* Official Prize Distribution Grid */}
        <div className="px-6 py-2.5 bg-[#0C111A] border-b border-[#1E2536] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-black uppercase text-amber-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Prize Distribution:</span>
            </span>
            <span className="text-[10px] text-slate-400">{match.gameMode}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {getMatchPrizeBreakdown(match).slice(0, 6).map((item, idx) => (
              <div key={idx} className="p-1.5 bg-[#121824] rounded-lg border border-[#1F2B40] flex items-center justify-between">
                <span className="font-semibold text-slate-300">{item.rankLabel}</span>
                <span className={`font-black font-mono ${item.prize > 0 ? 'text-[#00FF66]' : 'text-slate-500'}`}>
                  {item.prize > 0 ? `₹${item.prize}` : '₹0'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* IGN Field */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              Free Fire In-Game Name (IGN) <span className="text-[#00FF66]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-[#00FF66]" />
              </div>
              <input
                type="text"
                required
                value={ign}
                onChange={(e) => {
                  setIgn(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. ANSHEN⚡777"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0C10] border border-[#263042] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66] transition-colors"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Enter your exact Free Fire nickname as shown in the game.
            </p>
          </div>

          {/* UID Field */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              Free Fire UID (Numeric) <span className="text-[#FF5722]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Hash className="w-4 h-4 text-[#FF5722]" />
              </div>
              <input
                type="text"
                required
                value={uid}
                onChange={(e) => {
                  setUid(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                placeholder="e.g. 1928374650"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0C10] border border-[#263042] rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#FF5722] transition-colors"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Your 6 to 12 digit player UID found on your Free Fire profile.
            </p>
          </div>

          {/* Official Tournament Rules Quick Box */}
          <div className="p-3 bg-[#0E121A] border border-[#FF5722]/40 rounded-xl text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <ShieldAlert className="w-4 h-4 text-[#FF5722]" />
                <span>🏆 TOURNAMENT RULES & REGULATIONS:</span>
              </div>
              <span className="text-[10px] text-[#00FF66] font-bold">Level 40+ Only</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300 pl-1">
              <li>• <strong>Eligibility:</strong> Free Fire Level <strong>40+ Mandatory</strong> • Min. BR Rank: <strong>Diamond II</strong>.</li>
              <li>• <strong>Room Entry:</strong> Room ID & Password match se 10-15 minute pehle dikhega.</li>
              <li>• <strong>5-Min Timer:</strong> Room milte hi sirf <strong>5 Minute ka timer</strong> chalega, 5 min poore hote hi match bina wait kiye START ho jayega.</li>
              <li>• <strong>Slots:</strong> App ka slot number follow karna zaroori nahi hai, kisi bhi available slot par baith sakte hain.</li>
              <li>• <strong>Screenshot:</strong> Match ke baad Rank & Kills ka screenshot zaroor lein. Wallet me 15-30 min me payout hoga.</li>
              <li>• <strong>Warning:</strong> No Emulators (Mobile only), Hackers turant permanently block honge.</li>
            </ul>
          </div>

          {/* Mobile Thumb-Friendly Action Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="col-span-1 min-h-[48px] px-4 py-2.5 text-xs font-bold text-slate-300 bg-[#1A2130] hover:bg-[#232C3F] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="col-span-2 min-h-[48px] flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black text-black bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-[0.98] rounded-xl transition-all shadow-lg shadow-[#00FF66]/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Join</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
