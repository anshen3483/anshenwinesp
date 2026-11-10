import React, { useState } from 'react';
import { TournamentMatch, UserProfile } from '../types';
import { 
  Trophy, 
  Gamepad2, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  IndianRupee,
  Key,
  Shield,
  HelpCircle,
  Flame,
  Award
} from 'lucide-react';
import { FreeFireMatchCardBadge } from './FreeFireLogo';

interface TournamentHistoryScreenProps {
  matches: TournamentMatch[];
  userProfile: UserProfile;
  onSelectMatchRoom?: (matchId: string) => void;
}

export const TournamentHistoryScreen: React.FC<TournamentHistoryScreenProps> = ({
  matches,
  userProfile,
  onSelectMatchRoom,
}) => {
  const [filterType, setFilterType] = useState<'my' | 'all'>('my');
  const [modeFilter, setModeFilter] = useState<'All' | 'Survival' | 'Clash Squad' | 'Battle Ground'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get completed / results matches
  const completedMatches = matches.filter((m) => m.status === 'Results');

  // Filter based on user participation if 'my' is selected
  const userMatches = completedMatches.filter((m) =>
    m.participants.some((p) => p.uid === userProfile.uid || p.ign === userProfile.ign)
  );

  const displayMatches = (filterType === 'my' ? userMatches : completedMatches)
    .filter((m) => {
      if (modeFilter !== 'All' && m.gameMode !== modeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(query) ||
          m.map.toLowerCase().includes(query) ||
          m.gameMode.toLowerCase().includes(query)
        );
      }
      return true;
    });

  // Calculate user stats from history
  const totalUserMatches = userMatches.length;
  const totalBooyahs = userMatches.filter((m) => {
    const userP = m.participants.find((p) => p.uid === userProfile.uid || p.ign === userProfile.ign);
    return userP && userP.rank === 1;
  }).length;

  const totalEarnings = userMatches.reduce((acc, m) => {
    const userP = m.participants.find((p) => p.uid === userProfile.uid || p.ign === userProfile.ign);
    return acc + (userP?.winnings || 0);
  }, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#090C12] text-slate-100">
      {/* Top Banner & Quick Summary */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#0C121D] via-[#111827] to-[#0A161E] border-b border-[#1E293B] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>TOURNAMENTS HISTORY</span>
                <span className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-1.5 py-0.2 rounded font-mono">
                  VERIFIED
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Official Free Fire Match Records & Payouts</p>
            </div>
          </div>

          {/* Quick User Stats */}
          <div className="flex items-center gap-2 text-right">
            <div className="bg-[#131A26] border border-[#232F46] px-2.5 py-1 rounded-xl">
              <span className="text-[9px] text-slate-400 uppercase block font-bold">Winnings</span>
              <span className="text-xs font-black text-[#00FF66]">₹{totalEarnings}</span>
            </div>
            <div className="bg-[#131A26] border border-[#232F46] px-2.5 py-1 rounded-xl">
              <span className="text-[9px] text-slate-400 uppercase block font-bold">Booyahs</span>
              <span className="text-xs font-black text-amber-400">👑 {totalBooyahs}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: My Matches vs All Results */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 bg-[#0A0D15] p-0.5 rounded-xl border border-[#202B3E] flex">
            <button
              onClick={() => setFilterType('my')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterType === 'my'
                  ? 'bg-[#182335] text-[#00FF66] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>My Matches ({userMatches.length})</span>
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterType === 'all'
                  ? 'bg-[#182335] text-[#00FF66] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>All Tournaments ({completedMatches.length})</span>
            </button>
          </div>
        </div>

        {/* Game Mode Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
          {(['All', 'Survival', 'Clash Squad', 'Battle Ground'] as const).map((mode) => {
            const isSelected = modeFilter === mode;
            return (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E273A] text-amber-400 border border-amber-400/40 shadow-sm'
                    : 'bg-[#111622] text-slate-400 border border-[#1E2536] hover:text-slate-200'
                }`}
              >
                {mode === 'Survival' ? 'Survival 20P' : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tournaments List Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-20 no-scrollbar">
        {displayMatches.length === 0 ? (
          <div className="py-14 text-center text-slate-400 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#121824] border border-[#232F46] flex items-center justify-center text-slate-500">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Tournament History Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {filterType === 'my'
                ? "You haven't participated in any completed tournaments yet. Join an upcoming match to compete!"
                : 'No finished tournaments in this category yet.'}
            </p>
          </div>
        ) : (
          displayMatches.map((match) => {
            const userParticipant = match.participants.find(
              (p) => p.uid === userProfile.uid || p.ign === userProfile.ign
            );

            const isUserBooyah = userParticipant && userParticipant.rank === 1;
            const userRank = userParticipant?.rank;
            const userWinnings = userParticipant?.winnings || 0;
            const isTop10Survival = match.gameMode === 'Survival' && userRank && userRank <= 10;
            const isOutside10Survival = match.gameMode === 'Survival' && userRank && userRank > 10;

            return (
              <div
                key={match.id}
                className={`rounded-2xl border transition-all overflow-hidden bg-[#101520] ${
                  isUserBooyah
                    ? 'border-amber-500/50 shadow-lg shadow-amber-950/20'
                    : userParticipant
                    ? 'border-[#00FF66]/30 shadow-md shadow-emerald-950/20'
                    : 'border-[#1E2638]'
                }`}
              >
                {/* Header: Mode Badge + Title + Match Time */}
                <div className="px-3.5 py-2.5 bg-[#0C1018] border-b border-[#1A2232] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FreeFireMatchCardBadge gameMode={match.gameMode} map={match.map} />
                    <span className="text-xs font-black text-white truncate max-w-[170px]">
                      {match.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{match.matchTime}</span>
                  </span>
                </div>

                {/* Match Economics & Rules Tag */}
                <div className="p-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#161D2B] border border-[#243048] text-slate-300 font-mono text-[10px]">
                        Entry: ₹{match.entryFee}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                        Booyah: ₹{match.booyahPrize}
                      </span>
                      {match.gameMode === 'Clash Squad' && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          Win: ₹85 (₹15 profit)
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Completed
                    </span>
                  </div>

                  {/* Player Result Banner if participated */}
                  {userParticipant ? (
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isUserBooyah
                          ? 'bg-gradient-to-r from-amber-500/20 via-[#182335] to-[#101826] border-amber-500/50'
                          : userWinnings > 0
                          ? 'bg-gradient-to-r from-emerald-500/15 via-[#121B28] to-[#101826] border-[#00FF66]/40'
                          : 'bg-[#131822] border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isUserBooyah ? (
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-black">
                            👑
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-300">
                            #{userRank || '?'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white">
                              {userParticipant.ign}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                              Slot #{userParticipant.slotNumber}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Kills: <strong className="text-white">{userParticipant.kills || 0}</strong> • 
                            Rank: <strong className="text-amber-400">#{userRank || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Prize won or Better Luck Next Time */}
                      <div className="text-right">
                        {userWinnings > 0 ? (
                          <div>
                            <span className="text-[9px] font-black uppercase text-[#00FF66] tracking-wider block">
                              Prize Won
                            </span>
                            <span className="text-sm font-black text-[#00FF66] font-mono">
                              +₹{userWinnings}
                            </span>
                          </div>
                        ) : isOutside10Survival ? (
                          <div className="text-right">
                            <span className="text-[9px] font-black text-rose-400 block uppercase">
                              Rank &gt; 10
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              Better luck try next time!
                            </span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold">
                              Better luck next time
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* General Winner Display for non-participant */
                    <div className="p-2.5 bg-[#0C1018] rounded-xl border border-[#1A2232] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-black">🏆 Winner:</span>
                        <span className="font-bold text-white font-mono">
                          {match.winnerIgn || match.participants[0]?.ign || 'Champion'}
                        </span>
                      </div>
                      <span className="font-black text-[#00FF66] font-mono">
                        +₹{match.winnerPrize || match.booyahPrize}
                      </span>
                    </div>
                  )}

                  {/* Payout Rule Breakdown Snippet for Survival or Clash Squad */}
                  {match.gameMode === 'Survival' && (
                    <div className="p-2 bg-[#0A0D14] rounded-lg border border-[#1A2230] text-[10px] text-slate-300 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-400">
                        <span>20 Players Pool Payouts:</span>
                        <span className="text-[#00FF66]">Top 10 Win Cash</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
                        <div className="bg-[#121622] p-1 rounded border border-[#1F293D]">1st: ₹150</div>
                        <div className="bg-[#121622] p-1 rounded border border-[#1F293D]">2nd: ₹90</div>
                        <div className="bg-[#121622] p-1 rounded border border-[#1F293D]">3rd: ₹65</div>
                        <div className="bg-[#121622] p-1 rounded border border-[#1F293D]">4th: ₹55</div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                        <div className="bg-[#121622] p-1 rounded border border-[#1F293D]">5th & 6th: ₹50</div>
                        <div className="bg-[#121622] p-1 rounded border border-[#1F293D]">7th-10th: ₹35</div>
                        <div className="bg-rose-950/30 text-rose-300 p-1 rounded border border-rose-900/40">11-20: Better Luck</div>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions: View Room ID or Spectator */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Key className="w-3 h-3 text-slate-500" />
                      <span>Room: {match.roomId ? `ID: ${match.roomId}` : 'Archived'}</span>
                    </div>

                    {onSelectMatchRoom && (
                      <button
                        onClick={() => onSelectMatchRoom(match.id)}
                        className="px-3 py-1 bg-[#162030] hover:bg-[#1E2B40] text-sky-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Match Room</span>
                        <ArrowUpRight className="w-3 h-3" />
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
  );
};
