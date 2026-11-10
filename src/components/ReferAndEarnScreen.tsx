import React, { useState } from 'react';
import { UserProfile, ReferralRecord } from '../types';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  IndianRupee, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  UserPlus,
  Coins
} from 'lucide-react';

interface ReferAndEarnScreenProps {
  userProfile: UserProfile;
  onClaimReferralReward?: (amount: number, friendIgn: string) => void;
  onRegisterReferralFriend?: (friendIgn: string, friendUid: string) => void;
  onFriendFirstDeposit?: (referralId: string, depositAmount: number) => void;
}

export const ReferAndEarnScreen: React.FC<ReferAndEarnScreenProps> = ({
  userProfile,
  onClaimReferralReward,
  onRegisterReferralFriend,
  onFriendFirstDeposit,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const referralCode = userProfile.referralCode || 'ANSHEN77';
  const referrals = userProfile.referrals || [];

  const pendingReferrals = referrals.filter((r) => r.status === 'pending_deposit');
  const completedReferrals = referrals.filter((r) => r.status === 'deposit_completed');
  
  const totalEarned = completedReferrals.reduce((sum, r) => sum + r.rewardAmount, 0) + (userProfile.referralEarnings && referrals.length === 0 ? userProfile.referralEarnings : 0);
  const totalInvited = referrals.length > 0 ? referrals.length : (userProfile.totalReferrals || 0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = () => {
    const shareText = `🔥 Join AnshenWin Free Fire Custom Room Solo Tournaments! Use my Referral Code ${referralCode} to sign up. Make your 1st deposit to unlock cash rewards! Real cash Free Fire matches with ₹18 per kill!`;
    if (navigator.share) {
      navigator.share({
        title: 'AnshenWin Free Fire Tournaments',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Step 1: Friend signs up using referral code -> Status is PENDING 1st DEPOSIT (No ₹5 yet!)
  const handleRegisterFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const ign = friendNameInput.trim() || `FF_PRO_${Math.floor(1000 + Math.random() * 9000)}`;
    const randomUid = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    if (onRegisterReferralFriend) {
      onRegisterReferralFriend(ign, randomUid);
    } else if (onClaimReferralReward) {
      // Fallback
      onClaimReferralReward(5, ign);
    }

    setStatusMessage({
      text: `Friend "${ign}" joined with code ${referralCode}! Status: ⏳ Waiting for 1st Deposit. (₹5 will unlock when they make 1st deposit)`,
      type: 'info',
    });
    setFriendNameInput('');
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Step 2: Friend makes 1st deposit -> ₹5 is UNLOCKED and credited to referrer!
  const handleTriggerFirstDeposit = (referralId: string, friendIgn: string) => {
    if (onFriendFirstDeposit) {
      onFriendFirstDeposit(referralId, 100);
    } else if (onClaimReferralReward) {
      onClaimReferralReward(5, friendIgn);
    }

    setStatusMessage({
      text: `🎉 Friend "${friendIgn}" completed 1st Deposit of ₹100! ₹5 Referral Cash is now credited to your wallet.`,
      type: 'success',
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const filteredList = referrals.filter((r) => {
    if (selectedFilter === 'pending') return r.status === 'pending_deposit';
    if (selectedFilter === 'completed') return r.status === 'deposit_completed';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#0B0E14] text-slate-100 flex flex-col p-4 space-y-4 pb-20 no-scrollbar">
      {/* Hero Banner with Free Fire Theme & Rule Highlight */}
      <div className="p-4 bg-gradient-to-br from-[#1C160F] via-[#10151E] to-[#0D1B13] border border-[#FF6600]/30 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[#FF6600]/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-[#FF6600]/20 text-[#FFAA00] border border-[#FF6600]/30">
              <Gift className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFAA00]">
              Free Fire Refer & Earn
            </span>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            ₹5 Per First Deposit
          </span>
        </div>

        <h2 className="text-base font-black text-white leading-snug">
          Invite Friends & Earn <span className="text-[#00FF66]">₹5 Cash</span>!
        </h2>

        {/* CRITICAL RULE CALLOUT (As requested by user) */}
        <div className="mt-2.5 p-2.5 bg-[#080B10]/90 border border-amber-500/40 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-black text-amber-300">Important Rule: </span>
            <span className="text-slate-200">
              Aapke friend ke signup karte hi refer pending me rahega. <strong>Jab friend apna FIRST DEPOSIT karega tabhi aapko ₹5 milenge!</strong>
            </span>
          </div>
        </div>

        {/* 4-Step Visual Timeline */}
        <div className="grid grid-cols-4 gap-1 mt-3 pt-3 border-t border-[#1E2536] text-center">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-[#18202F] text-slate-300 border border-[#2D3B55] flex items-center justify-center text-[10px] font-black">
              1
            </div>
            <span className="text-[8px] text-slate-400 mt-1 font-bold">Share Code</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-[#18202F] text-slate-300 border border-[#2D3B55] flex items-center justify-center text-[10px] font-black">
              2
            </div>
            <span className="text-[8px] text-slate-400 mt-1 font-bold">Friend Joins</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[10px] font-black animate-pulse">
              3
            </div>
            <span className="text-[8px] text-amber-400 mt-1 font-bold">1st Deposit</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50 flex items-center justify-center text-[10px] font-black">
              ₹
            </div>
            <span className="text-[8px] text-[#00FF66] mt-1 font-bold">You Get ₹5!</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-[#1E2536]">
          <div className="bg-[#0A0D14]/90 p-2 rounded-xl border border-[#263042] text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Total Invited</p>
            <p className="text-sm font-black text-white mt-0.5">{totalInvited}</p>
          </div>
          <div className="bg-[#0A0D14]/90 p-2 rounded-xl border border-[#263042] text-center">
            <p className="text-[9px] text-amber-400 font-bold uppercase">⏳ Pending Dep.</p>
            <p className="text-sm font-black text-amber-400 mt-0.5">{pendingReferrals.length}</p>
          </div>
          <div className="bg-[#0A0D14]/90 p-2 rounded-xl border border-[#00FF66]/30 text-center">
            <p className="text-[9px] text-[#00FF66] font-bold uppercase">Cash Earned</p>
            <p className="text-sm font-black text-[#00FF66] mt-0.5">₹{totalEarned}</p>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="p-3.5 bg-[#0E121A] border border-[#1E2536] rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Your Free Fire Referral Code</span>
          <span className="text-[9px] text-[#00FF66] font-bold bg-[#00FF66]/10 px-2 py-0.5 rounded-full border border-[#00FF66]/30">
            Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-[#080A0E] border-2 border-dashed border-[#FF6600]/40 rounded-xl font-mono text-sm font-black text-[#FFAA00] tracking-widest text-center">
            {referralCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-2 bg-[#1E2536] hover:bg-[#263042] text-white border border-[#334155] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00FF66]" />
                <span className="text-[#00FF66]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-[#00FF66] hover:from-emerald-600 hover:to-[#00FF66]/90 active:scale-95 text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#00FF66]/20 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>SHARE VIA WHATSAPP / FF SQUAD</span>
        </button>
      </div>

      {/* Notice Message Banner */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : statusMessage.type === 'info'
              ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
              : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Interactive Testing Simulation Console: Step 1 (Join) & Step 2 (Deposit) */}
      <div className="p-3.5 bg-[#121622] border border-[#232F46] rounded-2xl space-y-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black text-white">
            Interactive Test: 1st Deposit Referral Flow
          </h3>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Test the exact 2-step condition: First add a friend (pending), then simulate their 1st deposit to unlock ₹5 into your wallet!
        </p>

        {/* Step 1 Input: Add friend with code */}
        <form onSubmit={handleRegisterFriend} className="flex gap-2">
          <input
            type="text"
            value={friendNameInput}
            onChange={(e) => setFriendNameInput(e.target.value)}
            placeholder="Enter Friend IGN (e.g. FF_AYUSH)"
            className="flex-1 px-3 py-1.5 text-xs bg-[#0A0D14] border border-[#2A374F] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#1E2536] hover:bg-[#283348] border border-[#3A4B69] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer whitespace-nowrap active:scale-95 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-sky-400" />
            <span>1. Register Friend</span>
          </button>
        </form>

        {/* Pending Referrals Quick Trigger List */}
        {pendingReferrals.length > 0 && (
          <div className="pt-2 border-t border-[#1C2538] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
              <span>Friends waiting for 1st Deposit ({pendingReferrals.length}):</span>
              <span className="text-[9px] text-slate-400">Click button to trigger 1st deposit</span>
            </div>
            {pendingReferrals.map((friend) => (
              <div
                key={friend.id}
                className="p-2 bg-[#0A0D14] border border-amber-500/30 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white truncate">{friend.friendIgn}</span>
                    <span className="text-[9px] font-mono text-slate-400">UID: {friend.friendUid}</span>
                  </div>
                  <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>₹5 Locked · Waiting 1st deposit</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTriggerFirstDeposit(friend.id, friend.friendIgn)}
                  className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-[#00FF66] text-black font-black text-[10px] rounded-lg shadow-sm active:scale-95 cursor-pointer shrink-0 transition-transform flex items-center gap-1"
                >
                  <Coins className="w-3 h-3 text-black" />
                  <span>2. Deposit ₹100 & Unlock ₹5</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referrals Activity List */}
      <div className="p-3.5 bg-[#0E121A] border border-[#1E2536] rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Referred Friends Passbook ({referrals.length})
            </h4>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center bg-[#131720] border border-[#202A3C] p-0.5 rounded-lg text-[9px] font-bold">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                selectedFilter === 'all' ? 'bg-[#00FF66] text-black' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('pending')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                selectedFilter === 'pending' ? 'bg-amber-500 text-black' : 'text-slate-400'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedFilter('completed')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                selectedFilter === 'completed' ? 'bg-[#00FF66] text-black' : 'text-slate-400'
              }`}
            >
              Rewarded
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs bg-[#090C12] rounded-xl border border-[#1A2230]">
            <p className="font-semibold text-slate-300">No referrals in this view</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Share your code {referralCode} with Free Fire players or use the test simulator above!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredList.map((ref) => {
              const isCompleted = ref.status === 'deposit_completed';
              return (
                <div
                  key={ref.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isCompleted
                      ? 'bg-[#0F1813] border-emerald-500/40'
                      : 'bg-[#15130F] border-amber-500/30'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white truncate">{ref.friendIgn}</span>
                      <span className="text-[9px] font-mono text-slate-400">UID: {ref.friendUid}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-400">
                      <span>Joined {ref.registeredAt}</span>
                      {isCompleted && ref.depositAmount && (
                        <span>• 1st Dep: ₹{ref.depositAmount}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isCompleted ? (
                      <div>
                        <span className="text-xs font-black text-[#00FF66]">+₹{ref.rewardAmount}</span>
                        <div className="text-[9px] font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span>1st Deposit Done</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-black text-amber-400">₹{ref.rewardAmount} Locked</span>
                        <div className="text-[9px] font-bold text-amber-400 flex items-center justify-end gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Pending 1st Dep.</span>
                        </div>
                      </div>
                    )}
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
