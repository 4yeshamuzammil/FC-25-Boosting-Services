import { useState } from 'react';

export default function DBABoostingHome() {
  return (
    <div className="w-full relative min-h-[calc(100vh-108px)] bg-zinc-950 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-16 overflow-hidden select-none font-sans">
      
      {/* BACKGROUND GRAPHIC UNDERLAY PLACEHOLDER */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-zinc-950/90 to-transparent opacity-80" />

      {/* MAIN CONTAINER FRAME */}
      <div className="w-full max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN CONTENT: HEADLINES & PRIMARY ACTIONS */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-gray-400 uppercase">
            COINS-BOOSTING-LEVELING MARKET
          </span>
          
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight uppercase">
            CHEAPEST, FASTEST, SAFEST <br />
            <span className="text-white block mt-1">AND MOST RELIABLE</span>
          </h1>

          <div className="pt-2">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-widest px-8 py-3.5 rounded-full inline-flex items-center space-x-3 transition-all uppercase shadow-lg shadow-red-600/10 hover:shadow-red-600/20 group">
              <span>SHOP</span>
              <svg xmlns="http://w3.org" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* ABSOLUTE FLOATING CARD FOR CURRENT SELECTION FEATURE */}
          <div className="pt-8 w-full max-w-[480px]">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-zinc-800/40 flex items-stretch space-x-4 shadow-2xl">
              
              {/* Product Thumbnail Block */}
              <div className="w-40 h-28 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative border border-zinc-700/30">
                {/* Visual placeholder standing in for FC 27 artwork */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-zinc-900 to-zinc-900" />
                <span className="relative z-10 text-emerald-400 text-xs font-black tracking-widest uppercase">FC 27 LOGO</span>
              </div>

              {/* Dynamic Information Typography Panel */}
              <div className="flex flex-col justify-center space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs bg-zinc-800 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide scale-90 origin-left">
                    EA SPORTS
                  </span>
                  <span className="text-sm font-black italic tracking-tighter text-white">FC27</span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide leading-snug">
                  EAFC 27 Coins & Boosting
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-[240px]">
                  The most exciting football game. Why not getting the most exciting FC27 rewards?
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN LAYOUT COMPONENT */}
        <div className="hidden lg:col-span-5 lg:block" />

      </div>

      {/* SLIDER NAVIGATION TRIGGER ACTIONS */}
      {/* Left Slider Arrow Button */}
      <button className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-white p-2 transition-colors focus:outline-none">
        <svg xmlns="http://w3.org" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Slider Arrow Button */}
      <button className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-white p-2 transition-colors focus:outline-none">
        <svg xmlns="http://w3.org" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* BOTTOM SLIDESHOW PROGRESS TRACKER SYMBOL */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
        </div>
      </div>

      {/* FLOATING ACTION CHAT ICON PINNED TO BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-2xl shadow-red-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none">
          <svg xmlns="http://w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

    </div>
  );
}
