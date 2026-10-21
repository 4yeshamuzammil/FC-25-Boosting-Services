import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'FC 27', href: '#' },
    { name: 'EAFC News', href: '#' },
    { name: 'LEAGUE OF LEGENDS', href: '#' },
    { name: 'VALORANT', href: '#' },
    { name: 'CSGO', href: '#' },
  ];

  return (
    <nav className="w-full select-none font-sans">
      
      {/* 1. Top Accent Utility Bar */}
      <div className="w-full h-7 bg-[#1d2331] border-b border-zinc-900"></div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full bg-[#050608] text-white border-b border-zinc-950 shadow-2xl relative z-50">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* LEFT SIDE: DBA BOOSTING BRANDING LOGO */}
            <div className="-shrink-0 flex flex-col justify-center leading-none cursor-pointer">
              <span className="text-2xl font-black tracking-tighter text-white italic">
                DBA
              </span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-gray-300 uppercase -mt-0.5">
                BOOSTING
              </span>
            </div>

            {/* CENTER: DESKTOP GAME LINKS */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[13px] font-bold uppercase tracking-wider text-gray-200 hover:text-red-500 transition-colors duration-150"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* RIGHT SIDE: UTILITY CONTROLS (CURRENCY, LOGIN, CART) */}
            <div className="hidden lg:flex items-center space-x-6">
              
              {/* Currency Selector Box */}
              <div className="relative">
                <select 
                  className="bg-transparent text-xs font-bold text-gray-200 border border-zinc-700 px-3 py-1.5 rounded uppercase tracking-wider appearance-none pr-8 cursor-pointer focus:outline-none focus:border-zinc-500"
                  defaultValue="USD"
                >
                  <option value="USD" className="bg-[#050608]">USD (\$)</option>
                  <option value="EUR" className="bg-[#050608]">EUR (€)</option>
                  <option value="GBP" className="bg-[#050608]">GBP (£)</option>
                </select>
                {/* Custom Chevron Indicator */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://w3.org" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>

              {/* Red User Log In Link */}
              <a href="#" className="flex items-center space-x-2 group">
                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105">
                  <svg xmlns="http://w3.org" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-1.86-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-red-500 group-hover:text-red-400 transition-colors">
                  Log in
                </span>
              </a>

              {/* Shopping Cart Button */}
              <button className="relative p-1 text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* White Status Badge Dot */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-white ring-2 ring-[#050608]" />
              </button>

            </div>

            {/* MOBILE INTERFACE: TOGGLE MENU BUTTON */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                {!isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE MENU DROPDOWN PANEL */}
        <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-[#0c0d12] border-t border-zinc-800`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-sm font-bold uppercase tracking-wide text-gray-300 hover:text-red-500 py-3 border-b border-zinc-900/50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-red-500">Account Access</span>
              <a href="#" className="text-xs bg-red-600 px-3 py-1.5 rounded font-bold text-white">Log In</a>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}
