import { Trophy, Clock, ShieldCheck, DollarSign, Headphones, Check } from 'lucide-react';

export default function ValueProposition() {
  const valueItems = [
    {
      icon: Trophy,
      title: 'Pro FC Players',
      highlight: 'Top 200 Verified Only',
      desc: 'Our boosters are verified FIFA Global Series competitors, elite division veterans, and top 200 leaderboard players.',
      color: 'text-[#FFB800]',
      bgColor: 'bg-[#FFB800]/10',
      borderColor: 'border-[#FFB800]/20',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      highlight: 'Starts in 15–30 Mins',
      desc: 'No waiting days for your boost. Orders are matched with available pro boosters immediately after payment confirmation.',
      color: 'text-[#00F59B]',
      bgColor: 'bg-[#00F59B]/10',
      borderColor: 'border-[#00F59B]/20',
    },
    {
      icon: ShieldCheck,
      title: 'Maximum Security',
      highlight: '100% Ban-Free Record',
      desc: 'Every session runs through dedicated, platform-specific premium VPNs matching your exact country, city, and IP subnet.',
      color: 'text-[#00F59B]',
      bgColor: 'bg-[#00F59B]/10',
      borderColor: 'border-[#00F59B]/20',
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      highlight: 'Zero Hidden Fees',
      desc: 'Transparent pricing with tax covered, volume discounts, and guaranteed rewards. We match or beat any verified competitor price.',
      color: 'text-[#00F59B]',
      bgColor: 'bg-[#00F59B]/10',
      borderColor: 'border-[#00F59B]/20',
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Support',
      highlight: 'Instant Live Chat',
      desc: 'Direct communication with our operations desk and your assigned booster. Real-time updates every match with screenshots.',
      color: 'text-[#FF3B30]',
      bgColor: 'bg-[#FF3B30]/10',
      borderColor: 'border-[#FF3B30]/20',
    },
  ];

  return (
    <section id="why-us" className="w-full py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
            WHY CHOOSE FC BOOST PRO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Built For Serious Ultimate Team Players
          </h2>
          <p className="text-sm text-gray-400">
            We deliver the safest, highest-win-rate boosting experience in EA Sports FC with zero compromises on security.
          </p>
        </div>

        {/* 5-Item Value Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {valueItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] hover:border-[#00F59B]/40 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5">
                      {item.highlight}
                    </span>
                    <h3 className="text-base font-black text-white uppercase tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#262B3D]/70 flex items-center space-x-1.5 text-[11px] font-bold text-[#00F59B]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed Included</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
