import React, { useState } from 'react';
import { UserProfile, WalletTransaction, TournamentMatch } from '../types';
import { 
  X, 
  User, 
  Zap, 
  Wallet, 
  Trophy, 
  Crosshair, 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  Check, 
  TrendingUp, 
  Coins, 
  ShieldAlert,
  Sliders,
  Download,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Gamepad2,
  Crown,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface ProfileModalProps {
  userProfile: UserProfile;
  matches: TournamentMatch[];
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onAddFunds: (amount: number) => void;
  onWithdrawFunds?: (amount: number, upiId: string) => void;
  onLogout: () => void;
  onOpenRulesModal?: () => void;
  onOpenFaqModal?: () => void;
  initialTab?: 'passbook' | 'banking' | 'tournaments' | 'overview';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  matches,
  onClose,
  onUpdateProfile,
  onAddFunds,
  onWithdrawFunds,
  onLogout,
  onOpenRulesModal,
  onOpenFaqModal,
  initialTab = 'passbook',
}) => {
  const [activeTab, setActiveTab] = useState<'passbook' | 'banking' | 'tournaments' | 'overview'>(initialTab);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'winnings' | 'deductions' | 'deposits_withdrawals'>('all');
  
  // Banking (Deposit & Withdrawal) state
  const [bankingMode, setBankingMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('50');
  const [withdrawUpiId, setWithdrawUpiId] = useState<string>(userProfile.upiId || `${userProfile.phone?.replace(/\D/g, '') || '9876543210'}@paytm`);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  // Profile Form state
  const [ign, setIgn] = useState(userProfile.ign);
  const [uid, setUid] = useState(userProfile.uid);
  const [isSaved, setIsSaved] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const transactions = userProfile.transactions || [];

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (transactionFilter === 'winnings') return t.type === 'winning';
    if (transactionFilter === 'deductions') return t.type === 'entry_fee';
    if (transactionFilter === 'deposits_withdrawals') return t.type === 'deposit' || t.type === 'withdrawal';
    return true;
  });

  // Calculate financial transparency totals
  const totalWinnings = transactions
    .filter((t) => t.type === 'winning')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeductions = transactions
    .filter((t) => t.type === 'entry_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalReferralRewards = transactions
    .filter((t) => t.type === 'referral')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposited = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = transactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Derive Tournament History for this player from matches list
  const userTournaments = matches.filter((m) =>
    m.participants.some((p) => p.uid === userProfile.uid)
  );

  // CSV Statement Generator for accounting
  const handleDownloadCSV = () => {
    const headers = [
      'Transaction ID',
      'Date & Time',
      'Transaction Type',
      'Title',
      'Description',
      'Amount (INR)',
      'Balance After (INR)',
      'Status',
      'Reference / Match ID',
    ];

    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.type.toUpperCase()}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount > 0 ? `+${t.amount}` : `${t.amount}`,
      t.balanceAfter,
      `"${t.status || 'SUCCESS'}"`,
      `"${t.orderId || t.matchId || t.payoutUpi || '-'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# AnshenWin Free Fire Tournaments - Financial Statement`,
        `# Player: ${userProfile.name} (IGN: ${userProfile.ign} | UID: ${userProfile.uid})`,
        `# Current Wallet Balance: INR ${userProfile.walletBalance}`,
        `# Statement Generated: ${new Date().toLocaleString('en-IN')}`,
        headers.join(','),
        ...rows.map((e) => e.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `AnshenWin_Statement_${userProfile.ign}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('Statement downloaded as CSV report!');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    const amountNum = parseFloat(withdrawAmount);

    if (isNaN(amountNum) || amountNum < 50) {
      setWithdrawError('Minimum withdrawal amount is ₹50.');
      return;
    }

    if (amountNum > userProfile.walletBalance) {
      setWithdrawError(`Insufficient wallet balance. You have ₹${userProfile.walletBalance}.`);
      return;
    }

    if (!withdrawUpiId.trim() || !withdrawUpiId.includes('@')) {
      setWithdrawError('Please enter a valid UPI ID (e.g., gamer@paytm or yourname@okhdfcbank).');
      return;
    }

    if (onWithdrawFunds) {
      onWithdrawFunds(amountNum, withdrawUpiId.trim());
      setWithdrawSuccess(`₹${amountNum} successfully transferred to ${withdrawUpiId}!`);
      setTimeout(() => setWithdrawSuccess(null), 3500);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ ign: ign.trim(), uid: uid.trim(), upiId: withdrawUpiId.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-[#131720] border-t border-x border-[#2E384D] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottom-Sheet Drag Handle */}
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#1E2536] bg-[#0E121A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Wallet, Banking &amp; Account</h3>
              <p className="text-[11px] text-slate-400">UPI Deposit, Withdrawal, Passbook &amp; App Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-[#1E2536] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E2536] bg-[#0A0C10] px-4 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('passbook')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'passbook'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Passbook & Statement ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'banking'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Deposit & Withdrawal 💳</span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tournaments'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Tournament History ({userTournaments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile & Account</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick Balance Banner */}
          <div className="p-4 bg-gradient-to-r from-[#0C1710] to-[#111927] border border-[#00FF66]/30 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00FF66]/15 border border-[#00FF66]/40 flex items-center justify-center text-[#00FF66]">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Total Wallet Balance
                </span>
                <p className="text-2xl font-black text-white">
                  ₹{userProfile.walletBalance}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('banking');
                  setBankingMode('deposit');
                }}
                className="px-3 py-1.5 text-xs font-black text-black bg-[#00FF66] hover:bg-[#00FF66]/90 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <ArrowDownCircle className="w-3.5 h-3.5 text-black" />
                <span>Deposit</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('banking');
                  setBankingMode('withdraw');
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#1E2536] hover:bg-[#263042] border border-[#334155] rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PASSBOOK & CSV STATEMENT DOWNLOAD */}
          {activeTab === 'passbook' && (
            <div className="space-y-3">
              {/* Actions Header: Download Statement CSV */}
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Financial Passbook
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Transparent accounting of all deposits, deductions, payouts & withdrawals
                  </p>
                </div>

                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1E2536] hover:bg-[#263042] border border-[#00FF66]/40 text-[#00FF66] rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
                  title="Export accounting CSV statement"
                >
                  <Download className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>Download Statement (.CSV)</span>
                </button>
              </div>

              {downloadNotice && (
                <div className="p-2.5 bg-[#00FF66]/15 border border-[#00FF66]/40 rounded-xl text-xs font-bold text-[#00FF66] flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{downloadNotice}</span>
                </div>
              )}

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 bg-[#0A0D14] border border-[#263042] rounded-xl text-center">
                  <p className="text-[9px] text-slate-400 uppercase font-medium">Winnings</p>
                  <p className="text-xs font-black text-[#00FF66] mt-0.5">+₹{totalWinnings}</p>
                </div>
                <div className="p-2.5 bg-[#0A0D14] border border-[#263042] rounded-xl text-center">
                  <p className="text-[9px] text-slate-400 uppercase font-medium">Entry Fees</p>
                  <p className="text-xs font-black text-rose-400 mt-0.5">-₹{totalDeductions}</p>
                </div>
                <div className="p-2.5 bg-[#0A0D14] border border-[#263042] rounded-xl text-center">
                  <p className="text-[9px] text-slate-400 uppercase font-medium">Deposited</p>
                  <p className="text-xs font-black text-sky-400 mt-0.5">+₹{totalDeposited}</p>
                </div>
                <div className="p-2.5 bg-[#0A0D14] border border-[#263042] rounded-xl text-center">
                  <p className="text-[9px] text-slate-400 uppercase font-medium">Withdrawn</p>
                  <p className="text-xs font-black text-amber-400 mt-0.5">-₹{totalWithdrawn}</p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">Filter:</span>
                <div className="flex items-center gap-1 bg-[#0A0C10] p-1 rounded-xl border border-[#1E2536] shrink-0">
                  {(['all', 'winnings', 'deductions', 'deposits_withdrawals'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTransactionFilter(filter)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        transactionFilter === filter
                          ? 'bg-[#00FF66] text-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter === 'all'
                        ? `All (${transactions.length})`
                        : filter === 'winnings'
                        ? 'Winnings'
                        : filter === 'deductions'
                        ? 'Entry Fees'
                        : 'Deposit / Payouts'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center bg-[#0A0D14] border border-[#263042] rounded-xl text-xs text-slate-400 space-y-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-500 mx-auto opacity-40" />
                    <p className="font-semibold text-slate-300">No transactions recorded yet.</p>
                    <p className="text-[10px] text-slate-500">
                      Join a tournament or recharge via Cashfree PG to see transactions here.
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isCredit = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        className="p-3 bg-[#0A0D14] border border-[#263042] rounded-xl flex items-center justify-between transition-colors hover:border-slate-600"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              tx.type === 'withdrawal'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : isCredit
                                ? 'bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tx.type === 'referral' ? (
                              <Gift className="w-4 h-4" />
                            ) : tx.type === 'withdrawal' ? (
                              <ArrowUpCircle className="w-4 h-4 text-amber-400" />
                            ) : isCredit ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-white">{tx.title}</p>
                              {tx.matchId && (
                                <span className="text-[9px] font-mono font-bold bg-[#1E2536] text-slate-300 px-1.5 py-0.5 rounded">
                                  {tx.matchId}
                                </span>
                              )}
                              {tx.orderId && (
                                <span className="text-[9px] font-mono font-bold bg-[#1E2536] text-sky-400 px-1.5 py-0.5 rounded">
                                  {tx.orderId}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                              {tx.description}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {tx.date}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={`text-sm font-black ${
                              isCredit ? 'text-[#00FF66]' : 'text-rose-400'
                            }`}
                          >
                            {isCredit ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Bal: ₹{tx.balanceAfter}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DEPOSIT & WITHDRAWAL & PAYMENT GATEWAY */}
          {activeTab === 'banking' && (
            <div className="space-y-4">
              {/* Sub-Switch: Deposit vs Withdrawal */}
              <div className="grid grid-cols-2 gap-2 bg-[#0A0D14] p-1 rounded-xl border border-[#1E2536]">
                <button
                  type="button"
                  onClick={() => setBankingMode('deposit')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bankingMode === 'deposit'
                      ? 'bg-[#00FF66] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Deposit (Recharge)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBankingMode('withdraw')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bankingMode === 'withdraw'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Withdraw (Cash Out)</span>
                </button>
              </div>

              {/* 1. DEPOSIT FLOW WITH PAYMENT GATEWAY */}
              {bankingMode === 'deposit' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-[#111822] to-[#141C2A] border border-[#00FF66]/30 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#00FF66]" />
                        <h4 className="text-xs font-black text-white">Select Recharge Amount:</h4>
                      </div>
                      <span className="text-[10px] text-[#00FF66] font-bold bg-[#00FF66]/10 px-2 py-0.5 rounded">
                        Cashfree PG Active
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 200, 500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                            depositAmount === amt
                              ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-sm'
                              : 'bg-[#0A0D14] text-slate-300 border-[#263042] hover:border-slate-500'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    {/* Supported Payment Gateway Modes */}
                    <div className="pt-2 border-t border-[#1E2536] grid grid-cols-3 gap-2 text-center text-[10px] text-slate-300">
                      <div className="p-1.5 bg-[#0A0D14] rounded-lg border border-[#222B3D]">
                        <span>🟢 UPI (GPay/PhonePe)</span>
                      </div>
                      <div className="p-1.5 bg-[#0A0D14] rounded-lg border border-[#222B3D]">
                        <span>💳 Debit / Credit Cards</span>
                      </div>
                      <div className="p-1.5 bg-[#0A0D14] rounded-lg border border-[#222B3D]">
                        <span>🏦 NetBanking (50+ Banks)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddFunds(depositAmount)}
                    className="w-full py-3 bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-95 text-black font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00FF66]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-black" />
                    <span>Pay ₹{depositAmount} via UPI</span>
                  </button>
                </div>
              )}

              {/* 2. WITHDRAWAL FLOW */}
              {bankingMode === 'withdraw' && (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-rose-950/30 via-[#131720] to-[#0A0D14] border border-rose-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-400">
                        <ArrowUpCircle className="w-4 h-4" />
                        <h4 className="text-xs font-black text-white">Instant UPI Withdrawal:</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        ⚡ Instant IMPS / UPI
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">
                          Withdraw Amount (₹):
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Available: ₹{userProfile.walletBalance} (Min ₹50)
                        </span>
                      </div>
                      <input
                        type="number"
                        min="50"
                        max={userProfile.walletBalance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount (min ₹50)"
                        className="w-full px-3 py-2 bg-[#0A0D14] border border-[#263042] rounded-xl text-sm font-black text-white focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[11px] font-bold text-slate-300">
                        Your UPI ID (VPA):
                      </label>
                      <input
                        type="text"
                        value={withdrawUpiId}
                        onChange={(e) => setWithdrawUpiId(e.target.value)}
                        placeholder="e.g. yourname@paytm or mobilenumber@upi"
                        className="w-full px-3 py-2 bg-[#0A0D14] border border-[#263042] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00FF66]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Funds will be transferred directly to this UPI address via automated payment gateway.
                      </p>
                    </div>
                  </div>

                  {withdrawError && (
                    <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-xs font-bold text-rose-300 flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{withdrawError}</span>
                    </div>
                  )}

                  {withdrawSuccess && (
                    <div className="p-3 bg-[#00FF66]/15 border border-[#00FF66]/40 rounded-xl text-xs font-bold text-[#00FF66] flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{withdrawSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-black font-black text-xs rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowUpCircle className="w-4 h-4 text-black" />
                    <span>Confirm & Withdraw ₹{withdrawAmount || 0} to UPI</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: TOURNAMENT HISTORY */}
          {activeTab === 'tournaments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    My Tournament History
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Matches joined, slot allocations, final ranks, and earnings
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded-full">
                  {userTournaments.length} Matches Joined
                </span>
              </div>

              {userTournaments.length === 0 ? (
                <div className="p-8 text-center bg-[#0A0D14] border border-[#263042] rounded-xl text-xs text-slate-400 space-y-2">
                  <Gamepad2 className="w-8 h-8 text-slate-500 mx-auto opacity-40" />
                  <p className="font-semibold text-slate-300">No tournaments joined yet.</p>
                  <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
                    Aapne abhi tak koi match join nahi kiya hai. Home screen se <strong>Match #1</strong> join karein aur ₹50 Booyah reward jeetein!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {userTournaments.map((match) => {
                    const participantData = match.participants.find((p) => p.uid === userProfile.uid);
                    const isCompleted = match.status === 'Results';
                    const isRank1 = participantData?.rank === 1;

                    return (
                      <div
                        key={match.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isRank1
                            ? 'bg-amber-950/20 border-amber-500/50 shadow-sm'
                            : 'bg-[#0A0D14] border-[#222B3D]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{match.title}</span>
                              {isRank1 && (
                                <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase">
                                  <Crown className="w-3 h-3 text-amber-400" />
                                  <span>BOOYAH</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {match.gameMode} • Map: {match.map} • Slot #{participantData?.slotNumber}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              Match Time: {match.matchTime}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                isCompleted
                                  ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {match.status}
                            </span>
                            {isCompleted && (
                              <div className="mt-1">
                                <span className="text-xs font-black text-[#00FF66]">
                                  +₹{participantData?.winnings || 0}
                                </span>
                                <p className="text-[9px] text-slate-400">
                                  Rank #{participantData?.rank || '-'} • {participantData?.kills || 0} Kills
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Avatar and IGN Banner */}
              <div className="flex items-center gap-4 p-4 bg-[#0A0C10] border border-[#263042] rounded-2xl">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FF66]/20 via-[#1E2536] to-[#FF5722]/20 border border-[#00FF66]/40 flex items-center justify-center text-2xl font-black text-[#00FF66]">
                    <Zap className="w-8 h-8 text-[#00FF66]" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-[#00FF66] text-black font-extrabold text-[9px] rounded-md tracking-wider">
                    PRO
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{userProfile.ign}</h4>
                  <p className="text-xs font-mono text-slate-400">UID: {userProfile.uid}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-semibold text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded-md border border-[#00FF66]/20">
                      Solo Specialist
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      Ref Code: {userProfile.referralCode || 'ANSHEN77'}
                    </span>
                  </div>
                </div>
              </div>

              {/* In-Game Name & UID update form */}
              <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-[#1E2536]">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-300">
                    Default Free Fire IGN
                  </label>
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0C10] border border-[#263042] rounded-xl text-xs text-white focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-300">
                    Default Free Fire UID
                  </label>
                  <input
                    type="text"
                    value={uid}
                    onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-[#0A0C10] border border-[#263042] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-black bg-[#00FF66] hover:bg-[#00FF66]/90 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Saved Changes!</span>
                    </>
                  ) : (
                    <span>Save Profile Defaults</span>
                  )}
                </button>
              </form>

              {/* Mobile App Quick Settings & Help Links */}
              <div className="pt-3 border-t border-[#1E2536] space-y-2">
                <p className="text-xs font-bold text-slate-400">App Information &amp; Organizer Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {onOpenRulesModal && (
                    <button
                      type="button"
                      onClick={onOpenRulesModal}
                      className="min-h-[44px] px-3 py-2.5 bg-[#0E121A] hover:bg-[#192130] border border-[#1E2536] rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Tournament Rules</span>
                    </button>
                  )}
                  {onOpenFaqModal && (
                    <button
                      type="button"
                      onClick={onOpenFaqModal}
                      className="min-h-[44px] px-3 py-2.5 bg-[#0E121A] hover:bg-[#192130] border border-[#1E2536] rounded-xl text-xs font-bold text-sky-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 text-sky-400" />
                      <span>Help &amp; FAQ</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full min-h-[46px] py-2.5 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/50 text-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>LOGOUT OF ANSHENWIN</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
