import React, { useState } from 'react';
import { 
  CASHFREE_FIREBASE_FUNCTION_CODE, 
  CASHFREE_ANDROID_KOTLIN_CODE, 
  CASHFREE_FLUTTER_DART_CODE,
  ANDROID_ACTIVITY_WALLET_XML 
} from '../data/cashfreeCode';
import { X, CreditCard, ShieldCheck, Copy, Check, Code2, Server, Smartphone, ExternalLink, ArrowRight, CheckCircle2, FileCode } from 'lucide-react';

interface CashfreeModalProps {
  onClose: () => void;
  onSimulatePaymentSuccess: (amount: number, orderId: string) => void;
}

export const CashfreeModal: React.FC<CashfreeModalProps> = ({
  onClose,
  onSimulatePaymentSuccess,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'test' | 'firebase' | 'android' | 'layout' | 'flutter'>('test');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Test Checkout State
  const [rechargeAmount, setRechargeAmount] = useState<number>(100);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'card'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSimulateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const mockOrderId = `ANSHEN_${Math.floor(1000 + Math.random() * 9000)}_${Date.now().toString().slice(-4)}`;

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(`Payment of ₹${rechargeAmount} Verified! Webhook auto-credited wallet.`);
      onSimulatePaymentSuccess(rechargeAmount, mockOrderId);
      setTimeout(() => {
        setPaymentSuccess(null);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#131720] border border-[#2E384D] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2536] bg-[#0E121A]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00FF66]/15 text-[#00FF66] border border-[#00FF66]/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Cashfree Payment Gateway Integration</h3>
                <span className="text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded-full border border-[#00FF66]/20">
                  API 2023-08-01 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Firebase Cloud Functions (Backend) & Android Studio Client Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E2536] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E2536] bg-[#0A0C10] px-4 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCodeTab('test')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeCodeTab === 'test'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Interactive PG Demo</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('firebase')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeCodeTab === 'firebase'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>1. Firebase Cloud Functions (Node.js)</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('android')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeCodeTab === 'android'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Kotlin (WalletActivity.kt)</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('layout')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeCodeTab === 'layout'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>3. XML Layout (activity_wallet.xml)</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('flutter')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeCodeTab === 'flutter'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>4. Flutter (Dart)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: INTERACTIVE CASHFREE CHECKOUT SIMULATOR */}
          {activeCodeTab === 'test' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-[#131720] to-[#111A28] border border-[#00FF66]/30 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">Cashfree Drop Checkout Simulation</h4>
                    <p className="text-[11px] text-slate-400">
                      Creates order token, simulates UPI intent payment, and runs Firestore webhook credit
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded border border-[#00FF66]/20">
                    TEST MODE
                  </span>
                </div>
              </div>

              <form onSubmit={handleSimulateCheckout} className="space-y-4">
                {/* Select Amount */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-300">
                    Select Recharge Amount (INR):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 100, 200].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setRechargeAmount(amt)}
                        className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                          rechargeAmount === amt
                            ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-sm'
                            : 'bg-[#0A0D14] text-slate-300 border-[#263042] hover:border-slate-500'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-300">
                    Choose Cashfree Payment Method:
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'gpay', name: 'Google Pay (UPI Intent)', desc: 'Instant 1-tap UPI app checkout' },
                      { id: 'phonepe', name: 'PhonePe UPI', desc: 'Secure BHIM UPI payment' },
                      { id: 'paytm', name: 'Paytm UPI / Wallet', desc: 'Fast checkout with Paytm app' },
                      { id: 'card', name: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay' },
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedUpiApp(method.id as any)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedUpiApp === method.id
                            ? 'bg-[#182230] border-[#00FF66]/60 shadow-sm'
                            : 'bg-[#0A0D14] border-[#222B3D] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedUpiApp === method.id ? 'border-[#00FF66] bg-[#00FF66]' : 'border-slate-500'
                          }`}>
                            {selectedUpiApp === method.id && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{method.name}</p>
                            <p className="text-[10px] text-slate-400">{method.desc}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#00FF66]">₹{rechargeAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Gateway Specs summary */}
                <div className="p-3 bg-[#0A0D14] border border-[#222B3D] rounded-xl text-[10px] text-slate-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Order Session:</span>
                    <span className="text-slate-300">session_cf_{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Webhook Verification:</span>
                    <span className="text-[#00FF66]">HMAC-SHA256 Enforced</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firestore Auto-Credit:</span>
                    <span className="text-[#00FF66]">FieldValue.increment(₹{rechargeAmount})</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#00FF66] hover:bg-[#00FF66]/90 active:scale-95 text-black font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00FF66]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying Cashfree Order Session...</span>
                  ) : (
                    <>
                      <span>PAY ₹{rechargeAmount} VIA CASHFREE PG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {paymentSuccess && (
                  <div className="p-3 bg-[#00FF66]/15 border border-[#00FF66]/40 rounded-xl text-xs font-bold text-[#00FF66] flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{paymentSuccess}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: FIREBASE CLOUD FUNCTIONS CODE */}
          {activeCodeTab === 'firebase' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">functions/index.js (Node.js)</h4>
                  <p className="text-[11px] text-slate-400">Endpoints: /createCashfreeOrder & /cashfreeWebhook (HMAC-SHA256 signature check)</p>
                </div>
                <button
                  onClick={() => handleCopy(CASHFREE_FIREBASE_FUNCTION_CODE, 'firebase')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#263042] text-white border border-[#334155] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedCode === 'firebase' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'firebase' ? 'Copied!' : 'Copy Cloud Function'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#0A0D14] border border-[#222B3D] rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px] scrollbar-thin">
                {CASHFREE_FIREBASE_FUNCTION_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: ANDROID STUDIO KOTLIN CODE */}
          {activeCodeTab === 'android' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">CashfreePaymentActivity.kt (Kotlin)</h4>
                  <p className="text-[11px] text-slate-400">Uses CFPaymentGatewayService, CFSession, onPaymentVerify callback</p>
                </div>
                <button
                  onClick={() => handleCopy(CASHFREE_ANDROID_KOTLIN_CODE, 'android')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#263042] text-white border border-[#334155] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedCode === 'android' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'android' ? 'Copied!' : 'Copy Kotlin Code'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#0A0D14] border border-[#222B3D] rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px] scrollbar-thin">
                {CASHFREE_ANDROID_KOTLIN_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: ANDROID XML LAYOUT */}
          {activeCodeTab === 'layout' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">res/layout/activity_wallet.xml (Android XML)</h4>
                  <p className="text-[11px] text-slate-400">Deposit Input, Quick Amount Chips (₹10, ₹50, ₹100, ₹200) & Pay via UPI Button</p>
                </div>
                <button
                  onClick={() => handleCopy(ANDROID_ACTIVITY_WALLET_XML, 'layout')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#263042] text-white border border-[#334155] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedCode === 'layout' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'layout' ? 'Copied!' : 'Copy XML Layout'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#0A0D14] border border-[#222B3D] rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px] scrollbar-thin">
                {ANDROID_ACTIVITY_WALLET_XML}
              </pre>
            </div>
          )}

          {/* TAB 4: FLUTTER CODE */}
          {activeCodeTab === 'flutter' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">lib/cashfree_service.dart (Flutter Dart)</h4>
                  <p className="text-[11px] text-slate-400">Package: flutter_cashfree_pg_sdk with CFDropCheckoutPayment</p>
                </div>
                <button
                  onClick={() => handleCopy(CASHFREE_FLUTTER_DART_CODE, 'flutter')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2536] hover:bg-[#263042] text-white border border-[#334155] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedCode === 'flutter' ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'flutter' ? 'Copied!' : 'Copy Flutter Dart'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#0A0D14] border border-[#222B3D] rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px] scrollbar-thin">
                {CASHFREE_FLUTTER_DART_CODE}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
