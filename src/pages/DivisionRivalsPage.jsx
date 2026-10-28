import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DIVISION_RIVALS_TIERS, PLATFORMS, ADDONS_DATA } from '../data/mockData';
import { Zap, ShieldCheck, Check, ArrowRight, Trophy, Flame } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

export default function DivisionRivalsPage() {
  const { addToCart, setIsCartOpen, openContactModal } = useApp();

  const [boostType, setBoostType] = useState('promotion'); // 'promotion' | 'weekly7'
  const [currentDiv, setCurrentDiv] = useState(5);
  const [targetDiv, setTargetDiv] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');
  const [selectedAddons, setSelectedAddons] = useState(['express']);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate Price
  const calculateBasePrice = () => {
    if (boostType === 'weekly7') {
      return 34.99;
    }
    const currentMult = DIVISION_RIVALS_TIERS.find((d) => d.id === currentDiv)?.multiplier || 0;
    const targetMult = DIVISION_RIVALS_TIERS.find((d) => d.id === targetDiv)?.multiplier || 100;
    const diff = Math.max(1, targetMult - currentMult);
    return Math.max(19.99, diff * 0.95);
  };

  const basePrice = calculateBasePrice();
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
    const serviceName = boostType === 'weekly7'
      ? `Division Rivals: Weekly 7 Wins (Div ${currentDiv})`
      : `Division Rivals: Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv}`;

    addToCart({
      serviceId: `rivals-${boostType}-${Date.now()}`,
      serviceName,
      details: `Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`,
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
        
        {/* Page Hero Header with FIFA Rivals Action Imagery */}
        <div className="bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none opacity-20 overflow-hidden">
            <img
              src={getAssetUrl('images/rivals-action.jpg')}
              alt="Division Rivals Action"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/70 to-transparent" />
          </div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-black uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>Division Rivals Promotion & Weekly 7 Wins</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Division Rivals Boost
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Climb swiftly from Division 10 all the way to Elite Division, or lock in your weekly 7 wins upgrade rewards before the Thursday reset with zero sweat.
            </p>
          </div>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Controls */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Boost Type Toggle */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Step 1: Choose Rivals Objective
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBoostType('promotion')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    boostType === 'promotion'
                      ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg'
                      : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                  }`}
                >
                  <span className="text-sm font-bold block text-white">Division Promotion</span>
                  <span className="text-xs text-gray-400">Push to a higher tier or Elite Division</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBoostType('weekly7')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    boostType === 'weekly7'
                      ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-lg'
                      : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold block text-white">Weekly 7 Wins Boost</span>
                    <span className="text-xs font-black text-[#00F59B]">$34.99</span>
                  </div>
                  <span className="text-xs text-gray-400">Max upgrade rewards before Thursday</span>
                </button>
              </div>
            </div>

            {/* Platform Selector */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Step 2: Platform
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

            {/* Division Pickers */}
            {boostType === 'promotion' ? (
              <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Step 3: Select Current & Target Division
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">
                      Current Division
                    </label>
                    <select
                      value={currentDiv}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentDiv(val);
                        if (targetDiv > val) setTargetDiv(val === 0 ? 0 : val - 1);
                      }}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
                    >
                      {DIVISION_RIVALS_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.id} className="bg-[#141824]">
                          {tier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">
                      Target Division
                    </label>
                    <select
                      value={targetDiv}
                      onChange={(e) => setTargetDiv(Number(e.target.value))}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
                    >
                      {DIVISION_RIVALS_TIERS.filter((t) => t.id <= currentDiv).map((tier) => (
                        <option key={tier.id} value={tier.id} className="bg-[#141824]">
                          {tier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Current Tier Selection
                </h3>
                <label className="text-xs text-gray-400 block">Select your current division for 7 wins:</label>
                <select
                  value={currentDiv}
                  onChange={(e) => setCurrentDiv(Number(e.target.value))}
                  className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
                >
                  {DIVISION_RIVALS_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id} className="bg-[#141824]">
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Addons */}
            <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Step 4: Optional Add-ons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS_DATA.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{addon.name}</div>
                        <div className="text-[10px] text-gray-400">{addon.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
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

          {/* Right Column Summary Card */}
          <div className="lg:col-span-4 bg-[#141824] border border-[#262B3D] rounded-3xl p-6 space-y-6 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262B3D]">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                Rivals Boost Summary
              </span>
              <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded">
                SAFE VPN
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Service:</span>
                <span className="font-black text-white">
                  {boostType === 'weekly7' ? '7 Weekly Wins' : `Div ${currentDiv} → Div ${targetDiv}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="font-bold text-white uppercase">{selectedPlatform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Duration:</span>
                <span className="font-bold text-white">2 - 6 Hours</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262B3D] flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total in USD</span>
                <span className="text-3xl font-black text-[#00F59B]">${totalPrice}</span>
              </div>
              <span className="text-xs text-gray-400">USD Fixed</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const serviceName = boostType === 'weekly7'
                    ? `Division Rivals: Weekly 7 Wins (Div ${currentDiv})`
                    : `Division Rivals: Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv}`;
                  openContactModal({
                    serviceName,
                    details: `Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`,
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
          </div>

        </div>

      </div>
    </div>
  );
}
