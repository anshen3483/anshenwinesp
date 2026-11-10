export interface PlayerParticipant {
  ign: string;
  uid: string;
  slotNumber: number;
  joinedAt: string;
  rank?: number;
  kills?: number;
  winnings?: number;
}

export interface TournamentMatch {
  id: string;
  matchNumber: number;
  title: string;
  gameMode: 'Battle Ground' | 'Clash Squad' | 'Survival';
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra';
  matchTime: string;
  entryFee: number; // ₹20
  prizePool: number;
  booyahPrize: number; // ₹50 for Booyah (1st Rank)
  perKill: number; // ₹18 per kill
  maxSlots: number;
  participants: PlayerParticipant[];
  roomId?: string;
  roomPassword?: string;
  isRoomReleased: boolean;
  roomReleasedAt?: number; // Timestamp (ms) when Admin released the Room ID & Password
  status: 'Upcoming' | 'Ongoing' | 'Results';
  matchType?: string; // 'Solo'
  version?: string; // 'TPP'
  winnerIgn?: string;
  winnerKills?: number;
  winnerPrize?: number;
  resultsDeclaredAt?: string;
  isLive?: boolean;
  liveStreamUrl?: string;
  liveViewerCount?: number;
  prizeBreakdown?: { rank: string; prize: number }[];
}

export interface WalletTransaction {
  id: string;
  type: 'entry_fee' | 'winning' | 'deposit' | 'withdrawal' | 'referral';
  title: string;
  description: string;
  amount: number; // negative for deductions (e.g. -20, -100), positive for additions (e.g. +50, +100)
  date: string;
  balanceAfter: number;
  matchId?: string;
  orderId?: string;
  payoutUpi?: string;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface TournamentHistoryItem {
  id: string;
  matchId: string;
  matchNumber: number;
  matchTitle: string;
  gameMode: string;
  map: string;
  date: string;
  slotNumber: number;
  rank?: number;
  kills?: number;
  entryFee: number;
  winnings: number;
  status: 'Joined' | 'Ongoing' | 'Completed';
  isBooyah: boolean;
}

export interface SuspiciousActivityLog {
  id: string;
  timestamp: string;
  playerIgn: string;
  playerUid: string;
  activityType: 'rapid_join' | 'multiple_devices' | 'emulator_detected' | 'uid_mismatch' | 'macro_clicks';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  actionTaken: 'Blocked' | 'Flagged' | 'Under Review';
  deviceDetails: string;
  ipAddress: string;
}

export interface LeaderboardPlayer {
  rank: number;
  ign: string;
  uid: string;
  totalEarnings: number;
  matchesPlayed: number;
  booyahs: number;
  totalKills: number;
  winRate: number;
  badge?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  matchId?: string;
  matchTitle?: string;
  roomId?: string;
  roomPassword?: string;
  timestamp: string;
  isRead: boolean;
  type: 'room_released' | 'match_result' | 'wallet_credit' | 'system';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Rules & Entry' | 'Room & Timings' | 'Wallet & Payouts' | 'Anti-Cheat';
}

export interface ReferralRecord {
  id: string;
  friendIgn: string;
  friendUid: string;
  registeredAt: string;
  status: 'pending_deposit' | 'deposit_completed';
  depositAmount?: number;
  rewardAmount: number; // ₹5
  rewardedAt?: string;
}

export interface UserProfile {
  name: string;
  ign: string;
  uid: string;
  email?: string;
  phone?: string;
  upiId?: string;
  walletBalance: number;
  totalKills: number;
  matchesPlayed: number;
  matchesWon: number;
  referralCode?: string;
  totalReferrals?: number;
  referralEarnings?: number;
  referrals?: ReferralRecord[];
  transactions: WalletTransaction[];
}
