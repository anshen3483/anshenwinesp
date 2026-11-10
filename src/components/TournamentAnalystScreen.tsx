import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TournamentMatch, UserProfile, LeaderboardPlayer } from '../types';
import {
  TrendingUp,
  Bot,
  Send,
  Sparkles,
  Zap,
  Trophy,
  Target,
  Coins,
  BarChart3,
  Trash2,
  X,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  Smartphone,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

interface TournamentAnalystScreenProps {
  matches: TournamentMatch[];
  userProfile: UserProfile;
  leaderboardPlayers: LeaderboardPlayer[];
  isModal?: boolean;
  onClose?: () => void;
  onOpenApkGuide?: () => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-analyst-1',
  role: 'model',
  text: 'Namaste Champion! 🎯 Main hoon aapka **AnshenWin AI Tournament Analyst & Esports Coach**.\n\nAap mujhse pooch sakte hain:\n• Apne **Match Stats, K/D aur Profit ROI** ka deep analysis\n• **Battle Ground (₹20)**, **Survival (₹35)** ya **Clash Squad (₹50)** me sabse zyada profit kaise kamayein\n• **Bermuda / Purgatory** drop-zone aur end-zone survival strategy\n• **Step-by-step Android APK** banane ka poora tareeka!',
  timestamp: 'Live Ready',
  modelUsed: 'gemini-3.8-flash',
};

export const TournamentAnalystScreen: React.FC<TournamentAnalystScreenProps> = ({
  matches,
  userProfile,
  leaderboardPlayers,
  isModal = false,
  onClose,
  onOpenApkGuide,
}) => {
  const [subView, setSubView] = useState<'analytics' | 'chat'>('analytics');
  const [roleMode, setRoleMode] = useState<'analyst' | 'fast_helper'>('analyst');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, subView]);

  // Compute real live tournament & player analytics
  const analytics = useMemo(() => {
    const joinedMatches = matches.filter((m) =>
      m.participants.some((p) => p.uid === userProfile.uid)
    );
    const completedJoined = joinedMatches.filter((m) => m.status === 'Results');
    const upcomingMatches = matches.filter((m) => m.status === 'Upcoming');

    let totalKills = 0;
    let booyahs = 0;
    let top10Finishes = 0;
    let matchWinnings = 0;
    let entrySpent = 0;

    joinedMatches.forEach((m) => {
      entrySpent += m.entryFee;
      const p = m.participants.find((part) => part.uid === userProfile.uid);
      if (p) {
        totalKills += p.kills || 0;
        if (p.rank === 1) booyahs += 1;
        if (p.rank && p.rank <= 10) top10Finishes += 1;
        matchWinnings += p.winnings || 0;
      }
    });

    // Also include wallet transaction data for comprehensive accuracy
    const txEntryTotal = userProfile.transactions
      .filter((t) => t.type === 'entry_fee')
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const txWinTotal = userProfile.transactions
      .filter((t) => t.type === 'winning')
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const effectiveEntry = Math.max(entrySpent, txEntryTotal);
    const effectiveWinnings = Math.max(matchWinnings, txWinTotal);
    const netProfit = effectiveWinnings - effectiveEntry;
    const roiPercent =
      effectiveEntry > 0 ? Math.round((netProfit / effectiveEntry) * 100) : 0;

    const totalPrizePoolActive = upcomingMatches.reduce((sum, m) => sum + m.prizePool, 0);
    const totalSlotsAvailable = upcomingMatches.reduce(
      (sum, m) => sum + Math.max(0, m.maxSlots - m.participants.length),
      0
    );

    const effectiveKills = Math.max(totalKills, userProfile.totalKills);
    const effectiveBooyahs = Math.max(booyahs, userProfile.matchesWon);
    const effectivePlayed = Math.max(completedJoined.length, userProfile.matchesPlayed);

    const kdRatio =
      effectivePlayed > 0
        ? (effectiveKills / Math.max(1, effectivePlayed - effectiveBooyahs)).toFixed(1)
        : effectiveKills.toFixed(1);

    return {
      joinedCount: Math.max(joinedMatches.length, userProfile.matchesPlayed),
      completedCount: effectivePlayed,
      upcomingCount: upcomingMatches.length,
      totalKills: effectiveKills,
      booyahs: effectiveBooyahs,
      top10Finishes,
      effectiveEntry,
      effectiveWinnings,
      netProfit,
      roiPercent,
      kdRatio,
      totalPrizePoolActive,
      totalSlotsAvailable,
    };
  }, [matches, userProfile]);

  // Serialize live context for Gemini multi-turn analyst
  const tournamentContextString = useMemo(() => {
    const matchLines = matches
      .slice(0, 6)
      .map(
        (m) =>
          `- ${m.title} (${m.gameMode}, Map: ${m.map}, Status: ${m.status}, Entry: ₹${m.entryFee}, Pool: ₹${m.prizePool}, Booyah: ₹${m.booyahPrize}, PerKill: ₹${m.perKill}, Slots: ${m.participants.length}/${m.maxSlots})`
      )
      .join('\n');

    const topPlayers = leaderboardPlayers
      .slice(0, 3)
      .map((p, idx) => `#${idx + 1} ${p.ign} (Earnings: ₹${p.totalEarnings}, Kills: ${p.totalKills}, Booyahs: ${p.booyahs})`)
      .join(' | ');

    return `Player IGN: ${userProfile.ign} (UID: ${userProfile.uid})
Wallet Balance: ₹${userProfile.walletBalance} | Referral Earnings: ₹${userProfile.referralEarnings || 0}
Player Stats: Joined=${analytics.joinedCount}, Completed=${analytics.completedCount}, Kills=${analytics.totalKills}, K/D=${analytics.kdRatio}, Booyahs=${analytics.booyahs}, EntrySpent=₹${analytics.effectiveEntry}, TotalWon=₹${analytics.effectiveWinnings}, NetProfit=₹${analytics.netProfit} (${analytics.roiPercent}% ROI)
Top Leaderboard Contenders: ${topPlayers}
Current Matches:\n${matchLines}`;
  }, [matches, userProfile, leaderboardPlayers, analytics]);

  const sendMessageToGemini = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    setErrorBanner(null);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: nowTime,
    };

    const priorHistory = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);
    if (!isModal && subView !== 'chat') {
      setSubView('chat');
    }

    try {
      const response = await fetch('/api/analyst/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          roleMode,
          tournamentContext: tournamentContextString,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Server error (${response.status})`);
      }

      const botReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to reach AI Tournament Analyst.';
      setErrorBanner(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToGemini(inputText);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setErrorBanner(null);
  };

  const quickPrompts = [
    'Mere stats analyze karo: kaunsa mode sabse profitable hai?',
    'Survival ₹35 (20-Player) me Top-3 aane ki pro strategy batao',
    'Clash Squad ₹50 match win karne ke best weapon combos?',
    'Is app ka Android APK kaise banaye step-by-step?',
  ];

  // Format basic bold & line breaks cleanly without external markdown bloat
  const renderFormattedMessage = (rawText: string) => {
    return rawText.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={line.trim() === '' ? 'h-2' : 'leading-relaxed'}>
          {parts.map((segment, segIdx) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return (
                <strong key={segIdx} className="text-white font-extrabold">
                  {segment.slice(2, -2)}
                </strong>
              );
            }
            return <span key={segIdx}>{segment}</span>;
          })}
        </p>
      );
    });
  };

  const AnalyticsDashboardPanel = (
    <div className="space-y-3">
      {/* Hero Analyst Summary Banner */}
      <div className="p-3.5 bg-gradient-to-br from-[#0F1B18] via-[#111724] to-[#171226] border border-[#00FF66]/40 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#00FF66]/15 border border-[#00FF66]/35 text-[#00FF66]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Player Performance & ROI Radar
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                {userProfile.ign} • Live Economy Intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              sendMessageToGemini(
                `Mere live AnshenWin stats analyze karo (Kills: ${analytics.totalKills}, K/D: ${analytics.kdRatio}, Net Profit: ₹${analytics.netProfit}) aur agle match ke liye best winning game plan batao!`
              )
            }
            className="px-2.5 py-1.5 bg-[#00FF66] hover:bg-[#33FF85] text-black font-black text-[10px] rounded-xl flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Audit</span>
          </button>
        </div>

        {/* 4 Key Combat & Financial Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-[#090D14]/90 border border-[#1E293B] rounded-xl">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Net Profit</span>
            <span
              className={`text-sm font-black font-mono ${
                analytics.netProfit >= 0 ? 'text-[#00FF66]' : 'text-amber-400'
              }`}
            >
              {analytics.netProfit >= 0 ? `+₹${analytics.netProfit}` : `-₹${Math.abs(analytics.netProfit)}`}
            </span>
            <span className="text-[8px] text-slate-500 block">ROI: {analytics.roiPercent}%</span>
          </div>

          <div className="p-2 bg-[#090D14]/90 border border-[#1E293B] rounded-xl">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Total Won</span>
            <span className="text-sm font-black font-mono text-amber-400">
              ₹{analytics.effectiveWinnings}
            </span>
            <span className="text-[8px] text-slate-500 block">Spent: ₹{analytics.effectiveEntry}</span>
          </div>

          <div className="p-2 bg-[#090D14]/90 border border-[#1E293B] rounded-xl">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Lethality</span>
            <span className="text-sm font-black font-mono text-sky-400">
              {analytics.totalKills} Kills
            </span>
            <span className="text-[8px] text-slate-500 block">K/D Ratio: {analytics.kdRatio}</span>
          </div>

          <div className="p-2 bg-[#090D14]/90 border border-[#1E293B] rounded-xl">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Booyahs</span>
            <span className="text-sm font-black font-mono text-white">
              {analytics.booyahs} 🏆
            </span>
            <span className="text-[8px] text-slate-500 block">
              Joined: {analytics.joinedCount} Matches
            </span>
          </div>
        </div>
      </div>

      {/* Mode Expected Value (EV) & Profitability Matrix */}
      <div className="p-3.5 bg-[#0E131D] border border-[#1F2A3E] rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Tournament Format ROI Comparison</span>
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            Active Pool: ₹{analytics.totalPrizePoolActive}
          </span>
        </div>

        <div className="space-y-2 text-[11px]">
          {/* Format 1: Battle Ground */}
          <div className="p-2.5 bg-[#090C12] border border-[#1E283A] rounded-xl flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white">🎯 Battle Ground Solo</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded font-bold">
                  Aggro Kill Meta
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Entry ₹20 • ₹18/Kill • ₹50 Booyah (Sirf 2 kills = ₹36 return!)
              </p>
            </div>
            <span className="text-xs font-black font-mono text-[#00FF66] shrink-0">+80% @2K</span>
          </div>

          {/* Format 2: Survival 20-Player */}
          <div className="p-2.5 bg-[#090C12] border border-[#1E283A] rounded-xl flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white">🛡️ Survival 20-Player</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/15 text-[#00FF66] border border-[#00FF66]/30 rounded font-bold">
                  Safest Cash-Back
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Entry ₹35 • Top 10 Win Cash (7th-10th ₹35 safe, 1st ₹150!)
              </p>
            </div>
            <span className="text-xs font-black font-mono text-amber-400 shrink-0">50% ITM</span>
          </div>

          {/* Format 3: Clash Squad */}
          <div className="p-2.5 bg-[#090C12] border border-[#1E283A] rounded-xl flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white">⚡ Clash Squad Duel</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded font-bold">
                  Fast 1v1 Payout
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Entry ₹50 • Instant ₹85 Winner Payout (Pure aim & gloo-wall skill)
              </p>
            </div>
            <span className="text-xs font-black font-mono text-[#00FF66] shrink-0">+₹35 Win</span>
          </div>
        </div>
      </div>

      {/* Live Lobby Slot Velocity & Contender Watch */}
      <div className="p-3.5 bg-[#0E131D] border border-[#1F2A3E] rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Live Lobby Fill & Top Contenders</span>
          </span>
          <span className="text-[9px] text-[#00FF66] font-mono">
            {analytics.totalSlotsAvailable} Open Slots
          </span>
        </div>

        <div className="space-y-1.5">
          {matches
            .filter((m) => m.status !== 'Results')
            .slice(0, 3)
            .map((m) => {
              const fillPct = Math.round((m.participants.length / m.maxSlots) * 100);
              return (
                <div
                  key={m.id}
                  className="p-2 bg-[#090C12] border border-[#1B2434] rounded-xl flex items-center justify-between text-[10px]"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-200 truncate block">{m.title}</span>
                    <span className="text-slate-500">
                      {m.map} • Entry ₹{m.entryFee} • {m.participants.length}/{m.maxSlots} Players
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-black shrink-0 ${
                      fillPct >= 75
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30'
                    }`}
                  >
                    {fillPct}% Full
                  </span>
                </div>
              );
            })}
        </div>

        {onOpenApkGuide && (
          <button
            type="button"
            onClick={onOpenApkGuide}
            className="w-full mt-1 py-2 bg-[#131C2B] hover:bg-[#1A263B] border border-[#2C3E5D] rounded-xl text-[11px] font-bold text-sky-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>Open Step-by-Step Android APK Builder Guide</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  const ChatThreadPanel = (
    <div className="flex flex-col h-full min-h-[380px] bg-[#090C12] border border-[#1E283A] rounded-2xl overflow-hidden">
      {/* Chatbot Role & Model Selector Header */}
      <div className="px-3 py-2 bg-[#101622] border-b border-[#1E283A] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-[#080B10] p-1 rounded-xl border border-[#1E283A]">
          <button
            type="button"
            onClick={() => setRoleMode('analyst')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
              roleMode === 'analyst'
                ? 'bg-[#00FF66] text-black'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Uses gemini-3.8-flash for Tournament Strategy & Analytics"
          >
            <Target className="w-3 h-3" />
            <span>Pro Analyst</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleMode('fast_helper')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
              roleMode === 'fast_helper'
                ? 'bg-sky-400 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Uses gemini-3.1-flash-lite for Instant Rules & APK Guide"
          >
            <Zap className="w-3 h-3" />
            <span>Fast Helper</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#192234] rounded-lg transition-colors cursor-pointer"
          title="Clear Conversation History"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable Multi-Turn Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[340px] sm:max-h-[400px]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-xs space-y-1 ${
                  isUser
                    ? 'bg-[#00FF66] text-black font-semibold rounded-br-sm'
                    : 'bg-[#131A28] text-slate-200 border border-[#24324B] rounded-bl-sm'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#00FF66] mb-1">
                    <Bot className="w-3 h-3" />
                    <span className="font-black uppercase">
                      {msg.modelUsed === 'gemini-3.1-flash-lite'
                        ? 'Fast Match & APK Bot'
                        : 'AnshenWin Pro Analyst'}
                    </span>
                  </div>
                )}
                <div className={isUser ? 'text-black font-semibold' : 'text-slate-200 space-y-1'}>
                  {isUser ? msg.text : renderFormattedMessage(msg.text)}
                </div>
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-[#131A28] border border-[#24324B] rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-[#00FF66] animate-spin" />
              <span>Analyzing live tournament data...</span>
            </div>
          </div>
        )}

        {errorBanner && (
          <div className="p-2.5 bg-rose-950/50 border border-rose-500/40 rounded-xl text-[11px] text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorBanner}</span>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-2.5 py-1.5 bg-[#0C1018] border-t border-[#182132] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => sendMessageToGemini(qp)}
            className="px-2.5 py-1 bg-[#141C2B] hover:bg-[#1E2A40] border border-[#26354D] rounded-lg text-[10px] font-semibold text-slate-300 hover:text-[#00FF66] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleFormSubmit}
        className="p-2 bg-[#101622] border-t border-[#1E283A] flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            roleMode === 'analyst'
              ? 'Ask strategy, ROI, drop zones...'
              : 'Ask rules, Room ID, or APK steps...'
          }
          className="flex-1 bg-[#080B10] border border-[#24324B] focus:border-[#00FF66] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2 bg-[#00FF66] hover:bg-[#33FF85] disabled:opacity-40 text-black rounded-xl transition-all cursor-pointer shrink-0"
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  // Modal Presentation (Desktop & Full-Screen Analyst Studio)
  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl bg-[#0D111A] border border-[#2A3952] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-5 py-3.5 bg-[#0A0E16] border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00FF66]/15 border border-[#00FF66]/35 text-[#00FF66]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    AnshenWin Tournament Analyst & Gemini Esports Coach
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
                    Multi-Turn AI
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time tournament ROI metrics + multi-turn strategy & APK assistant
                </p>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1E2536] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 2-Column Split Inside Modal */}
          <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-6">{AnalyticsDashboardPanel}</div>
            <div className="lg:col-span-6 flex flex-col">{ChatThreadPanel}</div>
          </div>

          <div className="px-5 py-2.5 bg-[#090C12] border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Powered by Gemini • Context-synced with live AnshenWin matches</span>
            </span>
            <span>Support: WhatsApp 9569167476</span>
          </div>
        </div>
      </div>
    );
  }

  // Embedded Mobile Simulator Presentation
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#090C12]">
      {/* Sub-navigation switcher inside Mobile App */}
      <div className="px-3 py-2 bg-[#0E121A] border-b border-[#1E2536] flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setSubView('analytics')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subView === 'analytics'
              ? 'bg-[#00FF66] text-black shadow-sm'
              : 'bg-[#131926] text-slate-300 border border-[#243046]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Stats & ROI</span>
        </button>
        <button
          type="button"
          onClick={() => setSubView('chat')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subView === 'chat'
              ? 'bg-[#00FF66] text-black shadow-sm'
              : 'bg-[#131926] text-slate-300 border border-[#243046]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Coach Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
        {subView === 'analytics' ? AnalyticsDashboardPanel : ChatThreadPanel}
      </div>
    </div>
  );
};
