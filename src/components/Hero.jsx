import { Shield, Zap, Star, Trophy, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAssetUrl } from '../utils/assets';

export default function Hero() {
  const { setCurrentPage } = useApp();

  return (
    <section className="relative w-full pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden select-none">
      
      {/* Background Epic Stadium Floodlight Imagery */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={getAssetUrl('images/stadium-bg.jpg')}
          alt="EA Sports FC Stadium"
          className="w-full h-full object-cover object-center opacity-15 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D13]/70 via-[#0B0D13]/90 to-[#0B0D13]" />
      </div>

      {/* Background radial glow accents */}
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[400px] bg-[#00F59B]/5 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-4 w-[250px] sm:w-[500px] h-[250px] sm:h-[350px] bg-[#FF3B30]/5 blur-[100px] sm:blur-[150px] pointer-events-none rounded-full" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Floating Guarantee Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#141824] border border-[#00F59B]/30 text-[#00F59B] text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>100% Ban-Free (VPN Encrypted)</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#141824] border border-[#262B3D] text-gray-300 text-[10px] sm:text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
            <span>24/7 Live Support</span>
          </div>
          <div className="hidden xs:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#141824] border border-[#262B3D] text-gray-300 text-[10px] sm:text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800] shrink-0" />
            <span>5-Star Rated (4.9/5)</span>
          </div>
        </div>

        {/* Main Grid: Headline + Interactive Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Headline + CTAs) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.12]">
              FC Boosting Services – <br className="hidden xs:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#85FFBD] to-white">
                Fast, Safe & Pro
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-xl">
              Upgrade your EA Sports FC experience with verified top-tier pro players. Rank up faster in Division Rivals, FUT Champions, and Milestones safely.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('ut-champions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2.5 transition-all shadow-lg shadow-[#00F59B]/20 hover:scale-[1.02] cursor-pointer min-h-[46px]"
              >
                <span>Select Boost Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentPage('all-services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2 transition-all hover:border-[#00F59B]/40 cursor-pointer min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>View Top Bundles</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-[#262B3D]/70 max-w-md">
              <div className="text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-white">15-30m</span>
                <p className="text-[10px] sm:text-xs text-gray-400">Avg Start Time</p>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-[#00F59B]">25K+</span>
                <p className="text-[10px] sm:text-xs text-gray-400">Delivered</p>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-black text-[#FFB800]">99.8%</span>
                <p className="text-[10px] sm:text-xs text-gray-400">Success Rate</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase Card with Real FIFA Card Artwork */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative bg-[#141824]/90 backdrop-blur-xl border border-[#262B3D] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 overflow-hidden group">
              
              {/* Top queue status */}
              <div className="flex items-center justify-between pb-3 border-b border-[#262B3D]">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00F59B] animate-ping" />
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">LIVE PRO QUEUE</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded border border-[#00F59B]/20">
                  ⚡ 0 QUEUE WAIT
                </span>
              </div>

              {/* Main Card Highlight with Real FC 25 FUT Card Artwork */}
              <div className="bg-[#0B0D13] rounded-2xl border border-[#262B3D] overflow-hidden group/card relative shadow-xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={getAssetUrl('images/hero-fc-card.jpg')}
                    alt="EA Sports FC 25 FUT Champions Pro Player Card"
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-transparent to-black/30" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#00F59B]/50 text-[#00F59B] text-[10px] font-black uppercase">
                      <Trophy className="w-3 h-3 text-[#FFB800]" />
                      <span>RANK 1 (19-20 WINS)</span>
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFB800] text-[#0B0D13] text-[10px] font-black uppercase shadow-lg">
                      ★ 91 OVR PRO
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#00F59B] block">
                        MOST REQUESTED SERVICE
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white uppercase italic">
                        UT Champions Finals 20-0
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Top Rewards Kept • Piloted VPN • Live Discord Stream
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">From</span>
                      <span className="text-lg font-black text-[#00F59B]">$24.99</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setCurrentPage('ut-champions');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Order Rank 1</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('coins');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                    >
                      Buy Coins
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Order Ticker Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400">
                  <span className="font-semibold uppercase tracking-wider">Recently Completed</span>
                  <span className="text-[#00F59B] font-bold">12 mins ago</span>
                </div>
                <div className="bg-[#1C2234]/60 rounded-xl p-3 border border-[#262B3D] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center font-bold text-xs shrink-0">
                      PS5
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Rank 1 (19 Wins) Completed</div>
                      <div className="text-[10px] text-gray-400">Customer: J*** (Germany) • Pro: Kaiser</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[#00F59B] shrink-0" />
                </div>
              </div>

              {/* Security Pill Footer */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400 pt-1">
                <span className="flex items-center space-x-1 text-gray-300">
                  <Shield className="w-3.5 h-3.5 text-[#00F59B]" />
                  <span>Regional IP VPN Protocol</span>
                </span>
                <span className="text-[#00F59B] font-bold">Instant Pro Assignment</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
