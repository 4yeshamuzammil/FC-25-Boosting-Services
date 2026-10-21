import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiContract';
import { X, Search, ShieldCheck, CheckCircle2, Clock, PlayCircle, Trophy, User } from 'lucide-react';

export default function OrderTrackerModal() {
  const { isTrackerOpen, setIsTrackerOpen, trackerSearchId } = useApp();

  const [searchQuery, setSearchQuery] = useState(trackerSearchId || 'FC-94821');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (trackerSearchId) {
      setSearchQuery(trackerSearchId);
      performSearch(trackerSearchId);
    } else {
      performSearch('FC-94821');
    }
  }, [trackerSearchId, isTrackerOpen]);

  const performSearch = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const result = await apiClient.trackOrder(query);
      setOrderData(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  if (!isTrackerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setIsTrackerOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#00F59B]">
            LIVE PROGRESS MONITOR
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            Order & Booster Tracker
          </h3>
          <p className="text-xs text-gray-400">
            Enter your Order ID (e.g. FC-94821) to view real-time match results and booster status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex space-x-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. FC-94821)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#00F59B]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {isLoading ? (
            <div className="py-12 text-center text-gray-400 animate-pulse">
              Connecting to secure match tracking server...
            </div>
          ) : !orderData ? (
            <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-8 text-center space-y-2">
              <p className="text-white font-bold">No order found with ID "{searchQuery}"</p>
              <p className="text-gray-400">
                Please verify the ID from your confirmation email or try sample order: <span className="text-[#00F59B] font-bold cursor-pointer" onClick={() => performSearch('FC-94821')}>FC-94821</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Order Status Card */}
              <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262B3D] gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-white">{orderData.id}</span>
                      <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded border border-[#00F59B]/20">
                        {orderData.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">{orderData.serviceName}</span>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-lg font-black text-[#00F59B]">
                      ${Number(orderData.price).toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-gray-400 block">Payment Confirmed</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">Live Match Progress:</span>
                    <span className="font-black text-[#00F59B]">{orderData.currentScore || 'In Queue'}</span>
                  </div>
                  <div className="w-full bg-[#1C2234] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00F59B] h-full rounded-full transition-all duration-500 shadow-sm shadow-[#00F59B]"
                      style={{ width: `${orderData.progress || 35}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Pro Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#141824] p-3 rounded-xl border border-[#262B3D] space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Assigned Pro Booster</span>
                    <span className="text-xs font-black text-white flex items-center space-x-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>{orderData.boosterName || 'Top 100 Pro'}</span>
                    </span>
                  </div>

                  <div className="bg-[#141824] p-3 rounded-xl border border-[#262B3D] space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">VPN Encryption Route</span>
                    <span className="text-xs font-black text-[#00F59B] flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{orderData.boosterVpn || 'Dedicated Local IP'}</span>
                    </span>
                  </div>
                </div>

                {/* Milestones Steps */}
                <div className="pt-2 border-t border-[#262B3D]/70 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Security & Handover Protocol
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="flex items-center space-x-2 text-[#00F59B] bg-[#141824] p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>1. Payment Verified</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#00F59B] bg-[#141824] p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>2. VPN Connected</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white bg-[#141824] p-2 rounded-lg">
                      <PlayCircle className="w-4 h-4 text-[#00F59B] shrink-0" />
                      <span>3. Boost Running</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#262B3D] flex items-center justify-between text-xs text-gray-400">
          <span>Need to pause your account? Ping 24/7 Live Desk</span>
          <span className="text-white font-bold">Encrypted Session</span>
        </div>

      </div>
    </div>
  );
}
