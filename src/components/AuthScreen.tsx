import React, { useState } from 'react';
import { UserProfile } from '../types';
import { FreeFireLogo } from './FreeFireLogo';
import { AnshenWinLogo } from './AnshenWinLogo';
import { 
  Flame, 
  Lock, 
  Mail, 
  ShieldAlert, 
  ShieldCheck,
  Zap, 
  ArrowRight,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string) => void;
  onSignUp: (newUser: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('anshen.gamer@gmail.com');
  const [loginPassword, setLoginPassword] = useState('anshen123');

  // Sign Up form state
  const [name, setName] = useState('');
  const [ign, setIgn] = useState('');
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('Please fill in both fields');
      return;
    }
    setError(null);
    onLogin(loginIdentifier.trim());
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ign.trim() || !uid.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (!/^\d{6,14}$/.test(uid.trim())) {
      setError('Free Fire UID must be numeric (at least 6 digits)');
      return;
    }
    setError(null);
    const initialUid = uid.trim();
    onSignUp({
      name: name.trim(),
      ign: ign.trim(),
      uid: initialUid,
      email: email.trim(),
      phone: phone.trim() || '+91 9876543210',
      walletBalance: 200,
      totalKills: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      referralCode: `WIN${initialUid.slice(-4)}`,
      totalReferrals: 0,
      referralEarnings: 0,
      transactions: [
        {
          id: `tx-welcome-${Date.now()}`,
          type: 'deposit',
          title: 'Welcome Demo Bonus',
          description: 'Free ₹200 test credits given on new signup',
          amount: 200,
          date: 'Just now',
          balanceAfter: 200,
        },
      ],
    });
  };

  const handleQuickDemoLogin = () => {
    onLogin('anshen.gamer@gmail.com');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto no-scrollbar bg-[#090B0E] text-slate-100">
      <div className="space-y-3.5">
        {/* Animated Welcome to AnshenWin Free Fire Esports Header */}
        <div className="text-center pt-1.5 flex flex-col items-center">
          <AnshenWinLogo size="lg" showSubtitle={true} subtitleText="FREE FIRE TOURNAMENTS" className="justify-center" />
          <div className="flex items-center gap-2 mt-1 text-[10px]">
            <span className="text-slate-400 font-mono">Custom Rooms</span>
            <span className="text-slate-600">•</span>
            <span className="text-[#00FF66] font-bold">100% Fair Play Anti-Cheat</span>
          </div>
        </div>

        {/* 🛡️ Authentic Anti-Hack Security Banner */}
        <div className="p-3 bg-gradient-to-r from-[#0B1510] via-[#101D16] to-[#0D1520] border border-[#00FF66]/40 rounded-xl relative overflow-hidden shadow-md shadow-[#00FF66]/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00FF66]/15 border border-[#00FF66]/30 text-[#00FF66] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00FF66]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-white">
                  100% ANTI-HACK SYSTEM ACTIVE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                Server-side Anti-Cheat proctoring. Hacks, scripts, configs & emulators strictly banned for 100% fair play.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Simple & Clean */}
        <div className="flex p-1 bg-[#131720] border border-[#263042] rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#00FF66] text-black shadow-md shadow-[#00FF66]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[#00FF66] text-black shadow-md shadow-[#00FF66]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-[11px] text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Clean Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Email or Free Fire UID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="anshen.gamer@gmail.com / 1928374650"
                  className="w-full pl-9 pr-3 py-2 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-[0.98] text-black font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00FF66]/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>LOGIN & PLAY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-[#131720] hover:bg-[#1E2536] border border-[#263042] text-[#00FF66] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>1-Tap Demo Login (GamerAnshen)</span>
            </button>
          </form>
        )}

        {/* Tab 2: Clean Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-1.5 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">
                  Free Fire IGN *
                </label>
                <input
                  type="text"
                  required
                  value={ign}
                  onChange={(e) => setIgn(e.target.value)}
                  placeholder="ANSHEN⚡777"
                  className="w-full px-3 py-1.5 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">
                  FF UID (Numeric) *
                </label>
                <input
                  type="text"
                  required
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                  placeholder="1928374650"
                  className="w-full px-3 py-1.5 bg-[#131720] border border-[#263042] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className="w-full px-3 py-1.5 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3 py-1.5 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-[0.98] text-black font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00FF66]/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>CREATE ACCOUNT & START PLAYING</span>
            </button>
          </form>
        )}
      </div>

      <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-[#00FF66]" />
        <span>100% Anti-Cheat Verified • Trusted Esports Arena</span>
      </div>
    </div>
  );
};
