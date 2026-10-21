import { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { FAQS_DATA } from '../data/mockData';

export default function FaqAccordion() {
  const [openId, setOpenId] = useState(FAQS_DATA[0].id);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="w-full py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
            GOT QUESTIONS?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-400">
            Clear, honest answers about security, order speeds, and our boosting process.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#141824] border border-[#262B3D] hover:border-[#262B3D]/90 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-[#1C2234] border border-[#262B3D] flex items-center justify-center text-[#00F59B] shrink-0 font-bold text-xs">
                      ?
                    </div>
                    <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#00F59B]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#262B3D]/50 bg-[#0B0D13]/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Support Box */}
        <div className="mt-8 p-6 rounded-2xl bg-[#141824] border border-[#262B3D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center text-[#00F59B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Still have custom questions?</h4>
              <p className="text-xs text-gray-400">Our support team is online 24/7 on live chat and Discord.</p>
            </div>
          </div>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-all hover:border-[#00F59B]/40"
          >
            Chat with Support →
          </a>
        </div>

      </div>
    </section>
  );
}
