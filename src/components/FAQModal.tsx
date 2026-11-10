import React, { useState } from 'react';
import { FAQItem } from '../types';
import { FAQ_DATA } from '../data/faqData';
import { X, HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck, Sparkles, Clock, Wallet, BookOpen } from 'lucide-react';

interface FAQModalProps {
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_DATA[0].id);

  const categories = ['All', 'Room & Timings', 'Rules & Entry', 'Wallet & Payouts', 'Anti-Cheat'];

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    if (selectedCategory !== 'All' && faq.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-[#131720] border-t border-x border-[#2E384D] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#1E2536] bg-[#0E121A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Help &amp; FAQ</h3>
              <p className="text-[11px] text-slate-400">Room entry, timings, payouts &amp; anti-cheat answers</p>
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

        {/* Search & Category Pills */}
        <div className="p-4 bg-[#0A0C10] border-b border-[#1E2536] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tournament questions (e.g., room id, 5 minute timer, kills)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#131720] border border-[#263042] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00FF66] text-black shadow-sm'
                    : 'bg-[#131720] text-slate-400 hover:text-white border border-[#263042]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="p-5 overflow-y-auto space-y-2.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-[#0A0C10] border border-[#263042] rounded-xl text-xs text-slate-400">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-[#121824] border-[#00FF66]/40 shadow-sm'
                      : 'bg-[#0A0D14] border-[#222B3D] hover:border-slate-600'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-white">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-[#1A2230] px-2 py-0.5 rounded uppercase">
                        {faq.category}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#00FF66]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-[#1E2536]/80 text-xs text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#0E121A] border-t border-[#1E2536] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
            <span>Official AnshenWin Tournament Guidelines</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E2536] hover:bg-[#263042] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  );
};
