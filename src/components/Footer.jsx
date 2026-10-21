import { ShieldCheck, Lock, Headphones, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setCurrentPage, setIsTrackerOpen } = useApp();

  return (
    <footer className="w-full bg-[#080A0F] border-t border-[#262B3D] pt-12 sm:pt-16 pb-10 sm:pb-12 text-gray-400 font-sans select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Top Feature Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pb-10 sm:pb-14 border-b border-[#262B3D]/80">
          <div className="flex items-center space-x-3.5 bg-[#141824]/50 p-4 rounded-2xl border border-[#262B3D]">
            <div className="w-10 h-10 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center text-[#00F59B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">100% Ban-Free</h4>
              <p className="text-xs text-gray-400">Strict regional VPN protection</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 bg-[#141824]/50 p-4 rounded-2xl border border-[#262B3D]">
            <div className="w-10 h-10 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center text-[#00F59B] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">256-Bit SSL Safe</h4>
              <p className="text-xs text-gray-400">Encrypted payment checkouts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 bg-[#141824]/50 p-4 rounded-2xl border border-[#262B3D]">
            <div className="w-10 h-10 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">24/7 Live Support</h4>
              <p className="text-xs text-gray-400">Average response in 45 sec</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 bg-[#141824]/50 p-4 rounded-2xl border border-[#262B3D]">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800] shrink-0">
              <span className="font-black text-lg">★ 4.9</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">25,000+ Orders</h4>
              <p className="text-xs text-gray-400">Verified Trustpilot reviews</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#141824] to-[#1C2234] border border-[#262B3D] flex items-center justify-center font-black italic text-[#00F59B]">
                FC
              </div>
              <span className="text-xl font-black tracking-wider text-white uppercase italic">
                BOOST<span className="text-[#00F59B]">PRO</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The premier EA Sports FC 25 & FC 26 boosting platform. Powered by verified Top 200 pro players, cutting-edge VPN stealth technology, and 24/7 dedicated customer care.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#141824] hover:bg-[#5865F2] hover:text-white border border-[#262B3D] flex items-center justify-center transition-all text-gray-400"
                aria-label="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#141824] hover:bg-[#229ED9] hover:text-white border border-[#262B3D] flex items-center justify-center transition-all text-gray-400"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#141824] hover:bg-white hover:text-black border border-[#262B3D] flex items-center justify-center transition-all text-gray-400"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#141824] hover:bg-[#E1306C] hover:text-white border border-[#262B3D] flex items-center justify-center transition-all text-gray-400"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Boosting Services */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-black tracking-widest text-white uppercase">FC Boosting Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setCurrentPage('ut-champions'); window.scrollTo(0,0); }}
                  className="hover:text-[#00F59B] transition-colors"
                >
                  UT Champions Finals Boost
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('division-rivals'); window.scrollTo(0,0); }}
                  className="hover:text-[#00F59B] transition-colors"
                >
                  Division Rivals Tier & 7 Wins
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('coins'); window.scrollTo(0,0); }}
                  className="hover:text-[#00F59B] transition-colors"
                >
                  Buy EA Sports FC Coins
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('all-services'); window.scrollTo(0,0); }}
                  className="hover:text-[#00F59B] transition-colors"
                >
                  Play-Offs & Draft Streak
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('all-services'); window.scrollTo(0,0); }}
                  className="hover:text-[#00F59B] transition-colors"
                >
                  1-on-1 Pro Coaching Sessions
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Tracking */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-black tracking-widest text-white uppercase">Help & Tracking</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="text-[#00F59B] font-bold hover:underline"
                >
                  Track Live Order Status
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  VPN Stealth Security Rules
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Verified Customer Reviews
                </a>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Become a Pro Booster (Hiring)</span>
              </li>
            </ul>
          </div>

          {/* Legal & Payment Gateways */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-black tracking-widest text-white uppercase">Guaranteed Secure Payments</h5>
            <p className="text-[11px] text-gray-400">
              All transactions are processed with bank-level encryption. We never store financial credentials.
            </p>
            
            {/* Payment Method Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-[#141824] border border-[#262B3D] text-[10px] font-bold text-gray-200">
                PayPal Express
              </span>
              <span className="px-2.5 py-1 rounded bg-[#141824] border border-[#262B3D] text-[10px] font-bold text-gray-200">
                Stripe (Visa / MC)
              </span>
              <span className="px-2.5 py-1 rounded bg-[#141824] border border-[#262B3D] text-[10px] font-bold text-gray-200">
                Apple Pay
              </span>
              <span className="px-2.5 py-1 rounded bg-[#141824] border border-[#262B3D] text-[10px] font-bold text-gray-200">
                Google Pay
              </span>
              <span className="px-2.5 py-1 rounded bg-[#141824] border border-[#262B3D] text-[10px] font-bold text-[#00F59B]">
                Crypto (USDT / BTC)
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-[#262B3D]/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <div>
            © {new Date().getFullYear()} FC BOOST PRO. All rights reserved. Not affiliated with Electronic Arts Inc.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-gray-300 cursor-pointer">Safety & Rules</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Boosting Terms</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
