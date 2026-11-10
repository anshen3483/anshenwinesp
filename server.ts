import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import type { Content, GenerateContentResponse } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

interface AnalystChatRequestBody {
  message?: string;
  history?: ChatHistoryItem[];
  roleMode?: 'analyst' | 'fast_helper';
  tournamentContext?: string;
}

function getGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildSystemInstruction(roleMode: 'analyst' | 'fast_helper', tournamentContext?: string): string {
  const baseAppFacts = `
App Name: AnshenWin (Free Fire Max Mobile-Only Esports Tournament App)
Official Support: WhatsApp 9569167476 | Email: anshengaming@gmail.com | YouTube: https://youtube.com/@anshengaming
Tournament Formats & Exact Economics:
1. Battle Ground Solo: Entry ₹20 | Per Kill ₹18 | Booyah (Rank #1) ₹50 (2 kills alone = ₹36 return = +80% ROI!).
2. Clash Squad (1v1 / Squad): Entry ₹50 | Winner Payout ₹85 (₹15 platform fee).
3. Survival 20-Player Pool: Entry ₹35 | 1st Booyah: ₹150, 2nd: ₹90, 3rd: ₹65, 4th: ₹55, 5th & 6th: ₹50 each, 7th to 10th: ₹35 each (breakeven!), Rank 11-20: ₹0 (Better luck try next time).
Room Rules:
- Room ID & Password release 10-15 minutes before match start.
- Once released, a strict 5-minute countdown starts; match starts immediately after 5 minutes.
- Players can tap directly on Room ID or Password cards to auto-copy with flash confirmation and sit in ANY available slot.
- Mobile-only (Emulators/PC strictly blocked by Anti-Cheat). Screenshot of Rank & Kills after match ensures 15-30 min payout.
Non-PWA Step-by-Step APK Building Options for AnshenWin (PWABuilder fails on private ais-pre preview URLs and requires service workers, so recommend these 4 working non-PWA methods):
1. FlutLab.io Online Cloud Builder (Best, Zero PC Install, No URL needed): Click 'Download .dart' / 'Copy main.dart' in AnshenWin -> Open https://flutlab.io -> Create blank Flutter project -> Paste into lib/main.dart -> Select Build Target 'android-apk' -> Click Build Project -> Download real native Android .apk in 2 mins!
2. WebIntoApp.com (No PWA needed, URL-to-APK): First click 'Deploy' in AI Studio (Deploy to Cloud Run) or drop 'dist' folder on Netlify Drop to get a PUBLIC URL (do not use private ais-pre link) -> Paste public URL on https://www.webintoapp.com/app-maker -> Name 'AnshenWin' -> Click Make App -> Download Android APK.
3. GitHub Actions Automatic Cloud APK: Export project to GitHub -> Add '.github/workflows/build-apk.yml' (downloadable from APK Guide button) -> GitHub cloud builds Capacitor + Gradle automatically -> Download 'AnshenWin-Android-APK' from Actions Artifacts.
4. Windows PC Offline APK (Website 2 APK Builder / Capacitor): Download project ZIP -> run 'npm install && npm run build' -> Open Website 2 APK Builder -> choose 'Local HTML Website' -> select 'dist' folder -> Generate offline APK (or run 'npx cap add android' + 'gradlew assembleDebug').
`;

  const liveSnapshot = tournamentContext
    ? `\nLive Tournament & Player Snapshot:\n${tournamentContext}\n`
    : '';

  if (roleMode === 'fast_helper') {
    return `You are the AnshenWin Fast Match & APK Support Assistant.
Give concise, clear, friendly answers in Hinglish (Hindi + English mix) or English matching the user's language.
Specialize in quick tournament rules, Room ID copy/joining help, UPI deposit/withdrawal support, and clear numbered step-by-step Android APK creation guides.
Keep answers scannable with short bullet points under 160 words unless the user asks for full detail.
${baseAppFacts}${liveSnapshot}`;
  }

  return `You are the AnshenWin Pro Esports Tournament Analyst & Strategy Coach for Free Fire Max.
Your role is to analyze live tournament economics, player performance metrics (Win Rate, K/D, Net ROI, Entry vs Winnings), map rotation tactics (Bermuda, Purgatory, Kalahari, Alpine), weapon loadouts (M1887, MP40, Woodpecker, AWM), and advise players on which tournament format maximizes their expected cash profit.
Respond naturally in Hinglish (Hindi + English) or English matching the user's tone. Use crisp bullet points, concrete math/ROI numbers from the live snapshot, and actionable pro tips. Keep responses focused and under 240 words unless deep breakdown is requested.
${baseAppFacts}${liveSnapshot}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/analyst/chat', async (req: Request, res: Response) => {
    try {
      const {
        message,
        history = [],
        roleMode = 'analyst',
        tournamentContext,
      } = (req.body || {}) as AnalystChatRequestBody;

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please enter a valid message.' });
        return;
      }

      const ai = getGenAIClient();
      const selectedModel = roleMode === 'fast_helper' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';
      const systemInstruction = buildSystemInstruction(roleMode, tournamentContext);

      const formattedHistory: Content[] = Array.isArray(history)
        ? history
            .filter(
              (item): item is ChatHistoryItem =>
                Boolean(item) &&
                (item.role === 'user' || item.role === 'model') &&
                typeof item.text === 'string' &&
                item.text.trim().length > 0
            )
            .map((item) => ({
              role: item.role,
              parts: [{ text: item.text }],
            }))
        : [];

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction,
        },
      });

      const response: GenerateContentResponse = await chat.sendMessage({
        message: message.trim(),
      });

      res.status(200).json({
        reply: response.text || 'No response generated. Please try again.',
        model: selectedModel,
      });
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      console.error('Gemini Analyst Chat Error:', errMessage);

      if (errMessage.includes('PERMISSION_DENIED') || errMessage.includes('API_KEY_INVALID') || errMessage.includes('403')) {
        res.status(403).json({
          error: 'Gemini API key issue detected. Please check your API key in the Settings > Secrets panel.',
        });
        return;
      }

      if (errMessage.includes('RESOURCE_EXHAUSTED') || errMessage.includes('429')) {
        res.status(429).json({
          error: 'Rate limit reached on current quota. Please retry in a few seconds or select a billing-enabled key in Settings > Secrets.',
        });
        return;
      }

      res.status(500).json({
        error: `Analyst service error: ${errMessage}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnshenWin Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
