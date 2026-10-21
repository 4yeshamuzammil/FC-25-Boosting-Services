import { useApp } from '../context/AppContext';
import { OTHER_SERVICES } from '../data/mockData';
import { Trophy, Award, Zap, GraduationCap, Target, Coins, ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';

export default function AllServicesPage() {
  const { addToCart, setIsCartOpen, openContactModal, setCurrentPage } = useApp();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Trophy': return Trophy;
      case 'Award': return Award;
      case 'Zap': return Zap;
      case 'GraduationCap': return GraduationCap;
      case 'Target': return Target;
      default: return Coins;
    }
  };

  const handleBuy = (service, directCheckout = false) => {
    addToCart({
      serviceId: service.id + '-' + Date.now(),
      serviceName: service.title,
      details: `${service.tagline} • Multi-Platform Supported`,
      price: service.startingPrice,
      platform: 'ps5',
    });

    if (directCheckout) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="w-full py-6 sm:py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Page Hero Header with Stadium Imagery */}
        <div className="bg-gradient-to-r from-[#141824] via-[#1C2234] to-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none opacity-20 overflow-hidden">
            <img
              src="/images/stadium-bg.jpg"
              alt="FC Stadium"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141824] via-[#141824]/70 to-transparent" />
          </div>

          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
              COMPLETE CATALOG
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              All FC 25 & FC 26 Boosting Packages
            </h1>
            <p className="text-sm sm:text-base text-gray-300">
              Browse special bundle deals, Draft wins, Coaching sessions, and Milestone player objectives.
            </p>
          </div>
        </div>

        {/* Services Grid with Real FIFA Pictures */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OTHER_SERVICES.map((srv) => {
            const Icon = getIcon(srv.icon);
            return (
              <div
                key={srv.id}
                className="bg-[#141824] hover:bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/50 rounded-3xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl hover:-translate-y-1 duration-300"
              >
                {/* FIFA Picture Banner */}
                {srv.image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#080A0F]">
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141824] via-transparent to-black/30" />

                    {srv.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#00F59B] text-[#0B0D13] shadow-md">
                          {srv.badge}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    
                    {/* Top Bar Icon & Category */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center text-[#00F59B] group-hover:border-[#00F59B]/50 transition-colors shrink-0">
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                          {srv.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight group-hover:text-[#00F59B] transition-colors leading-tight">
                          {srv.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {srv.tagline}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-[#262B3D]/70 text-xs">
                      {srv.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Bottom Pricing & Actions */}
                  <div className="pt-6 mt-4 border-t border-[#262B3D]">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs text-gray-400">Starting from</span>
                      <span className="text-2xl font-black text-[#00F59B]">
                        ${srv.startingPrice} <span className="text-xs text-gray-400 font-normal">USD</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          openContactModal({
                            serviceName: srv.title,
                            details: `${srv.tagline} • Multi-Platform Supported`,
                            price: srv.startingPrice,
                            platform: 'ps5',
                          });
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#5865F2] hover:opacity-95 text-[#0B0D13] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#00F59B]/10 flex items-center justify-center space-x-1.5"
                      >
                        <span>Order with WhatsApp / Discord</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleBuy(srv, false)}
                          className="py-2 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuy(srv, true)}
                          className="py-2 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] text-xs font-black uppercase transition-colors cursor-pointer"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
