import { useApp } from '../context/AppContext';
import { Trophy, Zap, Coins, Sparkles, ArrowRight, ShieldCheck, Star, Check } from 'lucide-react';

export default function FeaturedServicesGrid() {
  const { setCurrentPage, openContactModal } = useApp();

  const services = [
    {
      id: 'ut-champions',
      page: 'ut-champions',
      title: 'UT Champions Weekend League',
      tagline: 'Guaranteed Rank 1 to 7 with top-tier pack rewards',
      image: '/images/hero-fc-card.jpg',
      badge: 'TOP PICK • RANK 1',
      badgeColor: 'bg-[#00F59B] text-[#0B0D13]',
      price: '$24.99',
      rawPrice: 24.99,
      rating: 4.9,
      reviewsCount: 1420,
      features: [
        'Guaranteed Wins (Up to 20-0)',
        '100% Regional Ban-Free VPN',
        'Optional 1080p Discord Stream',
        'Top 200 Pro Boosters Only',
      ],
    },
    {
      id: 'division-rivals',
      page: 'division-rivals',
      title: 'Division Rivals Rank Promotion',
      tagline: 'Climb from Div 10 to Elite + Weekly 7 Wins',
      image: '/images/rivals-action.jpg',
      badge: 'HOT • POPULAR',
      badgeColor: 'bg-[#FFB800] text-[#0B0D13]',
      price: '$19.99',
      rawPrice: 19.99,
      rating: 4.9,
      reviewsCount: 980,
      features: [
        'Rapid Division Promotion to Elite',
        'Weekly 7 Wins Guarantee',
        'Piloted or Duo Self-Play',
        'Starts in ~15 Minutes',
      ],
    },
    {
      id: 'coins',
      page: 'coins',
      title: 'Buy EAFC 25 Coins (Safe Transfer)',
      tagline: 'Comfort trade with 100% EA transfer tax covered',
      image: '/images/coins-bundle.jpg',
      badge: 'INSTANT • TAX COVERED',
      badgeColor: 'bg-[#00F59B] text-[#0B0D13]',
      price: '$11.80',
      rawPrice: 11.80,
      rating: 5.0,
      reviewsCount: 3100,
      features: [
        'Per 100K Coins Rate',
        '5% EA Tax Completely Covered',
        'Automated Ban-Free Player Auctions',
        'Delivered in Under 30 Mins',
      ],
    },
    {
      id: 'all-services',
      page: 'all-services',
      title: 'Champions Play-Offs & Milestones',
      tagline: 'Direct qualification passes, Swaps & Player Objectives',
      image: '/images/player-celebration.jpg',
      badge: 'SEASON PASS',
      badgeColor: 'bg-[#FF3B30] text-white',
      price: '$17.50',
      rawPrice: 17.50,
      rating: 4.8,
      reviewsCount: 650,
      features: [
        'Guaranteed Play-Offs Qualification',
        'Special Player Card Milestones',
        'Squad Battles / Swaps Grinding',
        'Multi-Platform (PS5/Xbox/PC)',
      ],
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262B3D] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL EA SPORTS FC 25 PACKAGES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Featured Pro Boosting Services
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              Choose your competitive mode below. Every service is fulfilled by verified Top 200 esports players with strict regional VPN stealth.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('all-services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-xs font-bold text-white uppercase tracking-wider inline-flex items-center space-x-2 transition-all hover:border-[#00F59B]/40 cursor-pointer"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Card Picture Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#141824] hover:bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/50 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-2xl hover:shadow-[#00F59B]/5 hover:-translate-y-1"
            >
              {/* Card Picture Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#080A0F]">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141824] via-transparent to-black/40" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg ${srv.badgeColor}`}>
                    {srv.badge}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-[#FFB800] border border-white/10">
                  <Star className="w-3 h-3 fill-[#FFB800]" />
                  <span>{srv.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-[#00F59B] transition-colors leading-tight">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {srv.tagline}
                  </p>

                  {/* Bullet Points */}
                  <div className="pt-2 space-y-1.5 border-t border-[#262B3D]/60">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-[#262B3D] space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Starting at</span>
                      <span className="text-xl sm:text-2xl font-black text-[#00F59B] tracking-tight">{srv.price}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold bg-[#0B0D13] px-2 py-0.5 rounded border border-[#262B3D]">
                      PS5 • XBOX • PC
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(srv.page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                    >
                      Configure
                    </button>

                    <button
                      onClick={() => {
                        openContactModal({
                          serviceName: srv.title,
                          details: srv.tagline,
                          price: srv.rawPrice,
                          platform: 'ps5',
                        });
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
