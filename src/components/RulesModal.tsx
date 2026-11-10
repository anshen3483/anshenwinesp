import React from 'react';
import { 
  X, 
  Trophy, 
  ShieldCheck, 
  Clock, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Users, 
  Flame,
  Award,
  Wallet
} from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-[#0E121A] border-t border-x border-[#263042] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#131720] border-b border-[#1E2536]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF5722]/15 text-[#FF5722] border border-[#FF5722]/30">
              <Trophy className="w-5 h-5 text-[#FF5722]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                <span>TOURNAMENT RULES &amp; REGULATIONS</span>
              </h3>
              <p className="text-[11px] text-slate-400">Official AnshenWin Free Fire Fair-Play Guidelines</p>
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

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar text-xs text-slate-200">
          {/* Quick Notice Banner */}
          <div className="p-3 bg-gradient-to-r from-[#17120A] via-[#22160C] to-[#121A15] border border-amber-500/40 rounded-2xl flex items-center gap-3">
            <Flame className="w-6 h-6 text-[#FF5722] shrink-0 animate-bounce" />
            <div className="text-[11px] text-amber-200 leading-snug">
              <strong className="text-white font-black block mb-0.5">PADHNA ZAROORI HAI (MANDATORY RULES):</strong>
              Rules ka ulanghan karne wale players ko bina kisi refund ke match se bahar kar diya jayega.
            </div>
          </div>

          {/* 1. ELIGIBILITY */}
          <div className="p-3.5 bg-[#131720] border border-[#263042] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#00FF66] uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#00FF66]" />
              <span>📋 ELIGIBILITY (PATRATA):</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66] shrink-0 mt-0.5" />
                <span><strong>Free Fire Level:</strong> Minimum Level <strong>40+ Mandatory</strong> hai.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66] shrink-0 mt-0.5" />
                <span><strong>Min. BR Rank:</strong> Player ki rank kam se kam <strong>Diamond II</strong> honi chahiye.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66] shrink-0 mt-0.5" />
                <span><strong>Accurate Details:</strong> Free Fire In-Game Name (IGN) & UID profile me 100% accurate hona zaroori hai.</span>
              </li>
            </ul>
          </div>

          {/* 2. ROOM ENTRY & SLOTS */}
          <div className="p-3.5 bg-[#131720] border border-[#263042] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#38BDF8] uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#38BDF8]" />
              <span>🔓 ROOM ENTRY & SLOTS:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span><strong>Room Release Timing:</strong> Room ID & Password match start hone se <strong>10-15 minute pehle</strong> app par dikhega.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span><strong>Free Slot Selection:</strong> App ka slot number follow karna zaroori nahi hai! Aap room ke andar <strong>kisi bhi available slot par baith sakte hain</strong> (apni team/pasand ke sath).</span>
              </li>
            </ul>
          </div>

          {/* 3. 🚨 ROOM & TIMING RULES (5 MINUTE TIMER) */}
          <div className="p-3.5 bg-[#1A0E0E] border-2 border-[#FF5722] rounded-2xl space-y-2 shadow-lg shadow-[#FF5722]/10">
            <div className="flex items-center gap-2 text-xs font-black text-[#FF5722] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#FF5722] animate-pulse" />
              <span>⏱️ ROOM & TIMING RULES (5-MIN COUNTDOWN):</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-200 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0 mt-1.5"></span>
                <span><strong>Admin ID/Pass Timing:</strong> Room ID aur Password match time se 10-15 min pehle Admin dwara live kiya jayega.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0 mt-1.5"></span>
                <span><strong>5-Minute Timer Start:</strong> Jaise hi Admin ID/Pass dega, theek usi pal <strong>sirf 5 Minute ka live countdown timer</strong> start ho jayega.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0 mt-1.5"></span>
                <span><strong>No Wait Policy:</strong> 5 minute poore hote hi match bina kisi ka wait kiye <strong>START</strong> kar diya jayega. Late aane wale players khud responsible honge.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0 mt-1.5"></span>
                <span><strong>Private Timer:</strong> Ye 5 min ka timer app me sirf unhi players ko dikhta hai jinhone match join kiya hai!</span>
              </li>
            </ul>
          </div>

          {/* 4. RESULT & WINNINGS */}
          <div className="p-3.5 bg-[#131720] border border-[#263042] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#00FF66] uppercase tracking-wider">
              <Camera className="w-4 h-4 text-[#00FF66]" />
              <span>📸 RESULT & WINNINGS:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66] shrink-0 mt-0.5" />
                <span><strong>Screenshot Mandatory:</strong> Match khatam hote hi apni <strong>Rank & Kills ka Screenshot</strong> zaroor le lein.</span>
              </li>
              <li className="flex items-start gap-2">
                <Wallet className="w-3.5 h-3.5 text-[#00FF66] shrink-0 mt-0.5" />
                <span><strong>Fast Payout:</strong> Result declare hone ke <strong>15-30 minute ke andar</strong> winning amount (Booyah ₹50, Per Kill ₹18) aapke app wallet me add ho jayega.</span>
              </li>
            </ul>
          </div>

          {/* 5. STRICT WARNING */}
          <div className="p-3.5 bg-[#160D12] border border-rose-600/50 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>🚫 STRICT WARNING:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-rose-200/90 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                <span><strong>Anti-Hack:</strong> Hackers / Cheaters ko turant permanently <strong>BLOCK & BAN</strong> kiya jayega aur saari winning forfeit ho jayegi.</span>
              </li>
              <li className="flex items-start gap-2">
                <Smartphone className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Mobile Only:</strong> Emulator (PC / Bluestacks / Gameloop) allow nahi hai. Ye strictly mobile-only tournament hai.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#131720] border-t border-[#1E2536] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
            <span>Fair Play Certified</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-95 text-black font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
          >
            I UNDERSTAND & AGREE
          </button>
        </div>
      </div>
    </div>
  );
};
