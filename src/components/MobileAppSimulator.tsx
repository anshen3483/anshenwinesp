import React, { useState, useEffect } from 'react';
import { TournamentMatch, UserProfile, LeaderboardPlayer, PushNotification } from '../types';
import { AuthScreen } from './AuthScreen';
import { MatchRoomDetailsScreen } from './MatchRoomDetailsScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { ReferAndEarnScreen } from './ReferAndEarnScreen';
import { TournamentHistoryScreen } from './TournamentHistoryScreen';
import { CredentialCopyCard } from './CredentialCopyCard';
import { FreeFireLogo, FreeFireMatchCardBadge, FreeFireBooyahBadge } from './FreeFireLogo';
import { AnshenWinLogo } from './AnshenWinLogo';
import { 
  Key, 
  MapPin, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Flame, 
  Wifi, 
  BatteryMedium, 
  Signal, 
  ShieldCheck, 
  Zap, 
  Target,
  BookOpen, 
  User, 
  Coins, 
  Gamepad2, 
  Gift, 
  Smartphone, 
  HelpCircle, 
  Bell, 
  X, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  History, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  ExternalLink, 
  Crown, 
  Medal, 
  Award, 
  Download 
} from 'lucide-react';

interface MobileAppSimulatorProps {
  matches: TournamentMatch[];
  userProfile: UserProfile;
  leaderboardPlayers: LeaderboardPlayer[];
  isLoggedIn: boolean;
  activeMatchRoomId?: string | null;
  activePushNotification?: PushNotification | null;
  notificationHistory?: PushNotification[];
  onDismissPushNotification?: () => void;
  onTapPushNotification?: (matchId: string) => void;
  onSelectMatchRoom?: (matchId: string | null) => void;
  onLogin: (email: string) => void;
  onSignUp: (newUser: UserProfile) => void;
  onLogout: () => void;
  onOpenJoinDialog: (match: TournamentMatch) => void;
  onOpenProfileDialog: () => void;
  onOpenRulesDialog?: () => void;
  onOpenFaqDialog?: () => void;
  onOpenSupportDialog?: () => void;
  onClaimReferralReward?: (amount: number, friendIgn: string) => void;
  onRegisterReferralFriend?: (friendIgn: string, friendUid: string) => void;
  onFriendFirstDeposit?: (referralId: string, depositAmount: number) => void;
}

