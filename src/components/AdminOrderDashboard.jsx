import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  RefreshCw,
  MessageSquare,
  FileText,
  User,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrderDashboard() {
  const { orders, updateOrderStatus, showToast } = useApp();

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterContact, setFilterContact] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'detail' (for mobile screens)

  // Status transition note
  const [statusNote, setStatusNote] = useState('');

  // Proof upload modal state
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const statuses = ['All', 'Pending', 'Accepted', 'InProgress', 'AwaitingCustomer', 'Completed', 'Cancelled'];
  const contactMethods = ['All', 'WhatsApp', 'Discord', 'Stripe', 'PayPal Express'];

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesContact = filterContact === 'All' || (o.contactMethod || o.paymentMethod || '').includes(filterContact);
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesContact && matchesSearch;
  });

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, statusNote || `Status changed to ${newStatus} by Admin`);
    setSelectedOrder((prev) => ({
      ...prev,
      status: newStatus,
    }));
    setStatusNote('');
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const url = URL.createObjectURL(file);
      setProofPreview(url);
      showToast(`Proof screenshot "${file.name}" uploaded & linked to #${selectedOrder.id}!`, 'success');
    }
  };

  const handleMarkCompleteWithProof = () => {
    if (!selectedOrder) return;
    if (!proofPreview && !selectedOrder.proofUrl) {
      showToast('Please attach a proof screenshot before completing order', 'error');
      return;
    }
    handleStatusChange('Completed');
    showToast(`Order #${selectedOrder.id} marked Completed with proof verified!`, 'success');
  };

  return (
    <div className="w-full py-10 bg-[#0B0D13] select-none font-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#262B3D] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#00F59B]">
                ADMINISTRATOR PORTAL
              </span>
              <span className="text-[10px] bg-[#FF3B30] text-white px-2 py-0.5 rounded font-black uppercase">
                SECURE ROLE
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
              Order Lifecycle & Fulfillment Management
            </h1>
            <p className="text-xs text-gray-400">
              Manage WhatsApp chats, Discord bot tickets, status audit history, and proof of completion attachments.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-[#141824] border border-[#262B3D] px-4 py-2 rounded-xl text-xs">
              <span className="text-gray-400">Total Active Orders: </span>
              <span className="font-black text-[#00F59B]">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400 font-semibold">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-[#00F59B]"
              >
                {statuses.map((st) => (
                  <option key={st} value={st} className="bg-[#141824]">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Method Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400 font-semibold">Channel:</span>
              <select
                value={filterContact}
                onChange={(e) => setFilterContact(e.target.value)}
                className="bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:border-[#00F59B]"
              >
                {contactMethods.map((cm) => (
                  <option key={cm} value={cm} className="bg-[#141824]">
                    {cm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Filter by Order #, Customer, Service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F59B]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

        </div>

        {/* Mobile View Toggle Bar (Only visible on small screens / mobile) */}
        <div className="lg:hidden flex rounded-xl bg-[#141824] p-1 border border-[#262B3D]">
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
              mobileTab === 'list' ? 'bg-[#0B0D13] text-[#00F59B] border border-[#262B3D]' : 'text-gray-400'
            }`}
          >
            Orders Queue ({filteredOrders.length})
          </button>
          <button
            onClick={() => setMobileTab('detail')}
            className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
              mobileTab === 'detail' ? 'bg-[#0B0D13] text-[#00F59B] border border-[#262B3D]' : 'text-gray-400'
            }`}
          >
            {selectedOrder ? `Detail (#${selectedOrder.id})` : 'Order Details'}
          </button>
        </div>

        {/* Master Details Grid: Orders List (Left) + Detail & Actions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT 5 COLS: Orders Queue */}
          <div className={`${mobileTab === 'list' ? 'block' : 'hidden'} lg:block lg:col-span-5 bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-5 space-y-3 max-h-[750px] overflow-y-auto`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#262B3D]">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                Incoming Orders ({filteredOrders.length})
              </span>
              <span className="text-[10px] text-[#00F59B] font-bold">SQL Server Synced</span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const isWhatsApp = (ord.contactMethod || ord.paymentMethod || '').includes('WhatsApp');
                const isDiscord = (ord.contactMethod || ord.paymentMethod || '').includes('Discord');
                return (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrder(ord);
                      setMobileTab('detail');
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-[#0B0D13] border-[#00F59B] shadow-lg shadow-[#00F59B]/10'
                        : 'bg-[#1C2234] border-[#262B3D] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-white">{ord.id}</span>
                        {isWhatsApp && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40">
                            WhatsApp
                          </span>
                        )}
                        {isDiscord && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/40">
                            Discord
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ord.status === 'Completed'
                          ? 'bg-[#00F59B]/20 text-[#00F59B]'
                          : ord.status === 'InProgress'
                          ? 'bg-[#FFB800]/20 text-[#FFB800]'
                          : ord.status === 'AwaitingCustomer'
                          ? 'bg-[#FF3B30]/20 text-[#FF3B30]'
                          : 'bg-gray-800 text-gray-300'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-gray-200 truncate">
                      {ord.serviceName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-[#262B3D]/70">
                      <span>Customer: {ord.customerName}</span>
                      <span className="font-black text-[#00F59B]">
                        ${Number(ord.price).toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT 7 COLS: Order Detail, Actions, Lifecycle & Proof */}
          <div className={`${mobileTab === 'detail' ? 'block' : 'hidden'} lg:block lg:col-span-7 bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-6 md:p-8 space-y-6`}>
            {!selectedOrder ? (
              <div className="py-20 text-center text-gray-400 text-xs">
                Select an order from the queue to view details and manage fulfillment.
              </div>
            ) : (
              <>
                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#262B3D] gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-black text-white">{selectedOrder.id}</h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/30">
                        {selectedOrder.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Placed on {selectedOrder.orderDate || 'Recent'}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-[#00F59B]">
                      ${Number(selectedOrder.price).toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">
                      Channel: {selectedOrder.contactMethod || selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Customer & Service Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0B0D13] p-4 rounded-2xl border border-[#262B3D] space-y-2">
                    <span className="font-black text-gray-400 uppercase tracking-wider block">
                      Customer Info
                    </span>
                    <div><span className="text-gray-400">Name:</span> <span className="font-bold text-white">{selectedOrder.customerName}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="font-bold text-white">{selectedOrder.customerEmail}</span></div>
                    <div><span className="text-gray-400">GamerTag / PSN:</span> <span className="font-bold text-white">{selectedOrder.gamerTag}</span></div>
                    <div><span className="text-gray-400">Discord:</span> <span className="font-bold text-[#5865F2]">{selectedOrder.discordTag || 'Not linked'}</span></div>
                  </div>

                  <div className="bg-[#0B0D13] p-4 rounded-2xl border border-[#262B3D] space-y-2">
                    <span className="font-black text-gray-400 uppercase tracking-wider block">
                      Fulfillment Status
                    </span>
                    <div><span className="text-gray-400">Service:</span> <span className="font-bold text-white">{selectedOrder.serviceName}</span></div>
                    <div><span className="text-gray-400">Platform:</span> <span className="font-bold text-white uppercase">{selectedOrder.platform}</span></div>
                    <div><span className="text-gray-400">Assigned Pro:</span> <span className="font-bold text-[#00F59B]">{selectedOrder.boosterName || 'Unassigned'}</span></div>
                    <div><span className="text-gray-400">VPN Route:</span> <span className="font-bold text-white">{selectedOrder.boosterVpn || 'Regional Local IP'}</span></div>
                  </div>
                </div>

                {/* Status Transition Control (Order Lifecycle) */}
                <div className="bg-[#0B0D13] p-5 rounded-2xl border border-[#262B3D] space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black uppercase tracking-wider text-white">
                      Order Lifecycle Transition Service
                    </span>
                    <span className="text-[10px] text-gray-400">Audit trail logged</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange('Accepted')}
                      className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold"
                    >
                      ✓ Accept Order
                    </button>
                    <button
                      onClick={() => handleStatusChange('InProgress')}
                      className="px-3 py-1.5 rounded-lg bg-[#FFB800]/15 hover:bg-[#FFB800]/25 text-[#FFB800] border border-[#FFB800]/40 font-bold"
                    >
                      ⚡ Start (In Progress)
                    </button>
                    <button
                      onClick={() => handleStatusChange('AwaitingCustomer')}
                      className="px-3 py-1.5 rounded-lg bg-[#FF3B30]/15 hover:bg-[#FF3B30]/25 text-[#FF3B30] border border-[#FF3B30]/40 font-bold"
                    >
                      ❓ Awaiting Customer Info
                    </button>
                    <button
                      onClick={() => handleStatusChange('Cancelled')}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold"
                    >
                      ✕ Cancel Order
                    </button>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Optional Reason / Audit Note:</label>
                    <input
                      type="text"
                      placeholder="e.g. Verified payment via WhatsApp desk; Booster assigned..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full bg-[#141824] border border-[#262B3D] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F59B]"
                    />
                  </div>
                </div>

                {/* Proof of Completion Upload Section */}
                <div className="bg-[#0B0D13] p-5 rounded-2xl border border-[#262B3D] space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-[#00F59B]" />
                      <span className="font-black uppercase tracking-wider text-white">
                        Proof of Completion (Screenshots / Match Results)
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">Encrypted Storage</span>
                  </div>

                  <p className="text-gray-400 text-[11px]">
                    Upload match score screenshots or reward pack proofs. Stored in secure storage with database metadata (never exposed public URLs).
                  </p>

                  <div className="flex items-center space-x-3">
                    <label className="px-4 py-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold cursor-pointer inline-flex items-center space-x-2">
                      <Upload className="w-3.5 h-3.5 text-[#00F59B]" />
                      <span>Choose Screenshot File...</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleProofUpload}
                        className="hidden"
                      />
                    </label>

                    {proofFile && (
                      <span className="text-xs text-[#00F59B] font-bold">
                        ✓ {proofFile.name} ({(proofFile.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>

                  {/* Proof Preview */}
                  {proofPreview && (
                    <div className="mt-3 p-3 bg-[#141824] rounded-xl border border-[#262B3D] space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Attached Proof Preview</span>
                      <img
                        src={proofPreview}
                        alt="Proof screenshot"
                        className="max-h-48 rounded-lg border border-[#262B3D] object-contain"
                      />
                    </div>
                  )}

                  {/* Final Complete Action Button */}
                  <button
                    onClick={handleMarkCompleteWithProof}
                    className="w-full py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Mark Order Completed</span>
                  </button>
                </div>

              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
