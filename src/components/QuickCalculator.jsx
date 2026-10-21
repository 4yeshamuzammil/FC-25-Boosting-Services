import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UT_CHAMPIONS_RANKS, DIVISION_RIVALS_TIERS, PLATFORMS, ADDONS_DATA } from '../data/mockData';
import { Trophy, Zap, Coins, Check, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function QuickCalculator() {
  const { addToCart, setIsCartOpen, openContactModal } = useApp();

  // Active quick tab
  const [activeTab, setActiveTab] = useState('champions'); // 'champions' | 'rivals' | 'coins'

  // Platform
  const [selectedPlatform, setSelectedPlatform] = useState('ps5');

  // Champions State
  const [selectedRank, setSelectedRank] = useState(UT_CHAMPIONS_RANKS[0]);

  // Rivals State
  const [currentDiv, setCurrentDiv] = useState(6);
  const [targetDiv, setTargetDiv] = useState(1);
  const [isWeekly7Wins, setIsWeekly7Wins] = useState(false);

  // Coins State
  const [coinAmountK, setCoinAmountK] = useState(500); // 500k coins

  // Addons State
  const [selectedAddons, setSelectedAddons] = useState(['express']);

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Price Calculation Logic
  const calculatePrice = () => {
    let base = 0;

    if (activeTab === 'champions') {
      base = selectedRank.basePrice;
    } else if (activeTab === 'rivals') {
      if (isWeekly7Wins) {
        base = 34.99;
      } else {
        const currentMult = DIVISION_RIVALS_TIERS.find((d) => d.id === currentDiv)?.multiplier || 0;
        const targetMult = DIVISION_RIVALS_TIERS.find((d) => d.id === targetDiv)?.multiplier || 100;
        const diff = Math.max(1, targetMult - currentMult);
        base = Math.max(19.99, diff * 0.95);
      }
    } else if (activeTab === 'coins') {
      // e.g. $12.50 per 100k
      base = (coinAmountK / 100) * 11.8;
    }

    // Addons
    let addonsTotal = 0;
    selectedAddons.forEach((addonId) => {
      const addon = ADDONS_DATA.find((a) => a.id === addonId);
      if (addon) {
        if (addon.type === 'percentage') {
          addonsTotal += base * addon.rate;
        } else if (addon.type === 'fixed') {
          addonsTotal += addon.price;
        }
      }
    });

    return (base + addonsTotal).toFixed(2);
  };

  const currentPrice = calculatePrice();

  const handleAddToCart = () => {
    let serviceName = '';
    let details = '';

    if (activeTab === 'champions') {
      serviceName = `UT Champions: ${selectedRank.name}`;
      details = `${selectedRank.wins} • Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`;
    } else if (activeTab === 'rivals') {
      serviceName = isWeekly7Wins
        ? `Division Rivals: Weekly 7 Wins (Div ${currentDiv})`
        : `Division Rivals: Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv}`;
      details = `Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`;
    } else {
      serviceName = `EAFC Coins: ${(coinAmountK / 1000).toFixed(1)}M (${coinAmountK}K Coins)`;
      details = `Comfort Trade (Tax Covered) • Platform: ${selectedPlatform.toUpperCase()}`;
    }

    addToCart({
      serviceId: `${activeTab}-${Date.now()}`,
      serviceName,
      details,
      price: currentPrice,
      platform: selectedPlatform,
      addons: selectedAddons,
    });
  };

  const handleInstantCheckout = () => {
    handleAddToCart();
    setIsCartOpen(true);
  };

  const handleOrderWithWhatsAppDiscord = () => {
    let serviceName = '';
    let details = '';

    if (activeTab === 'champions') {
      serviceName = `UT Champions: ${selectedRank.name}`;
      details = `${selectedRank.wins} • Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`;
    } else if (activeTab === 'rivals') {
      serviceName = isWeekly7Wins
        ? `Division Rivals: Weekly 7 Wins (Div ${currentDiv})`
        : `Division Rivals: Div ${currentDiv} → ${targetDiv === 0 ? 'Elite' : 'Div ' + targetDiv}`;
      details = `Platform: ${selectedPlatform.toUpperCase()} • Addons: ${selectedAddons.join(', ') || 'None'}`;
    } else {
      serviceName = `EAFC Coins: ${(coinAmountK / 1000).toFixed(1)}M (${coinAmountK}K Coins)`;
      details = `Comfort Trade (Tax Covered) • Platform: ${selectedPlatform.toUpperCase()}`;
    }

    openContactModal({
      serviceName,
      details,
      price: currentPrice,
      platform: selectedPlatform,
    });
  };

  return (
    <section className="w-full py-10 sm:py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
            INTERACTIVE CALCULATOR
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Customize & Calculate Your Boost
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Select your service parameters below for transparent, real-time pricing in USD ($).
          </p>
        </div>

        {/* Calculator Main Container */}
        <div className="bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          
          {/* Top Service Tabs */}
          <div className="flex overflow-x-auto pb-4 sm:pb-6 border-b border-[#262B3D] gap-2 sm:flex-wrap scrollbar-none">
            <button
              onClick={() => setActiveTab('champions')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[42px] ${
                activeTab === 'champions'
                  ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20 font-black'
                  : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>UT Champions Finals</span>
            </button>

            <button
              onClick={() => setActiveTab('rivals')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[42px] ${
                activeTab === 'rivals'
                  ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20 font-black'
                  : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Division Rivals Boost</span>
            </button>

            <button
              onClick={() => setActiveTab('coins')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider inline-flex items-center space-x-2 transition-all cursor-pointer shrink-0 min-h-[42px] ${
                activeTab === 'coins'
                  ? 'bg-[#00F59B] text-[#0B0D13] shadow-lg shadow-[#00F59B]/20 font-black'
                  : 'bg-[#1C2234] text-gray-300 hover:text-white hover:bg-[#262B3D]'
              }`}
            >
              <Coins className="w-4 h-4 shrink-0" />
              <span>Buy EAFC Coins</span>
            </button>
          </div>

          {/* Main Grid: Parameters on Left, Price Summary on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* LEFT 8 COLS: CONFIGURATOR CONTROLS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Platform Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-2.5">
                  Step 1: Select Your Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PLATFORMS.map((plat) => (
                    <button
                      key={plat.id}
                      onClick={() => setSelectedPlatform(plat.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPlatform === plat.id
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md shadow-[#00F59B]/10'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider block">
                        {plat.shortName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Service Specific Controls */}
              {activeTab === 'champions' && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-2.5">
                    Step 2: Choose Target Weekend League Rank
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {UT_CHAMPIONS_RANKS.map((rank) => (
                      <button
                        key={rank.id}
                        onClick={() => setSelectedRank(rank)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          selectedRank.id === rank.id
                            ? 'bg-[#0B0D13] border-[#00F59B] text-white shadow-md'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white">Rank {rank.rankNumber}</span>
                          <span className="text-[10px] text-[#00F59B] font-bold">${rank.basePrice}</span>
                        </div>
                        <span className="text-[11px] text-gray-300 block font-semibold">{rank.wins}</span>
                        <span className="text-[9px] text-gray-400 block mt-1">{rank.estimatedTime}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rivals' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 pb-2">
                    <button
                      onClick={() => setIsWeekly7Wins(false)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        !isWeekly7Wins
                          ? 'bg-[#00F59B] text-[#0B0D13]'
                          : 'bg-[#1C2234] text-gray-300'
                      }`}
                    >
                      Division Promotion
                    </button>
                    <button
                      onClick={() => setIsWeekly7Wins(true)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        isWeekly7Wins
                          ? 'bg-[#00F59B] text-[#0B0D13]'
                          : 'bg-[#1C2234] text-gray-300'
                      }`}
                    >
                      Weekly 7 Wins Boost ($34.99)
                    </button>
                  </div>

                  {!isWeekly7Wins ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1.5 uppercase">
                          Current Division
                        </label>
                        <select
                          value={currentDiv}
                          onChange={(e) => setCurrentDiv(Number(e.target.value))}
                          className="w-full bg-[#1C2234] border border-[#262B3D] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
                        >
                          {DIVISION_RIVALS_TIERS.map((tier) => (
                            <option key={tier.id} value={tier.id} className="bg-[#141824]">
                              {tier.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1.5 uppercase">
                          Target Division
                        </label>
                        <select
                          value={targetDiv}
                          onChange={(e) => setTargetDiv(Number(e.target.value))}
                          className="w-full bg-[#1C2234] border border-[#262B3D] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#00F59B]"
                        >
                          {DIVISION_RIVALS_TIERS.filter((t) => t.id <= currentDiv).map((tier) => (
                            <option key={tier.id} value={tier.id} className="bg-[#141824]">
                              {tier.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#0B0D13] border border-[#262B3D] text-xs text-gray-300 space-y-1">
                      <p className="font-bold text-white">Guaranteed 7 Weekly Wins in Your Current Division</p>
                      <p className="text-gray-400">
                        Maximized upgrade rewards before Thursday weekly reset. Fast completion within 2-4 hours.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'coins' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Coin Quantity: <span className="text-white text-sm font-black">{coinAmountK >= 1000 ? (coinAmountK/1000).toFixed(1) + 'M' : coinAmountK + 'K'} Coins</span>
                    </label>
                    <span className="text-xs font-bold text-[#00F59B]">100% EA 5% Tax Covered</span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={coinAmountK}
                    onChange={(e) => setCoinAmountK(Number(e.target.value))}
                    className="w-full accent-[#00F59B] cursor-pointer h-2 bg-[#1C2234] rounded-lg"
                  />

                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    {[250, 500, 1000, 2000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCoinAmountK(amt)}
                        className={`py-1.5 rounded-lg border text-xs font-bold ${
                          coinAmountK === amt
                            ? 'bg-[#00F59B] text-[#0B0D13] border-[#00F59B]'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-300'
                        }`}
                      >
                        {amt >= 1000 ? `${amt / 1000}M Coins` : `${amt}K Coins`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Add-on Options */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-2.5">
                  Step 3: Optional Speed & Security Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADDONS_DATA.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#0B0D13] border-[#00F59B]/60 text-white shadow-sm'
                            : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white">{addon.name}</span>
                            {addon.badge && (
                              <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-[#00F59B]/20 text-[#00F59B]">
                                {addon.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block">{addon.description}</span>
                        </div>

                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
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

            {/* RIGHT 4 COLS: ORDER SUMMARY CARD */}
            <div className="lg:col-span-4 bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#262B3D]">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Configuration Summary
                  </span>
                  <span className="text-[10px] text-[#00F59B] font-bold bg-[#00F59B]/10 px-2 py-0.5 rounded">
                    VPN INCLUDED
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Service:</span>
                    <span className="font-bold text-white text-right">
                      {activeTab === 'champions'
                        ? selectedRank.name
                        : activeTab === 'rivals'
                        ? isWeekly7Wins ? 'Weekly 7 Wins' : `Div ${currentDiv} → Div ${targetDiv}`
                        : `${coinAmountK}K Coins`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Platform:</span>
                    <span className="font-bold text-white uppercase">{selectedPlatform}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Active Add-ons:</span>
                    <span className="font-bold text-[#00F59B]">{selectedAddons.length} Selected</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-400">Estimated Delivery:</span>
                    <span className="font-bold text-white">
                      {activeTab === 'champions' ? selectedRank.estimatedTime : '2 - 4 Hours'}
                    </span>
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="pt-4 border-t border-[#262B3D] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Total in USD</span>
                    <span className="text-3xl font-black text-[#00F59B] tracking-tight">
                      ${currentPrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">Fixed USD Rate</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={handleOrderWithWhatsAppDiscord}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#5865F2] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
                >
                  <span>Order Now (WhatsApp / Discord)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleInstantCheckout}
                    className="py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Instant Pay</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
