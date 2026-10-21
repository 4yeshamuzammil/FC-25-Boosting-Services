import { Star, CheckCircle, ShieldCheck, ThumbsUp } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/mockData';

export default function ReviewsSection() {
  return (
    <section id="reviews" className="w-full py-16 bg-[#0B0D13] select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header with Trustpilot rating summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#262B3D]/80 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#00F59B]">
              REAL TIME COMMUNITY FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Verified Customer Reviews
            </h2>
            <p className="text-sm text-gray-400">
              Thousands of Ultimate Team players trust us every weekend. Here is what they have to say.
            </p>
          </div>

          {/* Trust Score Card */}
          <div className="flex items-center space-x-3.5 bg-[#141824] border border-[#262B3D] px-5 py-3 rounded-2xl shrink-0">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#00F59B] text-[#00F59B]" />
              ))}
            </div>
            <div className="border-l border-[#262B3D] pl-3.5 text-left leading-tight">
              <div className="text-sm font-black text-white">4.9 / 5.0 Rating</div>
              <div className="text-[11px] text-gray-400">Based on 2,450+ verified boosts</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#141824] border border-[#262B3D] hover:border-[#00F59B]/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
            >
              <div className="space-y-3">
                
                {/* Top Row: Stars + Platform + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00F59B] text-[#00F59B]" />
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#0B0D13] border border-[#262B3D] text-gray-300 px-2 py-0.5 rounded">
                      {review.platform}
                    </span>
                    <span className="text-[10px] text-gray-500">{review.date}</span>
                  </div>
                </div>

                {/* Service Tag */}
                <div className="text-xs font-bold text-[#00F59B]">
                  {review.service}
                </div>

                {/* Comment */}
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Bottom: Author & Booster attribution */}
              <div className="pt-3 border-t border-[#262B3D]/70 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  <span>{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center text-[10px] text-[#00F59B]">
                      <CheckCircle className="w-3 h-3 ml-0.5 inline" />
                    </span>
                  )}
                </div>

                <div className="text-gray-400 text-[10px]">
                  Booster: <span className="text-gray-200 font-semibold">{review.booster}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