export const OFFICIAL_YOUTUBE_URL = 'https://youtube.com/@anshengaming?si=RAs1KAfYdrOXxeyL';

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  matches,
  userProfile,
  leaderboardPlayers,
  isLoggedIn,
  activeMatchRoomId: externalActiveRoomId,
  activePushNotification,
  notificationHistory = [],
  onDismissPushNotification,
  onTapPushNotification,
  onSelectMatchRoom,
  onLogin,
  onSignUp,
  onLogout,
  onOpenJoinDialog,
  onOpenProfileDialog,
  onOpenRulesDialog,
  onOpenFaqDialog,
  onOpenSupportDialog,
  onClaimReferralReward,
  onRegisterReferralFriend,
  onFriendFirstDeposit,
}) => {
  // Internal state fallback for active match room
  const [internalActiveRoomId, setInternalActiveRoomId] = useState<string | null>(null);
  const activeRoomId = externalActiveRoomId !== undefined ? externalActiveRoomId : internalActiveRoomId;

  const setActiveRoomId = (id: string | null) => {
    if (onSelectMatchRoom) {
      onSelectMatchRoom(id);
    } else {
      setInternalActiveRoomId(id);
    }
  };

  // Bottom Navigation Bar tabs: 'matches' | 'history' | 'leaderboard' | 'refer'
  const [activeNavTab, setActiveNavTab] = useState<'matches' | 'history' | 'leaderboard' | 'refer'>('matches');

  // Status Tabs for Tournaments: UPCOMING | ONGOING | RESULTS
  const [statusTab, setStatusTab] = useState<'Upcoming' | 'Ongoing' | 'Results'>('Upcoming');

  // 🔍 ENHANCED MATCH FILTERS
  const [selectedGameMode, setSelectedGameMode] = useState<'All' | 'Survival' | 'Clash Squad' | 'Battle Ground'>('All');
  const [selectedMap, setSelectedMap] = useState<'All' | 'Bermuda' | 'Purgatory' | 'Kalahari'>('All');
  const [selectedFee, setSelectedFee] = useState<'All' | '35' | '50' | '20'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Expanded prize charts for individual matches
  const [expandedPrizeMatchId, setExpandedPrizeMatchId] = useState<string | null>(null);

  // Notification Drawer open/close state
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Active filter count for badge indicator
  const activeFilterCount = 
    (selectedGameMode !== 'All' ? 1 : 0) +
    (selectedMap !== 'All' ? 1 : 0) +
    (selectedFee !== 'All' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSelectedGameMode('All');
    setSelectedMap('All');
    setSelectedFee('All');
    setSearchQuery('');
    showToast('Filters reset to default.');
  };

  // Filter matches based on statusTab and multiple criteria
  const filteredMatches = matches.filter((m) => {
    if (m.status !== statusTab) return false;
    if (selectedGameMode !== 'All' && m.gameMode !== selectedGameMode) return false;
    if (selectedMap !== 'All' && m.map !== selectedMap) return false;
    if (selectedFee !== 'All' && m.entryFee.toString() !== selectedFee) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.title} ${m.map} ${m.gameMode} ${m.winnerIgn || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="relative w-full max-w-[430px] h-[100dvh] mx-auto bg-[#080B11] sm:border-x sm:border-[#1A2232] sm:shadow-[0_0_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col font-sans select-none">
      {/* 🔔 FLOATING TOP PUSH NOTIFICATION BANNER */}
      {activePushNotification && (
        <div className="absolute top-3 left-3 right-3 z-50 pt-safe animate-in slide-in-from-top duration-300">
          <div 
            onClick={() => {
              if (activePushNotification.matchId && onTapPushNotification) {
                onTapPushNotification(activePushNotification.matchId);
              }
            }}
            className="p-3 bg-gradient-to-r from-[#172033] via-[#1A253A] to-[#121B2A] border-2 border-[#00FF66] rounded-2xl shadow-2xl shadow-emerald-950/60 flex items-start gap-3 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="p-2 rounded-xl bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 shrink-0">
              <Key className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black text-[#00FF66] tracking-wider uppercase flex items-center gap-1">
                  <span>ROOM RELEASED</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{activePushNotification.timestamp}</span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5 truncate">{activePushNotification.title}</p>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-tight">
                {activePushNotification.body}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#00FF66] text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span>ENTER ROOM NOW</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] text-amber-300 font-mono">5 Min Timer Started!</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDismissPushNotification) onDismissPushNotification();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Content View */}
      {!isLoggedIn ? (
        <AuthScreen onLogin={onLogin} onSignUp={onSignUp} />
      ) : activeRoomId ? (
        <MatchRoomDetailsScreen
          match={matches.find((m) => m.id === activeRoomId) || matches[0]}
          userProfile={userProfile}
          onBack={() => setActiveRoomId(null)}
        />
      ) : (
        <>
          {/* Main Mobile Top AppBar (Safe-Area Aware & >=40px Touch Hitboxes) */}
          <header className="px-3.5 py-2 pt-safe min-h-[56px] bg-[#0C1017]/95 backdrop-blur-md border-b border-[#1A2232] flex items-center justify-between shrink-0 z-30">
            {/* Title / Brand */}
            <div className="flex items-center gap-1.5">
              <AnshenWinLogo size="sm" showSubtitle={true} subtitleText="FREE FIRE" />
            </div>

            {/* Right Touch-Friendly Quick Actions */}
            <div className="flex items-center gap-1.5">
              {/* WhatsApp Support Button */}
              {onOpenSupportDialog && (
                <button
                  onClick={onOpenSupportDialog}
                  className="min-h-[38px] px-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 border border-emerald-500/35 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center gap-1 transition-all cursor-pointer"
                  title="WhatsApp & Email Support: 9569167476"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span className="hidden xs:inline">Help</span>
                </button>
              )}

              {/* Notification Bell */}
              <button
                onClick={() => setIsNotifDrawerOpen((prev) => !prev)}
                className="relative min-h-[38px] min-w-[38px] flex items-center justify-center bg-[#131720] hover:bg-[#1E2536] active:scale-95 border border-[#263042] rounded-xl text-slate-300 transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {notificationHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FF66] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {notificationHistory.length}
                  </span>
                )}
              </button>

              {/* Wallet Balance Pill -> Touch Card */}
              <button
                onClick={onOpenProfileDialog}
                className="min-h-[38px] flex items-center gap-1.5 px-2.5 bg-[#131720] hover:bg-[#1E2536] active:scale-95 border border-[#2E384D] rounded-xl transition-all cursor-pointer shadow-sm"
                title="Wallet Balance & Passbook"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-black text-white">{userProfile.walletBalance}</span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00FF66] to-[#009944] text-black font-extrabold text-[10px] flex items-center justify-center ml-0.5">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              </button>
            </div>
          </header>

          {/* VIEW TAB 1: TOURNAMENT MATCHES LIST */}
          {activeNavTab === 'matches' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* 🏆 CLEAN 3-STATUS TABS: UPCOMING | ONGOING | RESULTS */}
              <div className="bg-[#0E121A] border-b border-[#1E2536] px-2 shrink-0">
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => setStatusTab('Upcoming')}
                    className={`flex-1 py-2 text-xs font-black tracking-wider uppercase transition-all relative text-center cursor-pointer ${
                      statusTab === 'Upcoming'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>UPCOMING</span>
                    {statusTab === 'Upcoming' && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-amber-400 to-[#FF5722] rounded-full"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setStatusTab('Ongoing')}
                    className={`flex-1 py-2 text-xs font-black tracking-wider uppercase transition-all relative text-center cursor-pointer ${
                      statusTab === 'Ongoing'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <span>ONGOING</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    </span>
                    {statusTab === 'Ongoing' && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-[#FF5722] to-rose-500 rounded-full"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setStatusTab('Results')}
                    className={`flex-1 py-2 text-xs font-black tracking-wider uppercase transition-all relative text-center cursor-pointer ${
                      statusTab === 'Results'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>RESULTS</span>
                    {statusTab === 'Results' && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-[#00FF66] to-[#00CC55] rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* 🔍 SEARCH & FILTER BAR */}
              <div className="px-3 py-1.5 bg-[#090C12] border-b border-[#1A2230] flex items-center gap-2 shrink-0">
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search match, map (Bermuda...)"
                    className="w-full pl-8 pr-3 py-1 bg-[#121622] border border-[#20293B] rounded-xl text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Drawer Toggle */}
                <button
                  onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                    activeFilterCount > 0
                      ? 'bg-[#00FF66]/15 border-[#00FF66]/50 text-[#00FF66]'
                      : 'bg-[#121622] border-[#20293B] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#00FF66] text-black font-black text-[9px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Expanded Filter Panel */}
              {isFilterDrawerOpen && (
                <div className="p-3 bg-[#0D121B] border-b border-[#1E2838] space-y-2 text-[10px] animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>Match Filters</span>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Mode Pills */}
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase text-[9px]">Mode:</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      {(['All', 'Survival', 'Clash Squad', 'Battle Ground'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSelectedGameMode(mode)}
                          className={`px-2 py-0.5 rounded-lg font-bold shrink-0 cursor-pointer ${
                            selectedGameMode === mode
                              ? 'bg-[#00FF66] text-black'
                              : 'bg-[#161D2B] text-slate-400 hover:text-white'
                          }`}
                        >
                          {mode === 'Survival' ? 'Survival 20P' : mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Map Pills */}
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase text-[9px]">Map:</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      {(['All', 'Bermuda', 'Purgatory', 'Kalahari'] as const).map((mapName) => (
                        <button
                          key={mapName}
                          onClick={() => setSelectedMap(mapName)}
                          className={`px-2 py-0.5 rounded-lg font-bold shrink-0 cursor-pointer ${
                            selectedMap === mapName
                              ? 'bg-[#00FF66] text-black'
                              : 'bg-[#161D2B] text-slate-400 hover:text-white'
                          }`}
                        >
                          {mapName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Entry Fee Pills */}
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase text-[9px]">Entry Fee:</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      {(['All', '35', '50', '20'] as const).map((fee) => (
                        <button
                          key={fee}
                          onClick={() => setSelectedFee(fee)}
                          className={`px-2 py-0.5 rounded-lg font-bold shrink-0 cursor-pointer ${
                            selectedFee === fee
                              ? 'bg-[#00FF66] text-black'
                              : 'bg-[#161D2B] text-slate-400 hover:text-white'
                          }`}
                        >
                          {fee === 'All' ? 'All Fees' : `₹${fee}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Category Pills Quick Bar */}
              {!isFilterDrawerOpen && (
                <div className="px-3 py-1.5 bg-[#0A0D14] border-b border-[#1A2230] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  {(['All', 'Survival', 'Clash Squad', 'Battle Ground'] as const).map((mode) => {
                    const isSelected = selectedGameMode === mode;
                    const label = mode === 'Survival' ? 'Survival 20P' : mode === 'Battle Ground' ? 'Full Map' : mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setSelectedGameMode(mode)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E2536] text-[#00FF66] border border-[#00FF66]/50 shadow-sm'
                            : 'bg-[#131720] text-slate-400 border border-[#263042] hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Match Cards List */}
              <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 pb-24 no-scrollbar">
                {filteredMatches.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No matches found in {statusTab}</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting filters or check other tabs</p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="mt-3 px-3 py-1 bg-[#1E2536] text-[#00FF66] rounded-xl text-xs font-bold"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredMatches.map((match) => {
                    const isJoined = match.participants.some((p) => p.uid === userProfile.uid);
                    const isFull = match.participants.length >= match.maxSlots;
                    const isPrizeExpanded = expandedPrizeMatchId === match.id;
                    const isResultsDeclared = match.status === 'Results';

                    // Find Winner Information
                    const winnerParticipant = match.participants.find((p) => p.rank === 1) || {
                      ign: match.winnerIgn || 'Champion_OP',
                      kills: match.winnerKills || 7,
                      winnings: match.winnerPrize || match.booyahPrize,
                    };

                    const winnerIgn = match.winnerIgn || winnerParticipant.ign || 'ANSHEN⚡777';
                    const winnerKills = match.winnerKills !== undefined ? match.winnerKills : (winnerParticipant.kills || 6);
                    const winnerPrize = match.winnerPrize !== undefined ? match.winnerPrize : (winnerParticipant.winnings || match.booyahPrize);

                    // User participation result
                    const userParticipant = match.participants.find((p) => p.uid === userProfile.uid);

                    {/* ========================================================== */}
                    {/* 🏆 DEDICATED WINNER CELEBRATION CARD FOR COMPLETED MATCHES */}
                    {/* ========================================================== */}
                    if (isResultsDeclared) {
                      return (
                        <div
                          key={match.id}
                          className="bg-gradient-to-b from-[#141A26] via-[#101520] to-[#0D1119] border-2 border-amber-500/60 rounded-3xl overflow-hidden shadow-2xl shadow-amber-950/30 transition-all relative"
                        >
                          {/* Glowing Ambient Halo */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/20 blur-xl pointer-events-none"></div>

                          {/* Celebration Header */}
                          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-950/60 via-[#1C160F] to-[#141A26] border-b border-amber-500/30 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
                              </span>
                              <div>
                                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                                  🏆 BOOYAH! WINNER CELEBRATION
                                </span>
                                <span className="text-xs font-bold text-white truncate block max-w-[170px]">
                                  {match.title}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {match.map} • {match.gameMode}
                            </span>
                          </div>

                          {/* Centerpiece: Booyah Winner Profile & Highlights */}
                          <div className="p-4 space-y-3 relative z-10">
                            <div className="flex items-center justify-between bg-[#0A0D14]/80 p-3 rounded-2xl border border-amber-500/30">
                              <div className="flex items-center gap-3">
                                {/* Golden Crown Champion Avatar */}
                                <div className="relative">
                                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-[#00FF66] p-0.5 shadow-lg shadow-amber-500/30">
                                    <div className="w-full h-full bg-[#0D121B] rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
                                      👑
                                    </div>
                                  </div>
                                  <span className="absolute -top-2 -right-1 text-xs">⭐</span>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                      BOOYAH CHAMPION
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-black text-white font-mono mt-0.5 tracking-wide">
                                    {winnerIgn}
                                  </h3>
                                  <p className="text-[10px] text-slate-400">
                                    {match.gameMode} Solo Champion
                                  </p>
                                </div>
                              </div>

                              {/* Cash Winnings Pill */}
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                  Total Winnings
                                </span>
                                <span className="text-base font-black text-[#00FF66] font-mono tracking-tight drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">
                                  +₹{winnerPrize}
                                </span>
                              </div>
                            </div>

                            {/* 3 Core Highlight Badges: Rank 1, Kills, and Total Prize */}
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                              <div className="p-2 bg-[#121824] rounded-xl border border-[#202C40]">
                                <span className="text-slate-400 text-[9px] uppercase block font-semibold">Rank</span>
                                <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Rank #1</span>
                                </span>
                              </div>

                              <div className="p-2 bg-[#121824] rounded-xl border border-[#202C40]">
                                <span className="text-slate-400 text-[9px] uppercase block font-semibold">Total Kills</span>
                                <span className="text-xs font-black text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                                  <Target className="w-3.5 h-3.5 text-sky-400" />
                                  <span>{winnerKills} Kills</span>
                                </span>
                              </div>

                              <div className="p-2 bg-gradient-to-b from-emerald-500/15 via-[#121824] to-transparent rounded-xl border border-[#00FF66]/30">
                                <span className="text-slate-400 text-[9px] uppercase block font-semibold">Cash Prize</span>
                                <span className="text-xs font-black text-[#00FF66] flex items-center justify-center gap-0.5 mt-0.5">
                                  <span>₹{winnerPrize} Cash</span>
                                </span>
                              </div>
                            </div>

                            {/* User's Result Banner if they participated */}
                            {userParticipant && (
                              <div className="p-2.5 bg-[#0C111A] rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 text-[10px]">Your Match Result:</span>
                                  <span className="font-bold text-white">
                                    Rank #{userParticipant.rank || '?'} ({userParticipant.kills || 0} Kills)
                                  </span>
                                </div>
                                <span className={`font-mono font-bold text-[11px] ${
                                  (userParticipant.winnings || 0) > 0 ? 'text-[#00FF66]' : 'text-slate-400'
                                }`}>
                                  {(userParticipant.winnings || 0) > 0
                                    ? `+₹${userParticipant.winnings}`
                                    : 'Better luck next time'}
                                </span>
                              </div>
                            )}

                            {/* Action Buttons: View Scorecard & Room Details */}
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-400 font-mono">
                                Room ID: {match.roomId || 'Archived'}
                              </span>

                              <button
                                onClick={() => setActiveRoomId(match.id)}
                                className="px-3.5 py-1.5 bg-[#1C2536] hover:bg-[#25324A] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#2E3D56]"
                              >
                                <span>View Full Roster</span>
                                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    {/* ========================================================== */}
                    {/* STANDARD UPCOMING / ONGOING MATCH CARD */}
                    {/* ========================================================== */}
                    return (
                      <div
                        key={match.id}
                        className="bg-[#121620] border border-[#20293A] hover:border-[#2C384E] rounded-2xl overflow-hidden shadow-lg transition-all"
                      >
                        {/* Match Card Header with Free Fire Branding */}
                        <div className="px-3.5 py-2.5 bg-[#0E121A] border-b border-[#1A2230] flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <FreeFireMatchCardBadge gameMode={match.gameMode} map={match.map} />
                            <span className="text-xs font-black text-white truncate max-w-[150px]">
                              {match.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>{match.matchTime}</span>
                            </span>
                          </div>
                        </div>

                        {/* Special Economic Highlight Banner for Clash Squad & Survival */}
                        {match.gameMode === 'Clash Squad' ? (
                          <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-950/40 to-slate-900 border-b border-[#1E2838] flex items-center justify-between text-[10px]">
                            <span className="text-[#00FF66] font-bold">
                              🔥 Entry: ₹50 • Win: ₹85
                            </span>
                            <span className="text-slate-400 font-mono">
                              (₹15 Platform Profit)
                            </span>
                          </div>
                        ) : match.gameMode === 'Survival' ? (
                          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border-b border-[#1E2838] flex items-center justify-between text-[10px]">
                            <span className="text-amber-400 font-bold">
                              🏆 20 Players Pool • Entry: ₹35
                            </span>
                            <span className="text-[#00FF66] font-bold font-mono">
                              Top 10 Win Cash (1st ₹150)
                            </span>
                          </div>
                        ) : null}

                        {/* Economics Grid: Prize Pool, Booyah, Per Kill, Entry */}
                        <div className="grid grid-cols-4 gap-1 p-2.5 text-center bg-[#0B0E14]/70 border-b border-[#1A2230]">
                          <div className="bg-[#111622] p-1.5 rounded-xl border border-[#1E2638]">
                            <p className="text-[9px] text-slate-400 uppercase font-medium">Pool</p>
                            <p className="text-xs font-black text-white">₹{match.prizePool}</p>
                          </div>
                          <div className="bg-gradient-to-b from-amber-500/15 via-[#111622] to-transparent p-1.5 rounded-xl border border-amber-500/30">
                            <p className="text-[9px] text-amber-300 uppercase font-bold">Booyah 👑</p>
                            <p className="text-xs font-black text-[#00FF66]">₹{match.booyahPrize}</p>
                          </div>
                          <div className="bg-[#111622] p-1.5 rounded-xl border border-[#1E2638]">
                            <p className="text-[9px] text-slate-400 uppercase font-medium">Per Kill</p>
                            <p className="text-xs font-black text-sky-400">₹{match.perKill}</p>
                          </div>
                          <div className="bg-[#111622] p-1.5 rounded-xl border border-[#1E2638]">
                            <p className="text-[9px] text-slate-400 uppercase font-medium">Entry</p>
                            <p className="text-xs font-black text-amber-400">₹{match.entryFee}</p>
                          </div>
                        </div>

                        {/* Expandable Prize Chart Button */}
                        <div className="px-3 py-1 bg-[#090C12] border-b border-[#1A2230] flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => setExpandedPrizeMatchId(isPrizeExpanded ? null : match.id)}
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isPrizeExpanded ? 'Hide Prize Distribution' : 'View Full Prize Payout Chart'}</span>
                            {isPrizeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>

                        {/* Collapsible Prize Distribution Table */}
                        {isPrizeExpanded && (
                          <div className="p-3 bg-[#0A0D15] border-b border-[#1E2838] space-y-1.5 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-[11px] font-black text-white">
                              <span>Official Payout Breakdown ({match.gameMode})</span>
                              <span className="text-[10px] text-slate-400">Max Slots: {match.maxSlots}</span>
                            </div>

                            {match.gameMode === 'Survival' ? (
                              <div className="space-y-1 text-[10px]">
                                <div className="grid grid-cols-2 gap-1 font-mono">
                                  <div className="p-1 bg-[#121824] rounded border border-[#202C40] flex justify-between">
                                    <span className="text-amber-300">1st Booyah:</span>
                                    <span className="text-[#00FF66] font-bold">₹150</span>
                                  </div>
                                  <div className="p-1 bg-[#121824] rounded border border-[#202C40] flex justify-between">
                                    <span className="text-slate-300">2nd Place:</span>
                                    <span className="text-[#00FF66] font-bold">₹90</span>
                                  </div>
                                  <div className="p-1 bg-[#121824] rounded border border-[#202C40] flex justify-between">
                                    <span className="text-slate-300">3rd Place:</span>
                                    <span className="text-[#00FF66] font-bold">₹65</span>
                                  </div>
                                  <div className="p-1 bg-[#121824] rounded border border-[#202C40] flex justify-between">
                                    <span className="text-slate-300">4th Place:</span>
                                    <span className="text-[#00FF66] font-bold">₹55</span>
                                  </div>
                                  <div className="p-1 bg-[#121824] rounded border border-[#202C40] flex justify-between">
                                    <span className="text-slate-300">5th & 6th:</span>
                                    <span className="text-[#00FF66] font-bold">₹50 each</span>
                                  </div>
                                  <div className="p-1 bg-[#121824] rounded border border-[#202C40] flex justify-between">
                                    <span className="text-slate-300">7th to 10th:</span>
                                    <span className="text-[#00FF66] font-bold">₹35 each</span>
                                  </div>
                                </div>
                                <div className="p-1 bg-rose-950/20 rounded border border-rose-900/30 text-rose-300 text-center font-bold">
                                  Rank 11 to 20: Better luck try next time (₹0)
                                </div>
                              </div>
                            ) : match.gameMode === 'Clash Squad' ? (
                              <div className="space-y-1 text-[10px]">
                                <div className="p-1.5 bg-[#121824] rounded border border-[#202C40] flex justify-between font-mono">
                                  <span className="text-amber-300 font-bold">1st (Winner Booyah):</span>
                                  <span className="text-[#00FF66] font-black">₹85 Cash Payout</span>
                                </div>
                                <div className="p-1.5 bg-slate-900/50 rounded border border-slate-800 flex justify-between text-slate-400">
                                  <span>2nd (Runner-up):</span>
                                  <span>Better luck try next time</span>
                                </div>
                                <div className="p-1 text-[9px] text-slate-400 text-center">
                                  Entry: ₹50 x 2 = ₹100 | Winner: ₹85 | Platform Profit: ₹15
                                </div>
                              </div>
                            ) : (
                              <div className="p-1.5 bg-[#121824] rounded border border-[#202C40] text-[10px] flex justify-between font-mono">
                                <span className="text-amber-300">Booyah: ₹{match.booyahPrize}</span>
                                <span className="text-sky-300">Each Kill: ₹{match.perKill}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Instant Click-to-Copy Room ID & Password Strip (For Joined Players when Live) */}
                        {isJoined && match.isRoomReleased && match.roomId && (
                          <CredentialCopyCard
                            roomId={match.roomId}
                            roomPassword={match.roomPassword}
                            matchTitle={match.title}
                            compact={true}
                            onCopied={(label) => showToast(`⚡ ${label} copied to clipboard!`)}
                          />
                        )}

                        {/* Slots & Action Footer */}
                        <div className="p-3 bg-[#0E121A] flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold mb-1">
                              <span>Slots: {match.participants.length}/{match.maxSlots}</span>
                              <span className="text-slate-400">{match.map} • {match.matchType || 'Solo'}</span>
                            </div>
                            <div className="w-full bg-[#1A2230] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-[#00FF66] rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, (match.participants.length / match.maxSlots) * 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          {/* Action Button: JOIN NOW / VIEW ROOM */}
                          <div>
                            {isJoined ? (
                              <button
                                onClick={() => setActiveRoomId(match.id)}
                                className="px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-95 text-black shadow-md shadow-[#00FF66]/20 cursor-pointer flex items-center gap-1.5"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>VIEW ROOM</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => !isFull && onOpenJoinDialog(match)}
                                disabled={isFull}
                                className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                                  isFull
                                    ? 'bg-[#1E2536] border-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-sky-500/20 to-[#00FF66]/20 hover:from-sky-500/30 hover:to-[#00FF66]/30 border-[#00FF66] text-[#00FF66] hover:text-white active:scale-95 shadow-md shadow-[#00FF66]/10'
                                }`}
                              >
                                <span>{isFull ? 'FULL' : 'JOIN NOW'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW TAB 2: TOURNAMENT HISTORY */}
          {activeNavTab === 'history' && (
            <TournamentHistoryScreen
              matches={matches}
              userProfile={userProfile}
              onSelectMatchRoom={(matchId) => setActiveRoomId(matchId)}
            />
          )}

          {/* VIEW TAB 3: LEADERBOARD SCREEN */}
          {activeNavTab === 'leaderboard' && (
            <LeaderboardScreen
              players={leaderboardPlayers}
              currentUserId={userProfile.uid}
            />
          )}

          {/* VIEW TAB 4: REFER & EARN SCREEN (₹5 per 1st deposit) */}
          {activeNavTab === 'refer' && (
            <ReferAndEarnScreen
              userProfile={userProfile}
              onClaimReferralReward={onClaimReferralReward}
              onRegisterReferralFriend={onRegisterReferralFriend}
              onFriendFirstDeposit={onFriendFirstDeposit}
            />
          )}
        </>
      )}

      {/* Floating SnackBar Toast */}
      {toastMessage && (
        <div className="absolute bottom-20 left-4 right-4 px-4 py-2.5 bg-[#131720] border border-[#00FF66] rounded-xl shadow-2xl flex items-center justify-center gap-2 text-xs font-bold text-white z-50 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* 🟢 FLOATING WHATSAPP SUPPORT BUTTON (Ergonomic Thumb Zone) */}
      {isLoggedIn && !activeRoomId && (
        <button
          onClick={onOpenSupportDialog}
          className="absolute bottom-20 right-3.5 z-40 min-h-[46px] min-w-[46px] p-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-black rounded-2xl shadow-xl shadow-emerald-500/35 flex items-center justify-center gap-1.5 cursor-pointer border border-white/30 transition-transform"
          title="Need Help? Chat on WhatsApp: 9569167476"
          aria-label="WhatsApp Support"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </button>
      )}

      {/* Bottom Navigation Bar: Native Thumb Ergonomics (>=48px Hitboxes + Safe-Area Inset) */}
      <nav className="bg-[#0E121A]/95 backdrop-blur-md border-t border-[#1E2536] px-1 pt-1 pb-safe grid grid-cols-5 items-center z-40 shrink-0">
        <button
          onClick={() => {
            setActiveRoomId(null);
            setActiveNavTab('matches');
          }}
          className={`min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeNavTab === 'matches' && !activeRoomId
              ? 'text-[#00FF66]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-bold tracking-tight">Matches</span>
        </button>

        <button
          onClick={() => {
            setActiveRoomId(null);
            setActiveNavTab('history');
          }}
          className={`min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeNavTab === 'history' && !activeRoomId
              ? 'text-[#00FF66]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-bold tracking-tight">History</span>
        </button>

        <button
          onClick={() => {
            setActiveRoomId(null);
            setActiveNavTab('leaderboard');
          }}
          className={`min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeNavTab === 'leaderboard' && !activeRoomId
              ? 'text-[#00FF66]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-bold tracking-tight">Ranks</span>
        </button>

        <button
          onClick={() => {
            setActiveRoomId(null);
            setActiveNavTab('refer');
          }}
          className={`min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeNavTab === 'refer' && !activeRoomId
              ? 'text-[#00FF66]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gift className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-bold tracking-tight">Refer</span>
        </button>

        <button
          onClick={onOpenProfileDialog}
          className="min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl active:scale-95 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <User className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-bold tracking-tight">Account</span>
        </button>
      </nav>
    </div>
  );
};
