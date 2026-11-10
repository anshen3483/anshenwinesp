import { TournamentMatch } from '../types';

export interface PrizeBreakdownItem {
  rankLabel: string;
  rankNumMin: number;
  rankNumMax: number;
  prize: number;
  note?: string;
}

/**
 * Calculates payout for a player based on match mode, rank, and kills
 */
export function calculateMatchPayout(
  match: TournamentMatch,
  rank: number,
  kills: number = 0
): { prize: number; isWinner: boolean; note?: string } {
  // 1. SURVIVAL 20-PLAYERS TOURNAMENT (Entry: ₹35, 20 players)
  if (
    match.gameMode === 'Survival' ||
    match.title.toLowerCase().includes('survival') ||
    match.entryFee === 35
  ) {
    let rankPrize = 0;
    let note = '';

    if (rank === 1) {
      rankPrize = 150;
      note = 'Booyah Champion 🏆';
    } else if (rank === 2) {
      rankPrize = 90;
      note = '2nd Place Prize 🥈';
    } else if (rank === 3) {
      rankPrize = 65;
      note = '3rd Place Prize 🥉';
    } else if (rank === 4) {
      rankPrize = 55;
      note = '4th Place Prize';
    } else if (rank === 5 || rank === 6) {
      rankPrize = 50;
      note = `${rank}th Place Prize`;
    } else if (rank >= 7 && rank <= 10) {
      rankPrize = 35;
      note = 'Top 10 Cash Back (Entry returned)';
    } else {
      rankPrize = 0;
      note = 'Better luck try next time';
    }

    const killBonus = kills * (match.perKill || 0);
    return {
      prize: rankPrize + killBonus,
      isWinner: rankPrize > 0,
      note,
    };
  }

  // 2. CLASH SQUAD (Entry: ₹50, Winner: ₹85, Platform Profit: ₹15)
  if (
    match.gameMode === 'Clash Squad' ||
    match.title.toLowerCase().includes('clash squad') ||
    match.entryFee === 50
  ) {
    if (rank === 1) {
      return {
        prize: match.booyahPrize || 85,
        isWinner: true,
        note: 'CS Winner Booyah (+₹85)',
      };
    }
    return {
      prize: 0,
      isWinner: false,
      note: 'Runner Up - Better luck try next time',
    };
  }

  // 3. STANDARD BATTLE GROUND SOLO (Booyah + Per Kill Bounty)
  const booyahReward = rank === 1 ? (match.booyahPrize || 50) : 0;
  const killReward = kills * (match.perKill || 18);
  const total = booyahReward + killReward;

  return {
    prize: total,
    isWinner: total > 0,
    note: rank === 1 ? 'Booyah + Kills' : kills > 0 ? `${kills} Kills Bounty` : 'Better luck next time',
  };
}

/**
 * Returns formatted prize distribution list for display in match cards and details
 */
export function getMatchPrizeBreakdown(match: TournamentMatch): PrizeBreakdownItem[] {
  // Survival 20-Players
  if (
    match.gameMode === 'Survival' ||
    match.title.toLowerCase().includes('survival') ||
    match.entryFee === 35
  ) {
    return [
      { rankLabel: '1st (Booyah)', rankNumMin: 1, rankNumMax: 1, prize: 150, note: 'Champion 🏆' },
      { rankLabel: '2nd Place', rankNumMin: 2, rankNumMax: 2, prize: 90, note: 'Runner Up 🥈' },
      { rankLabel: '3rd Place', rankNumMin: 3, rankNumMax: 3, prize: 65, note: 'Top 3 🥉' },
      { rankLabel: '4th Place', rankNumMin: 4, rankNumMax: 4, prize: 55 },
      { rankLabel: '5th - 6th', rankNumMin: 5, rankNumMax: 6, prize: 50 },
      { rankLabel: '7th - 10th', rankNumMin: 7, rankNumMax: 10, prize: 35, note: 'Entry Returned' },
      { rankLabel: '11th - 20th', rankNumMin: 11, rankNumMax: 20, prize: 0, note: 'Better luck next time' },
    ];
  }

  // Clash Squad
  if (
    match.gameMode === 'Clash Squad' ||
    match.title.toLowerCase().includes('clash squad') ||
    match.entryFee === 50
  ) {
    return [
      { rankLabel: 'Winner (Booyah)', rankNumMin: 1, rankNumMax: 1, prize: 85, note: '₹85 Cash Payout (₹15 Profit)' },
      { rankLabel: 'Opponent', rankNumMin: 2, rankNumMax: 2, prize: 0, note: 'Better luck next time' },
    ];
  }

  // Standard Battle Ground
  return [
    { rankLabel: '1st (Booyah)', rankNumMin: 1, rankNumMax: 1, prize: match.booyahPrize || 50, note: 'Champion 🏆' },
    { rankLabel: 'Each Kill Bounty', rankNumMin: 1, rankNumMax: match.maxSlots, prize: match.perKill || 18, note: 'Per Kill' },
  ];
}
