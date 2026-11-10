import React, { useState, useEffect } from 'react';
import { TournamentMatch, UserProfile } from '../types';
import { FreeFireLogo } from './FreeFireLogo';
import { AnshenWinLogo } from './AnshenWinLogo';
import { CredentialCopyCard } from './CredentialCopyCard';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Key, 
  Lock, 
  ShieldCheck, 
  Users, 
  Clock, 
  Trophy, 
  Coins, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Gamepad2,
  Camera,
  Upload,
  Smartphone,
  Award,
  Flame,
  Wallet
} from 'lucide-react';

interface MatchRoomDetailsScreenProps {
  match: TournamentMatch;
  userProfile: UserProfile;
  onBack: () => void;
  onRefreshRoom?: () => void;
}

export const MatchRoomDetailsScreen: React.FC<MatchRoomDetailsScreenProps> = ({
  match,
  userProfile,
  onBack,
  onRefreshRoom,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);

  // ⏱️ 5-Minute Live Countdown Timer: Starts ONLY when Admin publishes Room ID & Password!
  const calculateRemainingSeconds = () => {
    if (!match.isRoomReleased || !match.roomId) return 0;
    if (match.roomReleasedAt) {
      const elapsed = Math.floor((Date.now() - match.roomReleasedAt) / 1000);
      return Math.max(0, 300 - elapsed);
    }
    return 300;
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateRemainingSeconds);

  useEffect(() => {
    if (!match.isRoomReleased || !match.roomId) {
      setSecondsLeft(0);
      return;
    }

    setSecondsLeft(calculateRemainingSeconds());

    const timer = setInterval(() => {
      setSecondsLeft(() => {
        if (!match.isRoomReleased || !match.roomId) return 0;
        if (match.roomReleasedAt) {
          const elapsed = Math.floor((Date.now() - match.roomReleasedAt) / 1000);
          return Math.max(0, 300 - elapsed);
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [match.isRoomReleased, match.roomId, match.roomReleasedAt]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const participant = match.participants.find((p) => p.uid === userProfile.uid);
  const isJoined = Boolean(participant);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setToastMsg(`${label} copied! Paste in Free Fire.`);
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
    setTimeout(() => setCopiedKey(null), 2000);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCopyAll = () => {
    const text = `AnshenWin FF Custom Room\nMatch: ${match.title}\nRoom ID: ${match.roomId}\nPassword: ${match.roomPassword || 'None'}\nSlot: Kisi bhi available slot par baith sakte hain`;
    navigator.clipboard.writeText(text);
    setCopiedKey('ALL');
    setToastMsg('Room ID & Password copied!');
    setTimeout(() => setCopiedKey(null), 2000);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshRoom) onRefreshRoom();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleScreenshotUpload = () => {
    setScreenshotUploaded(true);
    setToastMsg('Screenshot submitted! Verification takes 15-30 minutes.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#090B0E] text-slate-100 overflow-y-auto no-scrollbar relative">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 px-3.5 py-3 bg-[#0E121A]/95 backdrop-blur-md border-b border-[#1E2536] flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-1 text-slate-300 hover:text-white bg-[#131720] hover:bg-[#1C2331] border border-[#263042] rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#00FF66]" />
          <span>Matches</span>
        </button>

        <div className="flex flex-col items-center">
          <AnshenWinLogo size="sm" showSubtitle={true} subtitleText="CUSTOM ROOM" />
          <span className="text-[10px] text-slate-300 font-mono font-bold truncate max-w-[170px] mt-0.5">
            {match.title}
          </span>
        </div>

        <button
          onClick={handleManualRefresh}
          className={`p-2 bg-[#131720] hover:bg-[#1C2331] border border-[#263042] rounded-xl text-slate-400 hover:text-[#00FF66] transition-all cursor-pointer ${
            isRefreshing ? 'animate-spin text-[#00FF66]' : ''
          }`}
          title="Refresh Room Status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3.5 space-y-3 pb-8">
        {/* Verified Joined Banner */}
        <div className="p-3 bg-gradient-to-r from-[#0C1A12] via-[#102318] to-[#0E1624] border border-[#00FF66]/50 rounded-2xl relative overflow-hidden shadow-lg shadow-[#00FF66]/5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66]">
                <ShieldCheck className="w-5 h-5 text-[#00FF66]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wide text-white">
                    VERIFIED PARTICIPANT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Player: <span className="text-white font-bold">{userProfile.ign}</span> (UID: {userProfile.uid})
                </p>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-[#00FF66] text-black font-black text-xs rounded-xl shadow-md">
              JOINED
            </div>
          </div>
        </div>

        {/* 🚨 5-MINUTE LIVE COUNTDOWN TIMER (Sirf joined players ko dikhega jab ID/Pass aayega) */}
        {match.isRoomReleased && match.roomId ? (
          <div className="p-3.5 bg-gradient-to-r from-[#220B0B] via-[#2A1010] to-[#1E0909] border-2 border-[#FF5722] rounded-2xl shadow-xl shadow-[#FF5722]/15 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF5722] animate-pulse">
                  <Clock className="w-5 h-5 text-[#FF5722]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">
                      ROOM JOINING TIME (SIRF 5 MINUTE)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping"></span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono tracking-widest text-white drop-shadow-md">
                      {formatTimer(secondsLeft)}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {secondsLeft > 0 ? 'baaki hai room join karne me' : '⏱️ TIME UP! MATCH STARTING'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-[#FF5722] text-black font-black text-[10px] rounded-full uppercase tracking-wider">
                  Hurry!
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#3B1515] rounded-full mt-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF5722] to-amber-400 transition-all duration-1000 rounded-full"
                style={{ width: `${(secondsLeft / 300) * 100}%` }}
              ></div>
            </div>

            <p className="text-[10px] text-rose-200 mt-2 leading-tight">
              ⚠️ <strong>5 minute poore hote hi match bina kisi ka wait kiye START ho jayega!</strong> Late aane wale players khud responsible honge.
            </p>
          </div>
        ) : null}

        {/* 🔑 MAIN ROOM ID & PASSWORD SECTION (EXCLUSIVE TO JOINED USERS) */}
        {match.isRoomReleased && match.roomId ? (
          <CredentialCopyCard
            roomId={match.roomId}
            roomPassword={match.roomPassword}
            matchTitle={match.title}
            onCopied={(label) => {
              setToastMsg(`⚡ ${label} copied! Paste directly in Free Fire.`);
              setTimeout(() => setToastMsg(null), 2400);
            }}
          />
        ) : (
          /* Locked Room Card */
          <div className="p-4 bg-[#111622] border border-[#FF5722]/50 rounded-2xl text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FF5722]/15 border border-[#FF5722]/30 flex items-center justify-center text-[#FF5722]">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white tracking-wide">
                ROOM ID & PASSWORD LOCKED
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 max-w-[280px] mx-auto leading-relaxed">
                Room ID & Password match start hone se <span className="text-[#00FF66] font-bold">10-15 minute pehle</span> dikhega. Live hote hi 5 minute ka timer start hoga!
              </p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping"></span>
              <span>Waiting for Admin to publish room...</span>
            </div>
          </div>
        )}

        {/* 🔓 OFFICIAL SLOTS RULE: FREE SLOT SELECTION */}
        <div className="p-3 bg-[#0D1520] border border-[#38BDF8]/40 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-black text-[#38BDF8]">
            <Users className="w-4 h-4 text-[#38BDF8]" />
            <span>ROOM ENTRY & SLOTS RULE:</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-snug">
            ✨ <strong>App ka slot number follow karna zaroori nahi hai!</strong> Aap Free Fire custom room ke andar <strong>kisi bhi available slot par baith sakte hain</strong> (apni team ya manpasand slot ke sath).
          </p>
        </div>

        {/* 📸 RESULT & WINNINGS SUBMISSION (Screenshot Rule) */}
        <div className="p-3.5 bg-[#131720] border border-[#263042] rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-[#00FF66]">
              <Camera className="w-4 h-4 text-[#00FF66]" />
              <span>RESULT & WINNINGS (SCREENSHOT MANDATORY):</span>
            </div>
            <span className="text-[10px] text-[#00FF66] font-bold bg-[#00FF66]/10 px-2 py-0.5 rounded border border-[#00FF66]/20">
              15-30 Min Payout
            </span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1">
            <p>• Match khatam hote hi apni <strong>Rank & Kills ka Screenshot</strong> zaroor le lein.</p>
            <p>• Result declare hone ke <strong>15-30 minute ke andar</strong> winning amount aapke app wallet me add ho jayega.</p>
          </div>

          {/* Screenshot Upload Simulator Button */}
          <button
            onClick={handleScreenshotUpload}
            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              screenshotUploaded
                ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]'
                : 'bg-[#1A2232] hover:bg-[#222E44] border-[#384660] text-slate-200'
            }`}
          >
            {screenshotUploaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#00FF66]" />
                <span>SCREENSHOT SUBMITTED (VERIFYING IN 15-30 MINS)</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#00FF66]" />
                <span>UPLOAD MATCH RESULT SCREENSHOT (RANK & KILLS)</span>
              </>
            )}
          </button>
        </div>

        {/* 📋 ELIGIBILITY CHECKLIST */}
        <div className="p-3.5 bg-[#131720] border border-[#263042] rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-amber-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>PLAYER ELIGIBILITY (PATRATA):</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-[#090C12] rounded-xl border border-[#1E2536] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
              <div>
                <span className="block text-slate-400 font-semibold">Free Fire Level</span>
                <span className="text-white font-black text-xs">Level 40+ Mandatory</span>
              </div>
            </div>
            <div className="p-2 bg-[#090C12] rounded-xl border border-[#1E2536] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
              <div>
                <span className="block text-slate-400 font-semibold">Min. BR Rank</span>
                <span className="text-white font-black text-xs">Diamond II or Above</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 pt-0.5">
            Free Fire IGN & UID profile me 100% accurate hona chahiye taaki wallet prize transfer smooth rahe.
          </p>
        </div>

        {/* 🚫 STRICT ANTI-CHEAT & EMULATOR WARNING */}
        <div className="p-3 bg-[#170C12] border border-rose-600/50 rounded-2xl space-y-1.5 text-xs text-rose-200">
          <div className="flex items-center gap-2 font-black text-rose-400 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>STRICT WARNING (NO HACKS • NO EMULATOR):</span>
          </div>
          <p className="text-[10px] leading-tight text-rose-200/90">
            • <strong>Hackers/Cheaters</strong> ko turant block kiya jayega aur prize forfeit hoga.<br />
            • <strong>Emulator (PC/Laptops)</strong> allow nahi hai (Mobile Only Match).
          </p>
        </div>

        {/* 🎮 How to Join in Free Fire step-by-step */}
        <div className="p-3 bg-[#131720] border border-[#263042] rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-white">
            <Gamepad2 className="w-4 h-4 text-[#FF5722]" />
            <span>HOW TO JOIN IN FREE FIRE:</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1E2536] text-[#00FF66] font-black text-[10px] flex items-center justify-center shrink-0">1</span>
              <span>Open <strong>Free Fire / FF MAX</strong> and tap Mode Selection (bottom right).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1E2536] text-[#00FF66] font-black text-[10px] flex items-center justify-center shrink-0">2</span>
              <span>Tap <strong>Custom</strong> at the bottom of the screen.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1E2536] text-[#00FF66] font-black text-[10px] flex items-center justify-center shrink-0">3</span>
              <span>Tap Search on bottom left, paste <strong>Room ID</strong> and enter <strong>Password</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1E2536] text-[#00FF66] font-black text-[10px] flex items-center justify-center shrink-0">4</span>
              <span><strong>Slot:</strong> Kisi bhi available slot par baith jayein (App ka slot follow karna zaroori nahi hai).</span>
            </div>
          </div>
        </div>

        {/* Room Participants Roster */}
        <div className="p-3.5 bg-[#131720] border border-[#263042] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-white">
              <Users className="w-4 h-4 text-[#38BDF8]" />
              <span>ROOM PLAYERS ({match.participants.length}/{match.maxSlots})</span>
            </div>
            <span className="text-[10px] text-slate-400">Level 40+ Verified</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {match.participants.map((p, idx) => {
              const isCurrentUser = p.uid === userProfile.uid;
              return (
                <div
                  key={p.uid}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                    isCurrentUser
                      ? 'bg-[#00FF66]/10 border-[#00FF66]/40 text-white font-bold'
                      : 'bg-[#090C12] border-[#1E2536] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1E2536] text-[#00FF66] font-black text-[10px] flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{p.ign}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] bg-[#00FF66] text-black px-1.5 py-0.2 rounded font-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        UID: {p.uid}
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#00FF66] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Copy Toast */}
      {toastMsg && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#131720] border border-[#00FF66] text-white text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
