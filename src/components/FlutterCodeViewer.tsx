import React, { useState } from 'react';
import { FLUTTER_MAIN_DART_CODE } from '../data/flutterCode';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Layers,
  Shield,
  Smartphone
} from 'lucide-react';

export const FlutterCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'setup' | 'architecture'>('code');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(FLUTTER_MAIN_DART_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([FLUTTER_MAIN_DART_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.dart';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#0E121A] border border-[#263042] rounded-2xl overflow-hidden flex flex-col h-[780px] shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#131720] border-b border-[#1E2536]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white font-mono">lib/main.dart</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
                Single File • Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">Complete, production-ready Flutter code</p>
          </div>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#263042] text-slate-200 text-xs font-bold rounded-xl transition-colors border border-[#334155] cursor-pointer"
            title="Download main.dart file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .dart</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black text-xs font-black rounded-xl transition-all shadow-md shadow-[#00FF66]/20 cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Flutter Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#1E2536] bg-[#0A0C10] px-4">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'code'
              ? 'border-[#00FF66] text-[#00FF66]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Flutter Code (main.dart)</span>
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'setup'
              ? 'border-[#00FF66] text-[#00FF66]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Quick Setup Guide</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'border-[#00FF66] text-[#00FF66]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture & Features</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'code' && (
          <div className="p-4 bg-[#080A0E] text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
            <pre className="selection:bg-[#00FF66] selection:text-black">
              <code>{FLUTTER_MAIN_DART_CODE}</code>
            </pre>
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="p-6 max-w-2xl mx-auto space-y-6 text-sm text-slate-300">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#00FF66]" />
                How to Run AnshenWin in VS Code / Project IDX
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero third-party packages required! The code is built purely with official Flutter SDK libraries.
              </p>
            </div>

            {/* Step 1 */}
            <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00FF66]">
                <span className="w-5 h-5 rounded-full bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Create a New Flutter Project</span>
              </div>
              <p className="text-xs text-slate-400">
                Run this command in your terminal or inside Project IDX:
              </p>
              <div className="p-2.5 bg-[#0A0C10] border border-[#1E2536] rounded-lg font-mono text-xs text-[#00FF66] flex items-center justify-between">
                <span>flutter create anshenwin</span>
                <button
                  onClick={() => navigator.clipboard.writeText('flutter create anshenwin')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00FF66]">
                <span className="w-5 h-5 rounded-full bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center text-[11px]">
                  2
                </span>
                <span>Replace lib/main.dart</span>
              </div>
              <p className="text-xs text-slate-400">
                Open <code className="text-[#00FF66] font-mono">lib/main.dart</code>, delete the default boilerplate counter code, and paste the code from the code tab or download the file directly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00FF66]">
                <span className="w-5 h-5 rounded-full bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center text-[11px]">
                  3
                </span>
                <span>Launch & Run</span>
              </div>
              <p className="text-xs text-slate-400">
                Run the app on your connected Android phone, Chrome, or Android Emulator:
              </p>
              <div className="p-2.5 bg-[#0A0C10] border border-[#1E2536] rounded-lg font-mono text-xs text-[#00FF66] flex items-center justify-between">
                <span>flutter run</span>
                <button
                  onClick={() => navigator.clipboard.writeText('flutter run')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Specifications checklist */}
            <div className="p-4 bg-[#0A0C10] border border-[#1E2536] rounded-xl space-y-2 text-xs">
              <p className="font-bold text-white">✅ Verified Specifications Covered:</p>
              <ul className="space-y-1 text-slate-400">
                <li>• App Name: <strong>AnshenWin</strong> with Dark Gaming Theme</li>
                <li>• <strong>Login & Sign Up Screen:</strong> Animated Welcome & 100% Anti-Hack system active banner (clean, distraction-free)</li>
                <li>• <strong>Home Page Game Modes:</strong> 🎯 <strong>Battle Ground</strong>, ⚡ <strong>Clash Squad</strong>, and 🛡️ <strong>Survival</strong></li>
                <li>• <strong>Hourly Schedule:</strong> Hourly Tournaments (har 1 ghante me matches)</li>
                <li>• <strong>Tournament Economics:</strong> Entry Fee ₹20 • Per Kill ₹18 • Booyah (1st Rank) ₹50 🏆</li>
                <li>• <strong>Button States:</strong> New users see <strong>JOIN NOW</strong>; registered players see <strong>VIEW ROOM</strong></li>
                <li>• <strong>5-Minute Live Timer:</strong> Starts automatically <em>only</em> when Admin publishes Room ID & Password</li>
                <li>• <strong>Tournament Numbering:</strong> Starts sequentially from <strong>Match #1</strong> onwards</li>
                <li>• <strong>Protected Room Page:</strong> Dedicated inside Match Room screen unlocked <em>only</em> for joined players</li>
                <li>• <strong>Financial Transparency:</strong> Full UserProfile Transaction History passbook tracking entry fees, match winnings, deposits, and referral bonuses</li>
                <li>• <strong>Anti-Hack Security Console:</strong> Logs suspicious activities (rapid join spam, multi-device logins, emulator/PC signatures) with ban actions</li>
                <li>• <strong>Mobile-Only Experience:</strong> Real-time status bar with live ticking clock, battery %, 5G/Wi-Fi, and emulator blocked indicators</li>
                <li>• <strong>Hall of Champions (Leaderboard):</strong> Live rankings of top players by total earnings, Booyahs, and matches played</li>
                <li>• <strong>Refer & Earn Program:</strong> ₹5 cash per friend refer with unique referral code and instant claim</li>
                <li>• One-Tap Room ID & Password copy with native clipboard & SnackBar</li>
                <li>• Secret Admin Console (long press or AppBar button) to create matches across all 3 game modes & publish Room ID/Pass</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="p-6 max-w-2xl mx-auto space-y-6 text-sm text-slate-300">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00FF66]" />
                Flutter Architecture & Technical Implementation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Senior engineering patterns used in the AnshenWin single-file codebase.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl">
                <h4 className="text-xs font-bold text-[#00FF66] uppercase tracking-wider mb-1">
                  1. State Management
                </h4>
                <p className="text-xs text-slate-400">
                  Uses idiomatic <code className="text-white font-mono">StatefulWidget</code> with granular <code className="text-white font-mono">setState()</code> calls, avoiding external dependency bloat so anyone can run it instantly without complex Riverpod/Bloc setup.
                </p>
              </div>

              <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl">
                <h4 className="text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-1">
                  2. Clipboard & Haptics
                </h4>
                <p className="text-xs text-slate-400">
                  Leverages <code className="text-white font-mono">Clipboard.setData()</code> and <code className="text-white font-mono">HapticFeedback.lightImpact()</code> from Flutter's native <code className="text-white font-mono">package:flutter/services.dart</code> for authentic tactile feedback.
                </p>
              </div>

              <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  3. Secret Admin Security
                </h4>
                <p className="text-xs text-slate-400">
                  The admin console can be invoked via subtle AppBar button or a secret <code className="text-white font-mono">onLongPress</code> gesture on the title logo, keeping public gaming screens uncluttered.
                </p>
              </div>

              <div className="p-4 bg-[#131720] border border-[#263042] rounded-xl">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                  4. Form Validation
                </h4>
                <p className="text-xs text-slate-400">
                  Validates Free Fire In-Game Name (IGN) and enforces numeric length checks on Free Fire UID to ensure participants enter genuine credentials before slot assignment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
