import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Layers,
  Zap,
  ShieldCheck,
  FileCode,
  Cloud,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { FLUTTER_MAIN_DART_CODE } from '../data/flutterCode';

interface ApkBuildModalProps {
  onClose: () => void;
}

const GITHUB_ACTIONS_APK_YAML = `name: Build AnshenWin Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-android-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Java JDK 21 for Android Gradle
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Install Dependencies & Build Web App
        run: |
          npm install
          npm run build

      - name: Wrap with Capacitor Android
        run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android
          npx cap init AnshenWin com.anshenwin.esports --web-dir dist || true
          npx cap add android
          npx cap sync android

      - name: Compile Signed Debug APK via Gradle
        working-directory: ./android
        run: |
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Upload Ready-to-Install AnshenWin APK
        uses: actions/upload-artifact@v4
        with:
          name: AnshenWin-Android-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
`;

export const ApkBuildModal: React.FC<ApkBuildModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'flutlab' | 'webintoapp' | 'github_cloud' | 'pc_offline'>('flutlab');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const currentUrl = window.location.href.split('?')[0];
  const isPrivatePreviewUrl = currentUrl.includes('ais-pre-');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#131720] border-t sm:border border-[#2E384D] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2536] bg-[#0E121A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/25">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">AnshenWin Non-PWA Android APK Builder Guide</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                PWA ke bina 100% kaam karne wale 4 asli tarike · Online Browser, Cloud &amp; PC Offline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E2536] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why PWA Failed Diagnostic Banner */}
        <div className="px-6 py-3 bg-amber-950/30 border-b border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300">PWABuilder kyun fail hua?</strong> AI Studio ka preview link (<code className="text-amber-300">ais-pre-...</code>) private session protected hota hai aur PWABuilder ko Service Worker chahiye hota hai. Niche diye gaye <strong>Bina-PWA wale 4 tarike</strong> 100% kaam karte hain!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E2536] bg-[#0A0C10] px-4 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('flutlab')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'flutlab'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1. FlutLab Online (No PC · Direct APK)</span>
          </button>
          <button
            onClick={() => setActiveTab('webintoapp')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'webintoapp'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. WebIntoApp (Bina PWA · URL to APK)</span>
          </button>
          <button
            onClick={() => setActiveTab('github_cloud')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github_cloud'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>3. GitHub Auto-APK (Free Cloud Build)</span>
          </button>
          <button
            onClick={() => setActiveTab('pc_offline')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pc_offline'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Windows PC Offline (Website 2 APK / CLI)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          {/* TAB 1: FLUTLAB.IO ONLINE CLOUD FLUTTER APK */}
          {activeTab === 'flutlab' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0E1618] border border-[#00FF66]/30 rounded-xl">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#00FF66]" />
                  Tariqa 1: FlutLab.io se Browser me Real Native APK Banayein (Sabse Best — Bina URL, Bina PC!)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Kyunki AnshenWin ka poora standalone <code className="text-[#00FF66]">main.dart</code> code ready hai, aap bina kuch install kiye seedha Chrome browser me <strong>FlutLab.io</strong> par paste karke 100% offline chalne wala asli Android APK download kar sakte hain!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#00FF66]">Step 1: AnshenWin ka Ready Code Copy ya Download Karein</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(FLUTTER_MAIN_DART_CODE, 'dartCode')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#283248] text-xs font-bold rounded-lg text-white cursor-pointer transition-colors"
                      >
                        {copiedText === 'dartCode' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'dartCode' ? 'Copied Full Code!' : 'Copy main.dart'}</span>
                      </button>
                      <button
                        onClick={() => handleDownloadFile(FLUTTER_MAIN_DART_CODE, 'main.dart')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-xs font-black rounded-lg text-black cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download main.dart</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Is single file me Login, Battle Ground, Clash Squad, Survival, Room ID Auto-Copy aur Admin Panel sab kuch included hai (koi external package nahi chahiye).
                  </p>
                </div>

                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-[#00FF66]">Step 2: FlutLab.io Kholein (Free Online Flutter APK Builder)</span>
                  <p className="text-xs text-slate-300">
                    Niche button dabayein aur Google account se free sign-in karke <strong>+ New Project &rarr; Code Base: Stateless Hello World</strong> chunein aur naam <code className="text-[#00FF66]">anshenwin</code> rakhein:
                  </p>
                  <a
                    href="https://flutlab.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black font-black text-xs rounded-lg transition-all"
                  >
                    <span>Open FlutLab.io Online Builder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#00FF66]">Step 3: Paste &amp; Download Android APK (2 Minutes)</span>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Project khulne par left folder me <code className="text-[#00FF66]">lib/main.dart</code> par click karein.</li>
                    <li>Usme pehle se likha sara code select karke delete karein aur apna <strong>Copied main.dart</strong> paste kar dein (Ctrl+V).</li>
                    <li>Top bar me <strong>Settings/Gear icon</strong> par click karke Build Target me <strong>android-apk (arm64 / universal)</strong> select karein.</li>
                    <li>Top-left me <strong>Build Project (Hammer Icon)</strong> dabayein — 2 minute me niche <strong>Download APK</strong> link aa jayega!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBINTOAPP (NON-PWA WEBVIEW APK) */}
          {activeTab === 'webintoapp' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#101726] border border-[#2B3B55] rounded-xl">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00FF66]" />
                  Tariqa 2: WebIntoApp.com se Bina PWA ke Direct WebView APK Banayein
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <strong>WebIntoApp</strong> ko PWABuilder ki tarah manifest ya service worker nahi chahiye! Bas aapka link <strong>Public</strong> hona chahiye.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#00FF66]">Step 1: App ka Public Link Banayein (Zaroori Step!)</span>
                  {isPrivatePreviewUrl && (
                    <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/25 rounded-lg p-2.5">
                      Dhyan dein: Abhi aapka URL (<code className="font-mono">ais-pre-...</code>) private preview link hai. Isko direct mat daalein, pehle niche ke 1 click se Public karein:
                    </p>
                  )}
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>
                      <strong>Option A (AI Studio Deploy):</strong> Top-right corner me <strong>Deploy / Share &rarr; Deploy to Cloud Run</strong> button dabayein aur wahan se milne wala <strong>Public App URL</strong> copy karein.
                    </li>
                    <li>
                      <strong>Option B (Netlify Free Drag &amp; Drop):</strong> Project ko PC par <code className="text-[#00FF66]">npm run build</code> karein aur <code className="text-[#00FF66]">dist</code> folder ko <strong>app.netlify.com/drop</strong> par drop karke instant public link le lein.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-[#00FF66]">Step 2: WebIntoApp.com par Public URL Paste Karein</span>
                  <p className="text-xs text-slate-300">
                    WebIntoApp kholein, apna Public URL daalein, App Name <strong>AnshenWin</strong> rakhein aur <strong>Make App (Free Dedicated Android APK)</strong> par click karein:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href="https://www.webintoapp.com/app-maker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#00FF66] hover:bg-[#00FF66]/90 text-black font-black text-xs rounded-lg transition-all"
                    >
                      <span>Open WebIntoApp Maker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://median.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2536] hover:bg-[#283248] text-white font-bold text-xs rounded-lg transition-all"
                    >
                      <span>Alternative: Median.co</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-[#00FF66]">Step 3: Extract ZIP &amp; Install APK</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Download hui ZIP file ko phone ya PC me extract karein &rarr; <code className="text-[#00FF66]">android/app-release.apk</code> milega jise aap WhatsApp ya Telegram par apne sabhi Free Fire players ko share kar sakte hain!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB ACTIONS CLOUD APK */}
          {activeTab === 'github_cloud' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#101726] border border-[#2B3B55] rounded-xl">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#00FF66]" />
                  Tariqa 3: GitHub Actions se Automatic Cloud APK Banayein (Bina Android Studio Install Kiye!)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Yeh poora React + Tournament Analyst app GitHub ke free cloud server par Capacitor ke zariye compile hokar aapko ready <code className="text-[#00FF66]">app-debug.apk</code> de dega. PC me 10GB Android Studio dalne ki zaroorat nahi!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#00FF66]">Step 1: Ready Cloud Workflow File Download Karein</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(GITHUB_ACTIONS_APK_YAML, 'ghYaml')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#283248] text-xs font-bold rounded-lg text-white cursor-pointer"
                      >
                        {copiedText === 'ghYaml' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'ghYaml' ? 'Copied YAML!' : 'Copy YAML'}</span>
                      </button>
                      <button
                        onClick={() => handleDownloadFile(GITHUB_ACTIONS_APK_YAML, 'build-apk.yml')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-xs font-black rounded-lg text-black cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download build-apk.yml</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#0E121A] border border-[#1E2536] rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#00FF66]">Step 2: GitHub par Push Karein &amp; APK Download Karein</span>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>AI Studio ke top menu se project ko <strong>GitHub par Export / Sync</strong> karein (ya ZIP download karke GitHub repo me upload karein).</li>
                    <li>GitHub repo me <strong>Add file &rarr; Create new file</strong> par click karein aur file ka naam <code className="text-[#00FF66]">.github/workflows/build-apk.yml</code> likh kar upar wala YAML paste karke Commit kar dein.</li>
                    <li>Ab repo ke <strong>Actions</strong> tab me jayein &rarr; <strong>Build AnshenWin Android APK</strong> chalega aur 3 minute me niche <strong>Artifacts</strong> section me <code className="text-[#00FF66]">AnshenWin-Android-APK</code> download ke liye mil jayega!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WINDOWS PC OFFLINE APK */}
          {activeTab === 'pc_offline' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#101726] border border-[#2B3B55] rounded-xl">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00FF66]" />
                  Tariqa 4: Windows PC par Offline HTML Folder se Direct APK (Website 2 APK / Capacitor)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Agar aapke paas Windows PC/Laptop hai, toh bina kisi live link ya PWA ke aap seedha <code className="text-[#00FF66]">dist</code> folder se 100% offline APK bana sakte hain.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#0A0D14] border border-[#1E2536] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#00FF66]">
                    <span>Option A: Website 2 APK Builder Software (Bina Android Studio)</span>
                    <button
                      onClick={() => handleCopy('npm install\nnpm run build', 'pcBuild')}
                      className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedText === 'pcBuild' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>AI Studio se <strong>Download ZIP</strong> karein aur PC par extract karein.</li>
                    <li>Folder me CMD/Terminal khol kar run karein: <code className="text-emerald-400 font-mono">npm install &amp;&amp; npm run build</code> (isse <code className="text-[#00FF66]">dist</code> folder ban jayega).</li>
                    <li>Windows par <strong>Website 2 APK Builder</strong> open karein &rarr; <strong>Local HTML Website</strong> select karein &rarr; <code className="text-[#00FF66]">dist</code> folder chunein &rarr; <strong>Generate APK</strong> dabayein!</li>
                  </ol>
                </div>

                <div className="p-4 bg-[#0A0D14] border border-[#1E2536] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#00FF66]">
                    <span>Option B: Capacitor + Gradle Command Line</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          'npm install\nnpm run build\nnpm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init AnshenWin com.anshenwin.esports --web-dir dist\nnpx cap add android\ncd android && gradlew assembleDebug',
                          'capCli'
                        )
                      }
                      className="flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedText === 'capCli' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Commands</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#05070A] rounded-lg text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto">
{`npm install && npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init AnshenWin com.anshenwin.esports --web-dir dist
npx cap add android
cd android && gradlew assembleDebug`}
                  </pre>
                  <p className="text-xs text-slate-400">
                    APK ready milega: <code className="text-yellow-300 font-mono">android/app/build/outputs/apk/debug/app-debug.apk</code>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1E2536] bg-[#0A0C10] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
            <span>Support: WhatsApp 9569167476 · anshengaming@gmail.com</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E2536] hover:bg-[#263042] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
