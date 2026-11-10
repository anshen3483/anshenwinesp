import React from 'react';

interface AnshenWinLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  onClick?: () => void;
}

export const AnshenWinLogo: React.FC<AnshenWinLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'FREE FIRE TOURNAMENTS',
  className = '',
  onClick,
}) => {
  const sizeConfig = {
    sm: {
      textAnshen: 'text-base font-black',
      textWin: 'text-base font-black',
      flameSize: 18,
      subText: 'text-[8px]',
      gap: 'gap-1.5',
      badgePad: 'px-1.5 py-0.2',
    },
    md: {
      textAnshen: 'text-xl font-black',
      textWin: 'text-xl font-black',
      flameSize: 22,
      subText: 'text-[9px]',
      gap: 'gap-2',
      badgePad: 'px-2 py-0.5',
    },
    lg: {
      textAnshen: 'text-2xl font-black sm:text-3xl',
      textWin: 'text-2xl font-black sm:text-3xl',
      flameSize: 30,
      subText: 'text-[10px] sm:text-xs',
      gap: 'gap-2.5',
      badgePad: 'px-2.5 py-0.5',
    },
    xl: {
      textAnshen: 'text-3xl font-black sm:text-4xl',
      textWin: 'text-3xl font-black sm:text-4xl',
      flameSize: 38,
      subText: 'text-xs sm:text-sm',
      gap: 'gap-3',
      badgePad: 'px-3 py-1',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${sizeConfig.gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Animated Free Fire Flame Icon with Multi-Color Aura */}
      <div className="relative shrink-0 flex items-center justify-center animate-flame-flicker">
        {/* Glow halo behind flame */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF5500] via-[#FFAA00] to-[#00FF66] blur-md opacity-75 animate-pulse-glow pointer-events-none"></div>

        {/* Scalable Vector Flame with Free Fire Stylized Shards */}
        <svg
          width={sizeConfig.flameSize}
          height={sizeConfig.flameSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_0_8px_rgba(255,102,0,0.8)]"
        >
          <defs>
            <linearGradient id="anshenFlameGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1E00" />
              <stop offset="45%" stopColor="#FF9900" />
              <stop offset="85%" stopColor="#FFF275" />
              <stop offset="100%" stopColor="#00FF66" />
            </linearGradient>
            <linearGradient id="anshenFlameGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#B30000" />
              <stop offset="50%" stopColor="#FF5500" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <linearGradient id="anshenInnerFlame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFAA00" />
              <stop offset="50%" stopColor="#FFF275" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Outer Fire Wings */}
          <path
            d="M50 5 C54 22 68 28 78 40 C90 54 92 72 78 86 C68 96 48 98 34 92 C18 84 10 66 18 48 C22 38 28 32 30 22 C34 32 40 36 44 32 C50 25 46 14 50 5 Z"
            fill="url(#anshenFlameGrad1)"
          />

          {/* Secondary Shard Flame */}
          <path
            d="M50 18 C56 30 68 36 72 50 C76 64 68 76 56 82 C44 88 32 82 28 72 C24 60 30 52 38 46 C42 42 46 36 46 28 C48 24 50 20 50 18 Z"
            fill="url(#anshenFlameGrad2)"
          />

          {/* Inner Core Bright Fire Flare */}
          <path
            d="M50 36 C54 44 60 50 60 60 C60 70 54 76 48 76 C42 76 38 70 40 62 C42 54 46 48 50 36 Z"
            fill="url(#anshenInnerFlame)"
          />

          {/* Tiny Sparkle Star in Flame */}
          <polygon
            points="50,44 52,50 58,52 52,54 50,60 48,54 42,52 48,50"
            fill="#FFFFFF"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Animated Brand Name: ANSHEN + WIN */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-tight">
          {/* ANSHEN in Crisp Metallic Silver/White */}
          <span
            className={`${sizeConfig.textAnshen} tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 font-extrabold uppercase`}
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 12px rgba(255,255,255,0.25)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            ANSHEN
          </span>

          {/* WIN with Dynamic Animated Shimmer & Neon Flame Glow */}
          <span
            className={`${sizeConfig.textWin} ml-0.5 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] via-[#FFF275] to-[#FF6600] font-black uppercase animate-anshen-shimmer animate-fire-glow`}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.06em',
            }}
          >
            WIN
          </span>

          {/* Sparkle Flame Badge */}
          <span className="ml-1 text-sm animate-bounce" role="img" aria-label="fire">
            🔥
          </span>
        </div>

        {/* Free Fire Subtitle with Live Indicator */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`${sizeConfig.subText} font-black uppercase tracking-widest text-[#FFAA00] flex items-center gap-1`}
              style={{
                letterSpacing: '0.12em',
                textShadow: '0 0 8px rgba(255,170,0,0.4)',
              }}
            >
              <span>{subtitleText}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-ping inline-block"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
