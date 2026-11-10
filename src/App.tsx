import React, { useState } from 'react';
import { INITIAL_MATCHES, INITIAL_USER_PROFILE, INITIAL_LEADERBOARD } from './data/mockMatches';
import { TournamentMatch, UserProfile, LeaderboardPlayer, WalletTransaction, PushNotification, ReferralRecord } from './types';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { JoinMatchModal } from './components/JoinMatchModal';
import { ProfileModal } from './components/ProfileModal';
import { RulesModal } from './components/RulesModal';
import { FAQModal } from './components/FAQModal';
import { SupportModal } from './components/SupportModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState<TournamentMatch[]>(INITIAL_MATCHES);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<LeaderboardPlayer[]>(INITIAL_LEADERBOARD);

  // Modals state
  const [joinModalMatch, setJoinModalMatch] = useState<TournamentMatch | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Push Notification System State
  const [activePushNotification, setActivePushNotification] = useState<PushNotification | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<PushNotification[]>([]);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Active joined match room screen navigation
  const [activeMatchRoomId, setActiveMatchRoomId] = useState<string | null>(null);

  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3000);
  };

  const handleLogin = (_email: string) => {
    setIsLoggedIn(true);
    showToast(`Welcome back, ${userProfile.name}! Logged in as ${userProfile.ign}`);
  };

  const handleSignUp = (newUser: UserProfile) => {
    setUserProfile(newUser);
    setIsLoggedIn(true);
    showToast(`Account created for ${newUser.name}! Welcome bonus added.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Logged out of AnshenWin.');
  };

  // Join match handler with automatic WalletTransaction deduction logging
  const handleConfirmJoin = (matchId: string, ign: string, uid: string) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const newSlot = m.participants.length + 1;
          const updatedParticipants = [
            ...m.participants,
            {
              ign,
              uid,
              slotNumber: newSlot,
              joinedAt: new Date().toISOString(),
            },
          ];
          return {
            ...m,
            participants: updatedParticipants,
          };
        }
        return m;
      })
    );

    // Deduct entry fee & log transaction for financial transparency
    if (targetMatch.entryFee > 0) {
      setUserProfile((prev) => {
        const newBalance = Math.max(0, prev.walletBalance - targetMatch.entryFee);
        const deductionTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'entry_fee',
          title: `Entry Fee: Match #${targetMatch.matchNumber}`,
          description: `Entry fee deducted for ${targetMatch.title}`,
          amount: -targetMatch.entryFee,
          date: 'Just now',
          balanceAfter: newBalance,
          matchId: targetMatch.id,
        };

        return {
          ...prev,
          walletBalance: newBalance,
          ign,
          uid,
          matchesPlayed: prev.matchesPlayed + 1,
          transactions: [deductionTx, ...(prev.transactions || [])],
        };
      });
    } else {
      setUserProfile((prev) => ({
        ...prev,
        ign,
        uid,
      }));
    }

    setJoinModalMatch(null);
    setActiveMatchRoomId(matchId);
    showToast(`Registered for ${targetMatch.title}! Room credentials will be unlocked before match.`);
  };

  const handleTapPushNotification = (matchId: string) => {
    setActivePushNotification(null);
    setActiveMatchRoomId(matchId);
    showToast('Opened Match Room from Push Notification!');
  };



  // Add demo funds with automatic transaction recording
  const handleAddFunds = (amount: number) => {
    setUserProfile((prev) => {
      const newBalance = prev.walletBalance + amount;
      const depositTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        title: 'Wallet Deposit',
        description: `Recharged ₹${amount} demo test credits`,
        amount: amount,
        date: 'Just now',
        balanceAfter: newBalance,
      };

      return {
        ...prev,
        walletBalance: newBalance,
        transactions: [depositTx, ...(prev.transactions || [])],
      };
    });
    showToast(`Added ₹${amount} to player wallet! Transaction recorded.`);
  };

  // Cashfree Payment Gateway simulated success handler
  const handleCashfreeRechargeSuccess = (amount: number, orderId: string) => {
    setUserProfile((prev) => {
      const newBalance = prev.walletBalance + amount;
      const cfTx: WalletTransaction = {
        id: `tx-cf-${Date.now()}`,
        type: 'deposit',
        title: 'Cashfree PG Top-Up',
        description: `Instant wallet recharge via Cashfree UPI (Order: ${orderId})`,
        amount: amount,
        orderId: orderId,
        date: 'Just now',
        balanceAfter: newBalance,
      };

      return {
        ...prev,
        walletBalance: newBalance,
        transactions: [cfTx, ...(prev.transactions || [])],
      };
    });
    showToast(`🎉 ₹${amount} successfully added via Cashfree Payment Gateway!`);
  };

  // Refer & Earn: 1. Friend signs up with referral code (STATUS: Pending 1st Deposit - ₹0 credited yet!)
  const handleRegisterReferralFriend = (friendIgn: string, friendUid: string) => {
    const newReferral: ReferralRecord = {
      id: `ref-${Date.now()}`,
      friendIgn,
      friendUid,
      registeredAt: 'Just now',
      status: 'pending_deposit',
      rewardAmount: 5,
    };

    setUserProfile((prev) => ({
      ...prev,
      totalReferrals: (prev.totalReferrals || 0) + 1,
      referrals: [newReferral, ...(prev.referrals || [])],
    }));

    showToast(`Friend "${friendIgn}" joined! Status: ⏳ Waiting for 1st Deposit (₹5 unlocks after 1st deposit).`);
  };

  // Refer & Earn: 2. Friend completes their FIRST DEPOSIT -> ₹5 is UNLOCKED and added to referrer's wallet!
  const handleFriendFirstDeposit = (referralId: string, depositAmount: number = 100) => {
    let rewardedIgn = 'Friend';
    setUserProfile((prev) => {
      const existingRefs = prev.referrals || [];
      const targetRef = existingRefs.find((r) => r.id === referralId);
      if (!targetRef || targetRef.status === 'deposit_completed') return prev;

      rewardedIgn = targetRef.friendIgn;
      const newBalance = prev.walletBalance + 5;
      const refTx: WalletTransaction = {
        id: `tx-ref-${Date.now()}`,
        type: 'referral',
        title: 'Referral Bonus: +₹5 (1st Deposit Unlocked)',
        description: `Friend "${targetRef.friendIgn}" completed 1st Deposit of ₹${depositAmount}! Your ₹5 bonus is credited.`,
        amount: 5,
        date: 'Just now',
        balanceAfter: newBalance,
      };

      const updatedRefs = existingRefs.map((r) =>
        r.id === referralId
          ? {
              ...r,
              status: 'deposit_completed' as const,
              depositAmount,
              rewardedAt: 'Just now',
            }
          : r
      );

      return {
        ...prev,
        walletBalance: newBalance,
        referralEarnings: (prev.referralEarnings || 0) + 5,
        referrals: updatedRefs,
        transactions: [refTx, ...(prev.transactions || [])],
      };
    });

    showToast(`🎉 ₹5 Referral Bonus credited! Friend "${rewardedIgn}" completed their 1st Deposit.`);
  };

  // Fallback direct claim
  const handleClaimReferralReward = (amount: number, friendIgn: string) => {
    handleRegisterReferralFriend(friendIgn, `${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  };

  // Instant UPI Withdrawal handler
  const handleWithdrawFunds = (amount: number, upiId: string) => {
    if (userProfile.walletBalance < amount) {
      showToast('Insufficient wallet balance for withdrawal!');
      return;
    }
    setUserProfile((prev) => {
      const newBalance = prev.walletBalance - amount;
      const withdrawTx: WalletTransaction = {
        id: `tx-wd-${Date.now()}`,
        type: 'withdrawal',
        title: 'Wallet Withdrawal',
        description: `Instant payout transfer to UPI: ${upiId}`,
        amount: -amount,
        payoutUpi: upiId,
        date: 'Just now',
        balanceAfter: newBalance,
        status: 'SUCCESS',
      };

      return {
        ...prev,
        walletBalance: newBalance,
        upiId,
        transactions: [withdrawTx, ...(prev.transactions || [])],
      };
    });
    showToast(`💸 ₹${amount} withdrawal processed to ${upiId}!`);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated,
    }));
    showToast('Profile updated!');
  };



  return (
    <div className="h-[100dvh] w-full bg-[#04060A] text-slate-100 flex justify-center overflow-hidden font-sans relative">
      <main className="w-full max-w-[430px] h-[100dvh] flex flex-col overflow-hidden relative">
        <MobileAppSimulator
          matches={matches}
          userProfile={userProfile}
          leaderboardPlayers={leaderboardPlayers}
          isLoggedIn={isLoggedIn}
          activeMatchRoomId={activeMatchRoomId}
          activePushNotification={activePushNotification}
          notificationHistory={notificationHistory}
          onDismissPushNotification={() => setActivePushNotification(null)}
          onTapPushNotification={handleTapPushNotification}
          onSelectMatchRoom={setActiveMatchRoomId}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onLogout={handleLogout}
          onOpenJoinDialog={(match) => setJoinModalMatch(match)}
          onOpenProfileDialog={() => setIsProfileOpen(true)}
          onOpenRulesDialog={() => setIsRulesOpen(true)}
          onOpenFaqDialog={() => setIsFaqOpen(true)}
          onOpenSupportDialog={() => setIsSupportOpen(true)}
          onClaimReferralReward={handleClaimReferralReward}
          onRegisterReferralFriend={handleRegisterReferralFriend}
          onFriendFirstDeposit={handleFriendFirstDeposit}
        />

        {/* Toast Notification Scoped Inside the Mobile Website Area */}
        {globalToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[400px] z-50 flex items-center gap-2.5 px-4 py-3 bg-[#131720] border border-[#00FF66] rounded-2xl shadow-2xl text-xs font-bold text-white animate-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
            <span className="truncate">{globalToast}</span>
          </div>
        )}
      </main>



      {/* Mobile-Width Pop-up Sheets */}
      {isRulesOpen && (
        <RulesModal onClose={() => setIsRulesOpen(false)} />
      )}

      {isFaqOpen && (
        <FAQModal onClose={() => setIsFaqOpen(false)} />
      )}

      {joinModalMatch && (
        <JoinMatchModal
          match={joinModalMatch}
          userProfile={userProfile}
          onClose={() => setJoinModalMatch(null)}
          onConfirmJoin={handleConfirmJoin}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          userProfile={userProfile}
          matches={matches}
          onClose={() => setIsProfileOpen(false)}
          onUpdateProfile={handleUpdateProfile}
          onAddFunds={handleAddFunds}
          onWithdrawFunds={handleWithdrawFunds}
          onLogout={handleLogout}
          onOpenRulesModal={() => {
            setIsProfileOpen(false);
            setIsRulesOpen(true);
          }}
          onOpenFaqModal={() => {
            setIsProfileOpen(false);
            setIsFaqOpen(true);
          }}
        />
      )}

      {isSupportOpen && (
        <SupportModal
          onClose={() => setIsSupportOpen(false)}
          userIgn={userProfile.ign}
          userUid={userProfile.uid}
        />
      )}
    </div>
  );
}
