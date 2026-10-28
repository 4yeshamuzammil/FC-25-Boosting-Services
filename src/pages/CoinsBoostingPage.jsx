import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLATFORMS } from '../data/mockData';
import { Coins, ShieldCheck, Check, ArrowRight, Zap, Info } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function CoinsBoostingPage() {
  const { addToCart, setIsCartOpen, openContactModal } = useApp();

  const [coinAmountK, setCoinAmountK] = useState(1000); // 1,000,000 coins default
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');
  const [transferMethod, setTransferMethod] = useState('comfort'); // 'comfort' | 'auction'

  // Price rate: e.g. $11.50 per 100k
  const calculatedPrice = ((coinAmountK / 100) * 11.5).toFixed(2);

  const handleOrder = (directToCheckout = false) => {
    const formattedCoins = coinAmountK >= 1000 ? `${(coinAmountK / 1000).toFixed(1)}M` : `${coinAmountK}K`;
    addToCart({
      serviceId: `coins-${coinAmountK}-${Date.now()}`,
      serviceName: `EAFC Coins: ${formattedCoins} (${coinAmountK}K Coins)`,
      details: `${transferMethod === 'comfort' ? 'Comfort Trade (0% Ban Risk)' : 'Player Auction'} • Platform: ${selectedPlatform.toUpperCase()} • 5% EA Tax Covered`,
      price: calculatedPrice,
      platform: selectedPlatform,
    });

    if (directToCheckout) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Page Hero Header with FIFA Coins Pack Imagery */}
        <div className="bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none opacity-25 overflow-hidden">
            <img
              src={getAssetUrl('images/coins-bundle.jpg')}
              alt="EA Sports FC Coins"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/70 to-transparent" />
          </div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-black uppercase">
              <Coins className="w-3.5 h-3.5" />
              <span>Instant Safe EAFC Coins Transfer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Buy EA Sports FC Coins
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Safe, fast automated Comfort Trade system with 100% EA 5% transfer tax covered. Build your dream team in minutes without worrying about bans or coin wipes.
            </p>
          </div>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Platform */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Step 1: Choose Your Platform
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedPlatform === plat.id
                        ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                        : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">{plat.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Coin Slider & Presets */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 2: Choose Coin Amount
                </h3>
                <span className="text-xs font-black text-[#00F59B]">
                  {coinAmountK >= 1000 ? `${(coinAmountK / 1000).toFixed(1)} Million` : `${coinAmountK}K`} Coins
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={coinAmountK}
                onChange={(e) => setCoinAmountK(Number(e.target.value))}
                className="w-full accent-[#00F59B] cursor-pointer h-3 bg-[#0B0D13] rounded-lg"
              />

              {/* Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[200, 500, 1000, 2000, 3000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCoinAmountK(amt)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      coinAmountK === amt
                        ? 'bg-[#00F59B] text-[#0B0D13] border-[#00F59B]'
                        : 'bg-[#1C2234] border-[#262B3D] text-gray-300 hover:text-white'
                    }`}
                  >
                    {amt >= 1000 ? `${amt / 1000}M Coins` : `${amt}K Coins`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Transfer Method */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Step 3: Transfer Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setTransferMethod('comfort')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    transferMethod === 'comfort'
                      ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md'
                      : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-white">Comfort Trade</span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#00F59B]/20 text-[#00F59B]">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Automated transfer via Web App login. Fully hands-free, completed in 15–30 minutes with 0% ban history.
                  </p>
                </div>

                <div
                  onClick={() => setTransferMethod('auction')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    transferMethod === 'auction'
                      ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md'
                      : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-white">Player Auction</span>
                    <span className="text-[9px] font-bold text-gray-400">MANUAL</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    You list specific market cards as instructed, and our system buys them out. No account sharing required.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Summary Card */}
          <div className="lg:col-span-4 bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262B3D]">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                Coins Order Summary
              </span>
              <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded">
                TAX COVERED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Coins Amount:</span>
                <span className="font-black text-white">
                  {coinAmountK >= 1000 ? `${(coinAmountK / 1000).toFixed(1)}M` : `${coinAmountK}K`} Coins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="font-bold text-white uppercase">{selectedPlatform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">EA 5% Tax:</span>
                <span className="font-bold text-[#00F59B]">100% Covered by Us</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Delivery:</span>
                <span className="font-bold text-white">15 – 30 Minutes</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262B3D] flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total in USD</span>
                <span className="text-3xl font-black text-[#00F59B]">${calculatedPrice}</span>
              </div>
              <span className="text-xs text-gray-400">USD Fixed</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const formattedCoins = coinAmountK >= 1000 ? `${(coinAmountK / 1000).toFixed(1)}M` : `${coinAmountK}K`;
                  openContactModal({
                    serviceName: `EAFC Coins: ${formattedCoins} (${coinAmountK}K Coins)`,
                    details: `${transferMethod === 'comfort' ? 'Comfort Trade (0% Ban Risk)' : 'Player Auction'} • Platform: ${selectedPlatform.toUpperCase()} • 5% EA Tax Covered`,
                    price: calculatedPrice,
                    platform: selectedPlatform,
                  });
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#5865F2] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
              >
                <span>Order Now (WhatsApp / Discord)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOrder(false)}
                  className="py-2.5 rounded-xl bg-[#0B0D13] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleOrder(true)}
                  className="py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Instant Pay
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
