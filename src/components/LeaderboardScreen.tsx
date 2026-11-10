import React, { useState } from 'react';
import { LeaderboardPlayer } from '../types';
import { Trophy, Medal, Flame, Crosshair, Search, Zap, Crown, UserCheck, Sparkles, Award } from 'lucide-react';

interface LeaderboardScreenProps {
  players: LeaderboardPlayer[];
  currentUserId: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  players,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'All-Time' | 'Weekly' | 'Today'>('All-Time');

  const filteredPlayers = players.filter(
    (p) =>
      p.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uid.includes(searchQuery)
  );

  const topThree = players.slice(0, 3);
  const userRankData = players.find((p) => p.uid === currentUserId);

  return (
    <div className="flex-1 overflow-y-auto bg-[#0B0E14] text-slate-100 flex flex-col pb-16">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-b from-[#131926] to-[#0B0E14] border-b border-[#1E2536]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-white uppercase">
                Hall of Champions
              </h2>
              <p className="text-[10px] text-slate-400">
                Top Earners & Match Dominators
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded-full border border-[#00FF66]/20">
            {players.length > 0 ? `${players.length} Ranked` : 'Fresh Season'}
          </span>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2 bg-[#0A0C10] p-1 rounded-xl border border-[#1E2536]">
          {(['All-Time', 'Weekly', 'Today'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterPeriod === period
                  ? 'bg-[#00FF66] text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Search Bar (visible if players exist) */}
        {players.length > 0 && (
          <div className="relative mt-2.5">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Player IGN or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#0A0D14] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
            />
          </div>
        )}
      </div>

      {/* When NO players on the Leaderboard yet (Brand New App State) */}
      {players.length === 0 ? (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-[#131926] to-[#00FF66]/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/5">
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-base font-black text-white">
              No Results Declared Yet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yeh app bilkul new hai! Jaise hi <strong>Match #1</strong> complete hoga aur Admin Panel se participant ranks aur kill counts enter honge, top earners aur Booyah champions yahan live rank ho jayenge.
            </p>
          </div>

          <div className="p-3 bg-[#0E121A] border border-[#1E2536] rounded-xl text-[11px] text-slate-300 space-y-1 text-left w-full max-w-xs">
            <div className="flex items-center gap-1.5 text-[#00FF66] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Automatic Prize Engine:</span>
            </div>
            <p className="text-[10px] text-slate-400">
              • 1st Rank (Booyah): <strong>₹50 Cash</strong><br />
              • Confirmed Kill Bounty: <strong>₹18 per Kill</strong><br />
              • Admin results declare karte hi Leaderboard update ho jayega!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length >= 3 && !searchQuery && (
            <div className="px-3 pt-4 pb-2">
              <div className="grid grid-cols-3 gap-2 items-end">
                {/* Rank 2 (Silver) */}
                <div className="flex flex-col items-center bg-[#0F1420] border border-slate-600/40 rounded-2xl p-2.5 relative pt-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700/60 border border-slate-400 flex items-center justify-center font-black text-slate-300 text-xs mb-1">
                    🥈
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-300 tracking-wider">
                    Rank 2
                  </span>
                  <p className="text-[11px] font-black text-white truncate max-w-full text-center mt-0.5">
                    {topThree[1].ign}
                  </p>
                  <div className="mt-1 text-center">
                    <span className="text-xs font-black text-[#00FF66]">
                      ₹{topThree[1].totalEarnings}
                    </span>
                    <p className="text-[9px] text-slate-400">
                      {topThree[1].matchesPlayed} Matches
                    </p>
                  </div>
                </div>

                {/* Rank 1 (Gold - Taller) */}
                <div className="flex flex-col items-center bg-gradient-to-b from-amber-500/10 to-[#131926] border border-amber-500/40 rounded-2xl p-2.5 relative pt-5 shadow-lg shadow-amber-500/10 -translate-y-2">
                  <Crown className="w-4 h-4 text-amber-400 absolute top-1.5" />
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-sm mb-1 mt-1">
                    🥇
                  </div>
                  <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                    Champion
                  </span>
                  <p className="text-xs font-black text-white truncate max-w-full text-center mt-0.5">
                    {topThree[0].ign}
                  </p>
                  <div className="mt-1 text-center">
                    <span className="text-sm font-black text-[#00FF66]">
                      ₹{topThree[0].totalEarnings}
                    </span>
                    <p className="text-[9px] text-slate-300 font-medium">
                      {topThree[0].booyahs} Booyahs • {topThree[0].totalKills} Kills
                    </p>
                  </div>
                </div>

                {/* Rank 3 (Bronze) */}
                <div className="flex flex-col items-center bg-[#0F1420] border border-amber-700/40 rounded-2xl p-2.5 relative pt-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 border border-amber-600/50 flex items-center justify-center font-black text-amber-600 text-xs mb-1">
                    🥉
                  </div>
                  <span className="text-[9px] font-black uppercase text-amber-600 tracking-wider">
                    Rank 3
                  </span>
                  <p className="text-[11px] font-black text-white truncate max-w-full text-center mt-0.5">
                    {topThree[2].ign}
                  </p>
                  <div className="mt-1 text-center">
                    <span className="text-xs font-black text-[#00FF66]">
                      ₹{topThree[2].totalEarnings}
                    </span>
                    <p className="text-[9px] text-slate-400">
                      {topThree[2].matchesPlayed} Matches
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Players Ranking List */}
          <div className="px-3 space-y-2 mt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-2 uppercase tracking-wider">
              <span>Rank & Player</span>
              <span>Stats / Earnings</span>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="p-6 text-center bg-[#0E121A] border border-[#1E2536] rounded-xl text-xs text-slate-400">
                No players found matching "{searchQuery}"
              </div>
            ) : (
              filteredPlayers.map((player) => {
                const isCurrentUser = player.uid === currentUserId;
                return (
                  <div
                    key={player.uid}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrentUser
                        ? 'bg-[#00FF66]/10 border-[#00FF66]/50 shadow-sm'
                        : 'bg-[#0E121A] border-[#1E2536] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          player.rank === 1
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : player.rank === 2
                            ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                            : player.rank === 3
                            ? 'bg-amber-800/20 text-amber-600 border border-amber-800/40'
                            : 'bg-[#18202F] text-slate-400'
                        }`}
                      >
                        #{player.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-white truncate">
                            {player.ign}
                          </p>
                          {isCurrentUser && (
                            <span className="text-[8px] bg-[#00FF66] text-black font-extrabold px-1 rounded uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                          UID: {player.uid} • {player.matchesPlayed} Matches
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-[#00FF66]">
                        ₹{player.totalEarnings}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        {player.booyahs} 🏆 • {player.totalKills} 🎯
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* User's Fixed Mini-Rank Footer if present */}
          {userRankData && (
            <div className="mt-auto pt-3 px-3">
              <div className="p-2.5 bg-[#131A28] border border-[#00FF66]/40 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] flex items-center justify-center font-black text-xs">
                    #{userRankData.rank}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Your Current Standing
                    </span>
                    <p className="text-xs font-bold text-white">
                      {userRankData.ign}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#00FF66]">
                    ₹{userRankData.totalEarnings} Won
                  </span>
                  <p className="text-[9px] text-slate-400">
                    {userRankData.matchesPlayed} Matches • {userRankData.booyahs} Booyahs
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
