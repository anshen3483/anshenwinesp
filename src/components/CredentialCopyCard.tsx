import React, { useState } from 'react';
import { Copy, Check, Key, Sparkles, Zap } from 'lucide-react';

interface CredentialCopyCardProps {
  roomId: string;
  roomPassword?: string;
  matchTitle: string;
  compact?: boolean;
  onCopied?: (label: string, value: string) => void;
}

export const CredentialCopyCard: React.FC<CredentialCopyCardProps> = ({
  roomId,
  roomPassword,
  matchTitle,
  compact = false,
  onCopied,
}) => {
  const [copiedField, setCopiedField] = useState<'ID' | 'PASS' | 'ALL' | null>(null);
  const [idFlashTick, setIdFlashTick] = useState(0);
  const [passFlashTick, setPassFlashTick] = useState(0);
  const [allFlashTick, setAllFlashTick] = useState(0);

  const copyWithFlash = async (
    value: string,
    field: 'ID' | 'PASS' | 'ALL',
    humanLabel: string
  ) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    setCopiedField(field);
    if (field === 'ID') setIdFlashTick((prev) => prev + 1);
    if (field === 'PASS') setPassFlashTick((prev) => prev + 1);
    if (field === 'ALL') setAllFlashTick((prev) => prev + 1);

    if (onCopied) {
      onCopied(humanLabel, value);
    }

    setTimeout(() => {
      setCopiedField((current) => (current === field ? null : current));
    }, 1800);
  };

  const passwordValue = roomPassword && roomPassword.trim() ? roomPassword : 'None';

  if (compact) {
    return (
      <div className="px-3 py-2 bg-[#0A1310] border-b border-[#00FF66]/35 space-y-1.5">
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-black uppercase tracking-wider text-[#00FF66] flex items-center gap-1">
            <Key className="w-3 h-3" />
            <span>Room Live • Tap Credentials to Auto-Copy</span>
          </span>
          {copiedField && (
            <span className="font-black text-[#00FF66] flex items-center gap-0.5 animate-pulse">
              <Zap className="w-2.5 h-2.5" />
              <span>Copied!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {/* Compact Room ID Click Box */}
          <button
            type="button"
            key={`compact-id-${idFlashTick}`}
            onClick={() => copyWithFlash(roomId, 'ID', 'Room ID')}
            className={`relative overflow-hidden px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between group ${
              idFlashTick > 0 && copiedField === 'ID'
                ? 'animate-credential-flash bg-[#00FF66]/20 border-[#00FF66]'
                : 'bg-[#090D14] hover:bg-[#111A28] border-[#24324A] hover:border-[#00FF66]/60'
            }`}
            title="Tap to copy Room ID"
          >
            {idFlashTick > 0 && copiedField === 'ID' && (
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#00FF66]/45 to-transparent animate-credential-sweep" />
            )}
            <div className="min-w-0">
              <span className="text-[8px] font-bold uppercase text-slate-400 block">Room ID</span>
              <span className="text-xs font-black font-mono text-white tracking-wider truncate block">
                {roomId}
              </span>
            </div>
            {copiedField === 'ID' ? (
              <Check className="w-3.5 h-3.5 text-[#00FF66] shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#00FF66] shrink-0" />
            )}
          </button>

          {/* Compact Room Password Click Box */}
          <button
            type="button"
            key={`compact-pass-${passFlashTick}`}
            onClick={() => copyWithFlash(roomPassword || '', 'PASS', 'Password')}
            className={`relative overflow-hidden px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between group ${
              passFlashTick > 0 && copiedField === 'PASS'
                ? 'animate-credential-flash bg-[#00FF66]/20 border-[#00FF66]'
                : 'bg-[#090D14] hover:bg-[#111A28] border-[#24324A] hover:border-[#00FF66]/60'
            }`}
            title="Tap to copy Room Password"
          >
            {passFlashTick > 0 && copiedField === 'PASS' && (
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#00FF66]/45 to-transparent animate-credential-sweep" />
            )}
            <div className="min-w-0">
              <span className="text-[8px] font-bold uppercase text-slate-400 block">Password</span>
              <span className="text-xs font-black font-mono text-[#00FF66] tracking-wider truncate block">
                {passwordValue}
              </span>
            </div>
            {copiedField === 'PASS' ? (
              <Check className="w-3.5 h-3.5 text-[#00FF66] shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#00FF66] shrink-0" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-gradient-to-b from-[#111927] to-[#0D131F] border-2 border-[#00FF66] rounded-2xl shadow-xl shadow-[#00FF66]/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Key className="w-4 h-4 text-[#00FF66] animate-bounce" />
          <span className="text-xs font-black tracking-wider text-[#00FF66] uppercase">
            CUSTOM ROOM CREDENTIALS (LIVE)
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/15 px-2 py-0.5 rounded border border-[#00FF66]/35">
          Tap Card to Copy ⚡
        </span>
      </div>

      {/* Interactive Room ID Credential Card */}
      <button
        type="button"
        key={`room-id-${idFlashTick}`}
        onClick={() => copyWithFlash(roomId, 'ID', 'Room ID')}
        className={`w-full relative overflow-hidden p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] ${
          idFlashTick > 0 && copiedField === 'ID'
            ? 'animate-credential-flash bg-[#00FF66]/20 border-[#00FF66]'
            : 'bg-[#090C12] hover:bg-[#0E1522] border-[#263042] hover:border-[#00FF66]/70'
        }`}
        title="Click anywhere on Room ID to copy"
      >
        {idFlashTick > 0 && copiedField === 'ID' && (
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#00FF66]/50 to-transparent animate-credential-sweep" />
        )}

        <div className="relative z-10">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <span>ROOM ID</span>
            <span className="text-[9px] text-slate-500 group-hover:text-[#00FF66] transition-colors">
              • Click to copy
            </span>
          </span>
          <span className="text-lg font-black font-mono tracking-widest text-white block mt-0.5">
            {roomId}
          </span>
        </div>

        <span
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 font-black text-xs rounded-xl transition-all shadow-md ${
            copiedField === 'ID'
              ? 'bg-[#00FF66] text-black scale-105 shadow-[#00FF66]/40'
              : 'bg-[#00FF66] group-hover:bg-[#33FF85] text-black'
          }`}
        >
          {copiedField === 'ID' ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>⚡ COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY ID</span>
            </>
          )}
        </span>
      </button>

      {/* Interactive Room Password Credential Card */}
      <button
        type="button"
        key={`room-pass-${passFlashTick}`}
        onClick={() => copyWithFlash(roomPassword || '', 'PASS', 'Password')}
        className={`w-full relative overflow-hidden p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] ${
          passFlashTick > 0 && copiedField === 'PASS'
            ? 'animate-credential-flash bg-[#00FF66]/20 border-[#00FF66]'
            : 'bg-[#090C12] hover:bg-[#0E1522] border-[#263042] hover:border-[#00FF66]/70'
        }`}
        title="Click anywhere on Password to copy"
      >
        {passFlashTick > 0 && copiedField === 'PASS' && (
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#00FF66]/50 to-transparent animate-credential-sweep" />
        )}

        <div className="relative z-10">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <span>ROOM PASSWORD</span>
            <span className="text-[9px] text-slate-500 group-hover:text-[#00FF66] transition-colors">
              • Click to copy
            </span>
          </span>
          <span className="text-lg font-black font-mono tracking-widest text-[#00FF66] block mt-0.5">
            {passwordValue}
          </span>
        </div>

        <span
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 font-black text-xs rounded-xl transition-all border ${
            copiedField === 'PASS'
              ? 'bg-[#00FF66] text-black border-[#00FF66] scale-105 shadow-md shadow-[#00FF66]/40'
              : 'bg-[#1E2536] group-hover:bg-[#283248] text-white border-slate-600'
          }`}
        >
          {copiedField === 'PASS' ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>⚡ COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY PASS</span>
            </>
          )}
        </span>
      </button>

      {/* Quick Action: Copy Full Room Details with Flash */}
      <button
        type="button"
        key={`room-all-${allFlashTick}`}
        onClick={() =>
          copyWithFlash(
            `AnshenWin FF Custom Room\nMatch: ${matchTitle}\nRoom ID: ${roomId}\nPassword: ${passwordValue}\nSlot: Sit on any available slot`,
            'ALL',
            'Room ID & Password'
          )
        }
        className={`w-full relative overflow-hidden py-2.5 border font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] ${
          allFlashTick > 0 && copiedField === 'ALL'
            ? 'animate-credential-flash bg-[#00FF66] text-black border-[#00FF66]'
            : 'bg-[#131720] hover:bg-[#1C2331] border-[#00FF66]/40 text-[#00FF66]'
        }`}
      >
        {allFlashTick > 0 && copiedField === 'ALL' && (
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-credential-sweep" />
        )}
        {copiedField === 'ALL' ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>⚡ Full Room ID + Password Copied!</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Copy Full Room Details (ID + Password)</span>
          </>
        )}
      </button>
    </div>
  );
};
