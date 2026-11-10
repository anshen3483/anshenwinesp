import React, { useState, useEffect } from 'react';
import { TournamentMatch, UserProfile } from '../types';
import { 
  X, 
  Radio, 
  Tv, 
  Users, 
  Eye, 
  Flame, 
  MessageCircle, 
  Send, 
  Trophy, 
  Crosshair, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  ExternalLink,
  Play,
  Pause,
  Key
} from 'lucide-react';
import { AnshenWinLogo } from './AnshenWinLogo';
import { FreeFireMatchCardBadge } from './FreeFireLogo';

interface LiveLobbyModalProps {
  matches: TournamentMatch[];
  activeMatchId?: string;
  userProfile: UserProfile;
  onClose: () => void;
  onToggleMatchLive?: (matchId: string, isLive: boolean, streamUrl?: string) => void;
  onOpenRoom?: (matchId: string) => void;
}

export const LiveLobbyModal: React.FC<LiveLobbyModalProps> = ({
  matches,
  activeMatchId,
  userProfile,
  onClose,
  onToggleMatchLive,
  onOpenRoom,
}) => {
  // Find live matches or default to selected / first match
  const liveMatches = matches.filter((m) => m.isLive);
  const initialMatch = liveMatches.length > 0 
    ? liveMatches[0] 
    : (matches.find((m) => m.id === activeMatchId) || matches[0]);

  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch>(initialMatch);
  const [viewerCount, setViewerCount] = useState<number>(() => Math.floor(180 + Math.random() * 120));
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; user: string; text: string; time: string; isVip?: boolean }>>([
    { id: '1', user: 'GamingRohit', text: 'Anshen bhai match kab start hoga? 🔥', time: '1m ago' },
    { id: '2', user: 'FF_Rakesh_OP', text: 'Bermuda solo booyah mera hoga! 👑', time: '45s ago' },
    { id: '3', user: 'SoloKing77', text: 'Good luck all players! Room ID mil gaya 👍', time: '20s ago' },
    { id: '4', user: 'ProGamer_Ayush', text: 'Survival 20 players match is crazy! 💥', time: 'Just now', isVip: true },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [killFeed, setKillFeed] = useState<string[]>([
    '⚡ ANSHEN⚡777 eliminated BOT_99 (M1887)',
    '🎯 Solo_Vijay headshot PRO_KILLER (AWM)',
  ]);
  const [isSimulatingFeed, setIsSimulatingFeed] = useState(true);

  // Stream URL state for admin
  const [customStreamUrl, setCustomStreamUrl] = useState(selectedMatch?.liveStreamUrl || '');

  // Simulate dynamic viewers and kill feed
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => Math.max(50, prev + Math.floor(Math.random() * 7) - 3));
    }, 4000);

    const killInterval = setInterval(() => {
      if (isSimulatingFeed && selectedMatch?.participants?.length > 1) {
        const p1 = selectedMatch.participants[Math.floor(Math.random() * selectedMatch.participants.length)]?.ign || 'Gamer77';
        const p2 = `Enemy_${Math.floor(100 + Math.random() * 900)}`;
        const weapons = ['M1887', 'MP40', 'AWM', 'Woodpecker', 'Groza', 'Desert Eagle'];
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];
        const newKill = `⚡ ${p1} knocked out ${p2} (${weapon})`;
        setKillFeed((prev) => [newKill, ...prev.slice(0, 4)]);
      }
    }, 8000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(killInterval);
    };
  }, [selectedMatch, isSimulatingFeed]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      user: userProfile.ign || userProfile.name,
      text: inputMsg.trim(),
      time: 'Just now',
      isVip: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleToggleLiveStatus = () => {
    if (!selectedMatch) return;
    const newLiveState = !selectedMatch.isLive;
    if (onToggleMatchLive) {
      onToggleMatchLive(selectedMatch.id, newLiveState, customStreamUrl);
    }
    setSelectedMatch((prev) => ({
      ...prev,
      isLive: newLiveState,
      liveStreamUrl: customStreamUrl,
    }));
  };

  const isCurrentMatchLive = selectedMatch?.isLive;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-[#0D111A] border-t border-x border-[#27354D] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col h-[93dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />
        {/* Top Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#0A0D15] via-[#121826] to-[#0A121C] border-b border-[#1E293B] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px] font-black uppercase flex items-center gap-1 border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  LIVE LOBBY & STREAM
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span>{viewerCount} Watching</span>
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5">{selectedMatch?.title || 'Tournament'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Live Toggle Button */}
            <button
              onClick={handleToggleLiveStatus}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                isCurrentMatchLive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-[#00FF66] text-black hover:opacity-90'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isCurrentMatchLive ? '🔴 End Live' : '▶️ Make Match LIVE'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-[#1E2536] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Match Selector Tabs */}
        {matches.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#090C12] border-b border-[#1E2536] overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Select Room:</span>
            {matches.map((m) => {
              const isSelected = m.id === selectedMatch.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMatch(m);
                    setCustomStreamUrl(m.liveStreamUrl || '');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#182335] text-white border-[#00FF66]'
                      : 'bg-[#101520] text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  {m.isLive && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                  <span>Match #{m.matchNumber} ({m.gameMode})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Live Stage: Mobile Single-Column Scrollable Arena + Live Chat */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {/* Live Stream Screen / Arena View */}
          <div className="flex flex-col bg-[#07090E] border-b border-[#1E273A]">
            {/* Visual Arena / Spectator View */}
            <div className="relative w-full bg-gradient-to-br from-[#0B1019] via-[#121927] to-[#0A131F] flex flex-col justify-between p-4 overflow-hidden border-b border-[#1E273A]">
              {/* Background Free Fire stylized grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1E2D48_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Top Arena HUD */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-rose-900/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    LIVE SPECTATOR
                  </span>
                  <FreeFireMatchCardBadge gameMode={selectedMatch.gameMode} map={selectedMatch.map} />
                </div>

                <div className="flex items-center gap-2 bg-[#000000]/70 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-300 font-bold uppercase">ALIVE:</span>
                  <span className="text-xs font-black text-[#00FF66] font-mono">
                    {Math.max(1, (selectedMatch.participants?.length || 20) - 6)}/{selectedMatch.maxSlots}
                  </span>
                </div>
              </div>

              {/* Center Hologram Arena Banner */}
              <div className="relative z-10 text-center my-auto py-6">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#FF5500] via-[#FFAA00] to-[#00FF66] p-0.5 shadow-[0_0_35px_rgba(255,102,0,0.4)] animate-pulse-glow flex items-center justify-center">
                  <div className="w-full h-full bg-[#0D121D] rounded-[22px] flex items-center justify-center">
                    <Tv className="w-8 h-8 text-[#00FF66]" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-white mt-3 tracking-wide">
                  {selectedMatch.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  {isCurrentMatchLive
                    ? 'Custom Room Live broadcast active. Spectator stream is broadcasting live custom room action!'
                    : 'Match will be broadcast live when custom room starts. Click "Make Match LIVE" above to activate.'}
                </p>

                {/* Official YouTube Channel Redirect Button for Live Audience */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href="https://youtube.com/@anshengaming?si=RAs1KAfYdrOXxeyL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white text-xs font-black transition-all shadow-xl shadow-red-950/60 cursor-pointer uppercase tracking-wider border border-white/20"
                  >
                    <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>🔴 WATCH LIVE ON YOUTUBE (@anshengaming)</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>

                  {selectedMatch.liveStreamUrl && selectedMatch.liveStreamUrl !== 'https://youtube.com/@anshengaming?si=RAs1KAfYdrOXxeyL' && (
                    <a
                      href={selectedMatch.liveStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#182335] hover:bg-[#202F48] text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                    >
                      <span>Custom RTMP Stream</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom HUD: Live Kill Feed Ticker */}
              <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 overflow-hidden text-xs">
                  <Crosshair className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-mono text-[11px] text-amber-300 font-bold truncate">
                    {killFeed[0] || 'Waiting for first blood...'}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onOpenRoom && (
                    <button
                      onClick={() => onOpenRoom(selectedMatch.id)}
                      className="px-3 py-1 bg-[#00FF66] text-black font-black text-[11px] rounded-lg shadow-sm cursor-pointer hover:bg-[#00FF66]/90 transition-all flex items-center gap-1"
                    >
                      <Key className="w-3 h-3 text-black" />
                      <span>Enter Room</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Match Economics & Rules Summary under video */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 bg-[#101624] border border-[#1E2638] rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Game Mode</p>
                  <p className="text-xs font-black text-white mt-0.5">{selectedMatch.gameMode}</p>
                </div>
                <div className="p-2.5 bg-[#101624] border border-[#1E2638] rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Entry Fee</p>
                  <p className="text-xs font-black text-amber-400 mt-0.5">₹{selectedMatch.entryFee}</p>
                </div>
                <div className="p-2.5 bg-[#101624] border border-[#1E2638] rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Booyah Prize</p>
                  <p className="text-xs font-black text-[#00FF66] mt-0.5">₹{selectedMatch.booyahPrize}</p>
                </div>
                <div className="p-2.5 bg-[#101624] border border-[#1E2638] rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Slots</p>
                  <p className="text-xs font-black text-sky-400 mt-0.5">
                    {selectedMatch.participants?.length || 0}/{selectedMatch.maxSlots}
                  </p>
                </div>
              </div>

              {/* Admin Broadcast Stream Link Input */}
              <div className="p-3 bg-[#111724] border border-[#232F46] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-sky-400" />
                    <span>Admin Broadcast URL (YouTube Live / Rooter / Custom):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customStreamUrl}
                    onChange={(e) => setCustomStreamUrl(e.target.value)}
                    placeholder="https://youtube.com/live/... or https://twitch.tv/..."
                    className="flex-1 px-3 py-1.5 text-xs bg-[#090C12] border border-[#27364E] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
                  />
                  <button
                    onClick={handleToggleLiveStatus}
                    className="px-3 py-1.5 bg-[#1C273C] hover:bg-[#263552] text-white text-xs font-bold rounded-xl border border-slate-600 cursor-pointer"
                  >
                    Save URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat & Reactions Section */}
          <div className="flex flex-col bg-[#0B0E14] min-h-[260px]">
            {/* Chat Header */}
            <div className="px-4 py-3 bg-[#0E121A] border-b border-[#1E2536] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#00FF66]" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Live Viewer Chat
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 space-y-2.5 text-xs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2 bg-[#121622] rounded-xl border border-[#1F293D] space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`font-black ${msg.isVip ? 'text-[#00FF66]' : 'text-sky-300'}`}>
                      {msg.user} {msg.isVip && '⚡'}
                    </span>
                    <span className="text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0E121A] border-t border-[#1E2536] flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Cheer your favourite player..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#141926] border border-[#27354E] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
              />
              <button
                type="submit"
                className="p-2 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black rounded-xl transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
