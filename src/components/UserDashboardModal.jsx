import { useApp } from '../context/AppContext';
import { X, LogOut, CheckCircle, Clock, ShieldCheck, ExternalLink, Trophy } from 'lucide-react';

export default function UserDashboardModal() {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    user,
    logout,
    orders,
    openTrackerWithId,
  } = useApp();

  if (!isDashboardOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDashboardOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#262B3D] gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B] flex items-center justify-center text-xl font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white">{user.name}</h3>
                <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded border border-[#00F59B]/20">
                  VERIFIED CLIENT
                </span>
              </div>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              setIsDashboardOpen(false);
            }}
            className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-[#FF3B30] bg-[#0B0D13] px-3.5 py-2 rounded-xl border border-[#262B3D] self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab & Stats Bar */}
        <div className="py-4 flex items-center justify-between text-xs">
          <span className="font-black uppercase tracking-wider text-white">
            My Boosting Orders ({orders.length})
          </span>
          <span className="text-gray-400">
            VPN Encrypted & Tracked
          </span>
        </div>

        {/* Orders Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No active orders found. Place your first boost from the store!
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-4 space-y-3 hover:border-[#00F59B]/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-white text-sm">{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      order.status === 'Completed'
                        ? 'bg-[#00F59B]/20 text-[#00F59B]'
                        : 'bg-[#FFB800]/20 text-[#FFB800]'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-400">
                    <span>{order.orderDate}</span>
                    <span className="font-black text-white text-sm">
                      ${Number(order.price).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="text-gray-300 font-semibold">
                  {order.serviceName}
                </div>

                <div className="text-gray-400 text-[11px] leading-relaxed">
                  {order.details}
                </div>

                {/* Booster & Tracking action */}
                <div className="pt-2 border-t border-[#262B3D]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="text-gray-400">
                    Booster: <span className="text-white font-bold">{order.boosterName || 'Assigning Top Pro...'}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsDashboardOpen(false);
                      openTrackerWithId(order.id);
                    }}
                    className="text-[#00F59B] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Live Match Tracker</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-4 border-t border-[#262B3D] flex items-center justify-between text-xs text-gray-400">
          <span>Need help with an order? Contact 24/7 Live Desk</span>
          <span className="text-[#00F59B] font-bold">100% Ban-Free Protected</span>
        </div>

      </div>
    </div>
  );
}
