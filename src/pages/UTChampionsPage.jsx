import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UT_CHAMPIONS_RANKS, PLATFORMS, ADDONS_DATA } from '../data/mockData';
import { Trophy, ShieldCheck, Check, ArrowRight, Zap, Play, Lock, Sparkles, HelpCircle } from 'lucide-react';

export default function UTChampionsPage() {
  const { addToCart, setIsCartOpen, openContactModal } = useApp();

  const [selectedRank, setSelectedRank] = useState(UT_CHAMPIONS_RANKS[0]);
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');
  const [selectedAddons, setSelectedAddons] = useState(['express', 'stream']);
  const [loginMethod, setLoginMethod] = useState('account'); // 'account' | 'selfplay'
  const [gamerTag, setGamerTag] = useState('');

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate Price
  const basePrice = selectedRank.basePrice;
  let addonsSum = 0;
  selectedAddons.forEach((id) => {
    const addon = ADDONS_DATA.find((a) => a.id === id);
    if (addon) {
      if (addon.type === 'percentage') {
        addonsSum += basePrice * addon.rate;
      } else {
        addonsSum += addon.price;
      }
    }
  });

  const totalPrice = (basePrice + addonsSum).toFixed(2);

  const handleOrder = (directToCheckout = false) => {
    addToCart({
      serviceId: `champions-${selectedRank.id}-${Date.now()}`,
      serviceName: `UT Champions: ${selectedRank.name}`,
      details: `${selectedRank.wins} • ${selectedPlatform.toUpperCase()} • Mode: ${loginMethod === 'account' ? 'Piloted VPN' : 'Self-Play Duo'} • Addons: ${selectedAddons.join(', ') || 'None'}`,
      price: totalPrice,
      platform: selectedPlatform,
      addons: selectedAddons,
    });

    if (directToCheckout) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Page Hero Header with FIFA Champions Imagery */}
        <div className="bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none opacity-20 overflow-hidden">
            <img
              src="/images/champions-action.jpg"
              alt="UT Champions"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/70 to-transparent" />
          </div>

          <div className="absolute right-0 top-0 w-96 h-96 bg-[#00F59B]/5 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-black uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>Weekend League Finals Guaranteed Wins</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              UT Champions Finals Boost
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Secure guaranteed Rank 1 to Rank 7 finishes in EA Sports FC Ultimate Team Weekend League. Played by verified Top 200 FIFA Global Series pros with dedicated regional VPN stealth protection.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-300">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                <span>100% Ban-Free VPN</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-[#FFB800]" />
                <span>Starts in ~15 Mins</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#00F59B]" />
                <span>All Packs & Rewards Kept</span>
              </span>
            </div>
          </div>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Selector */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Platform */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 1: Select Platform
                </h3>
                <span className="text-xs text-gray-400">All Platforms Supported</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedPlatform === plat.id
                        ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg shadow-[#00F59B]/10'
                        : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold block">{plat.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase mt-0.5 block">Instant Pro Ready</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Rank Target */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 2: Choose Weekend League Target Rank
                </h3>
                <span className="text-xs text-[#00F59B] font-bold">Guaranteed Rank or Full Refund</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {UT_CHAMPIONS_RANKS.map((rank) => {
                  const isSelected = selectedRank.id === rank.id;
                  return (
                    <div
                      key={rank.id}
                      onClick={() => setSelectedRank(rank)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0B0D13] border-[#00F59B] shadow-lg shadow-[#00F59B]/15'
                          : 'bg-[#1C2234] border-[#262B3D] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-black text-white">{rank.name}</span>
                          {rank.popular && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF3B30] text-white">
                              HOT
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-black text-[#00F59B]">${rank.basePrice}</span>
                      </div>

                      <p className="text-xs text-gray-400 leading-snug mb-2">
                        {rank.rewards}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[#262B3D]/70">
                        <span>ETA: {rank.estimatedTime}</span>
                        <span className="font-bold text-gray-300">{rank.badge}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-ons & Stealth Options */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 3: Speed, Stream & Tactics Add-ons
                </h3>
                <span className="text-xs text-gray-400">Customizable</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS_DATA.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const priceLabel = addon.type === 'percentage' ? `+${addon.rate * 100}%` : `+$${addon.price}`;
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{addon.name}</span>
                          <span className="text-[10px] font-black text-[#00F59B] bg-[#00F59B]/10 px-1 rounded">
                            {priceLabel}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 block">{addon.description}</span>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ml-3 ${
                        isChecked ? 'bg-[#00F59B] border-[#00F59B] text-[#0B0D13]' : 'border-[#262B3D]'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Checkout Card */}
          <div className="lg:col-span-4 bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262B3D]">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                Package Summary
              </span>
              <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded">
                ⚡ INSTANT QUEUE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Target:</span>
                <span className="font-black text-white">{selectedRank.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="font-bold text-white uppercase">{selectedPlatform}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Duration:</span>
                <span className="font-bold text-white">{selectedRank.estimatedTime}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Active Add-ons:</span>
                <span className="font-bold text-[#00F59B]">{selectedAddons.length} applied</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#262B3D] flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total in USD</span>
                <span className="text-3xl font-black text-[#00F59B]">${totalPrice}</span>
              </div>
              <span className="text-xs text-gray-400">All Taxes Included</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  openContactModal({
                    serviceName: `UT Champions: ${selectedRank.name}`,
                    details: `${selectedRank.wins} • ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`,
                    price: totalPrice,
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

            {/* Guarantee Pill */}
            <div className="pt-4 border-t border-[#262B3D] space-y-2 text-[11px] text-gray-400">
              <div className="flex items-center space-x-2 text-[#00F59B]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="font-bold">100% Ban-Free VPN Stealth Protocol</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Booster uses clean dedicated local VPN corresponding to your country and region. Your account safety is guaranteed.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
