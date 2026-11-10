import React from 'react';

interface FreeFireLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const FreeFireLogo: React.FC<FreeFireLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: { height: 'h-6', iconSize: 20, text: 'text-sm', sub: 'text-[8px]' },
    md: { height: 'h-8', iconSize: 26, text: 'text-base', sub: 'text-[9px]' },
    lg: { height: 'h-11', iconSize: 34, text: 'text-xl', sub: 'text-[10px]' },
    xl: { height: 'h-14', iconSize: 44, text: 'text-2xl', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Free Fire Iconic Stylized Wing/Dagger Fire Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={sizeClasses.iconSize}
          height={sizeClasses.iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_10px_rgba(255,102,0,0.6)]"
        >
          <defs>
            <linearGradient id="ffGoldFire" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="40%" stopColor="#FFAA00" />
              <stop offset="80%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#B30000" />
            </linearGradient>
            <linearGradient id="ffMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="ffDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0B0F19" />
            </linearGradient>
          </defs>

          {/* Shield / Crest Backing */}
          <polygon
            points="50,4 92,20 84,72 50,96 16,72 8,20"
            fill="url(#ffDark)"
            stroke="url(#ffGoldFire)"
            strokeWidth="3.5"
          />

          {/* Left Wing / Blade */}
          <path
            d="M50 20 L28 32 L36 56 L50 68 L42 46 Z"
            fill="url(#ffGoldFire)"
          />

          {/* Right Wing / Blade */}
          <path
            d="M50 20 L72 32 L64 56 L50 68 L58 46 Z"
            fill="url(#ffGoldFire)"
          />

          {/* Center Vertical Fire Blade */}
          <polygon
            points="50,12 55,42 50,78 45,42"
            fill="url(#ffMetal)"
          />

          {/* Center "FF" stylized typography inside crest */}
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Impact, sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="-1"
            className="select-none"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 8px #FF6600',
            }}
          >
            FF
          </text>
        </svg>
      </div>

      {/* Free Fire Esports Title */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`${sizeClasses.text} font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFF59D] via-[#FFB703] to-[#FB8500]`}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '0 0 16px rgba(255, 183, 3, 0.4)',
              letterSpacing: '0.08em',
            }}
          >
            FREE FIRE
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#FF4500]/20 border border-[#FF4500]/50 text-[#FFAA00] font-mono text-[9px] font-black tracking-widest uppercase">
            MAX
          </span>
        </div>
        {showSubtitle && (
          <span className={`${sizeClasses.sub} text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1`}>
            <span>Official Tournament</span>
            <span className="text-[#FFB703]">•</span>
            <span className="text-emerald-400 font-mono">Custom Room</span>
          </span>
        )}
      </div>
    </div>
  );
};

export const FreeFireMatchCardBadge: React.FC<{
  gameMode?: string;
  map?: string;
}> = ({ gameMode = 'Battle Ground', map = 'Bermuda' }) => {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#1B130E] border border-[#FF6600]/40 text-[#FFAA00] text-[10px] font-black tracking-wide uppercase">
      {/* Mini FF Icon */}
      <svg width="12" height="12" viewBox="0 0 100 100" fill="none">
        <polygon
          points="50,5 92,20 84,72 50,95 16,72 8,20"
          fill="#FF4500"
          stroke="#FFF"
          strokeWidth="6"
        />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="#FFF"
          fontFamily="Impact, sans-serif"
          fontWeight="900"
          fontSize="45"
        >
          FF
        </text>
      </svg>
      <span className="text-[#FFF275]">{gameMode.toUpperCase()}</span>
      <span className="text-[#FF6600]">•</span>
      <span className="text-slate-300 font-mono text-[9px]">{map.toUpperCase()}</span>
    </div>
  );
};

export const FreeFireBooyahBadge: React.FC<{ amount: number }> = ({ amount }) => {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-black shadow-sm">
      <span className="text-sm">🏆</span>
      <span className="tracking-wider uppercase text-[11px] font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
        BOOYAH!
      </span>
      <span className="text-[#00FF66] font-bold">₹{amount}</span>
    </div>
  );
};
