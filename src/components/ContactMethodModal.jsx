import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MessageSquare, ArrowRight, Check, ExternalLink, ShieldCheck, Sparkles, Copy, AlertCircle } from 'lucide-react';

export default function ContactMethodModal() {
  const {
    isContactModalOpen,
    setIsContactModalOpen,
    activeOrderForContact,
    createOrder,
    openTrackerWithId,
    showToast,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'discord'
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState(null);

  if (!isContactModalOpen || !activeOrderForContact) return null;

  // Business configuration (can be configured via backend / environment)
  const WHATSAPP_BUSINESS_PHONE = '1234567890'; // Replace with real WhatsApp Business number
  const DISCORD_COMMUNITY_INVITE_URL = 'https://discord.gg/fcboostpro'; // Discord Server Invite
  const DISCORD_BOT_CHANNEL_URL = 'https://discord.com/channels/@me'; // Discord Order Channel / Bot Link

  // Generate unique order reference code
  const orderRef = createdOrderRef || `FC-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  // Construct WhatsApp Prefilled Message
  const prefilledWhatsAppMessage = `Hello FC BOOST PRO team! 🎮

I would like to place an order:
• Service: ${activeOrderForContact.serviceName}
• Platform: ${(activeOrderForContact.platform || 'PS5').toUpperCase()}
• Price: $${Number(activeOrderForContact.price).toFixed(2)} USD
• Order Reference: ${orderRef}
• Client: ${user ? user.name : 'Guest Customer'}

Please confirm booster availability and let's proceed with payment & setup. Thank you!`;

  const encodedWhatsAppUrl = `https://wa.me/${WHATSAPP_BUSINESS_PHONE}?text=${encodeURIComponent(prefilledWhatsAppMessage)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(prefilledWhatsAppMessage);
    setIsCopied(true);
    showToast('Order details copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleContinueWithWhatsApp = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create order in persistent storage / SQL Server backend
      const orderPayload = {
        id: orderRef,
        userId: user ? user.id : 'guest',
        customerName: user ? user.name : 'WhatsApp Customer',
        customerEmail: user ? user.email : 'whatsapp_order@customer.com',
        gamerTag: 'Pending via WhatsApp Chat',
        serviceName: activeOrderForContact.serviceName,
        details: activeOrderForContact.details || 'Initiated via Official WhatsApp',
        price: Number(activeOrderForContact.price),
        platform: activeOrderForContact.platform || 'ps5',
        paymentMethod: 'WhatsApp Direct Pay',
        contactMethod: 'WhatsApp',
        whatsAppReference: orderRef,
      };

      await createOrder(orderPayload);
      setCreatedOrderRef(orderRef);
      showToast(`Order #${orderRef} created! Opening WhatsApp...`, 'success');

      // 2. Open official WhatsApp conversation in new window/tab
      window.open(encodedWhatsAppUrl, '_blank', 'noopener,noreferrer');
    } catch {
      showToast('Error registering order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithDiscord = async (actionType = 'bot') => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        id: orderRef,
        userId: user ? user.id : 'guest',
        customerName: user ? user.name : 'Discord Customer',
        customerEmail: user ? user.email : 'discord_order@customer.com',
        gamerTag: user?.discordTag || 'Pending via Discord Ticket',
        serviceName: activeOrderForContact.serviceName,
        details: activeOrderForContact.details || 'Initiated via Discord Community Bot',
        price: Number(activeOrderForContact.price),
        platform: activeOrderForContact.platform || 'ps5',
        paymentMethod: 'Discord Ticket / Crypto / Card',
        contactMethod: 'Discord',
        discordChannelId: 'ticket-bot',
      };

      await createOrder(orderPayload);
      setCreatedOrderRef(orderRef);

      if (actionType === 'invite') {
        window.open(DISCORD_COMMUNITY_INVITE_URL, '_blank', 'noopener,noreferrer');
        showToast(`Joined Discord? Use Order #${orderRef} in the #order-here channel`, 'info');
      } else {
        // Direct to Discord Bot channel / Webhook
        window.open(DISCORD_BOT_CHANNEL_URL, '_blank', 'noopener,noreferrer');
        showToast(`Opening Discord Bot with Order #${orderRef}...`, 'success');
      }
    } catch {
      showToast('Error registering Discord order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="w-full max-w-xl bg-[#141824] border border-[#262B3D] rounded-3xl p-4 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 flex flex-col space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsContactModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-[10px] sm:text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Preferred Contact Method</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Order Confirmation & Support
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400">
            Choose how you would like to communicate with our verified boosting managers.
          </p>
        </div>

        {/* Selected Service Recap Card */}
        <div className="bg-[#0B0D13] border border-[#262B3D] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#00F59B]">
              Selected Service
            </span>
            <h4 className="text-xs sm:text-sm font-black text-white">{activeOrderForContact.serviceName}</h4>
            <p className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-1">{activeOrderForContact.details || 'Standard Configuration'}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Total</span>
            <span className="text-lg sm:text-xl font-black text-[#00F59B]">
              ${Number(activeOrderForContact.price).toFixed(2)} <span className="text-[10px] text-gray-300">USD</span>
            </span>
          </div>
        </div>

        {/* Contact Method Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          
          {/* WhatsApp Tab Button */}
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[44px] ${
              activeTab === 'whatsapp'
                ? 'bg-[#0B0D13] border-[#25D366] text-white shadow-lg shadow-[#25D366]/10'
                : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                WhatsApp
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug line-clamp-2">
              Instant 1-on-1 direct chat with our desk.
            </p>
            {activeTab === 'whatsapp' && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#25D366]" />
            )}
          </button>

          {/* Discord Tab Button */}
          <button
            onClick={() => setActiveTab('discord')}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[44px] ${
              activeTab === 'discord'
                ? 'bg-[#0B0D13] border-[#5865F2] text-white shadow-lg shadow-[#5865F2]/10'
                : 'bg-[#1C2234] border-[#262B3D] text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                Discord
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug line-clamp-2">
              Private ticket, live stream, bot commands.
            </p>
            {activeTab === 'discord' && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#5865F2]" />
            )}
          </button>

        </div>

        {/* Tab Specific Content */}
        {activeTab === 'whatsapp' ? (
          <div className="space-y-3 sm:space-y-4 bg-[#0B0D13] p-3.5 sm:p-5 rounded-2xl border border-[#262B3D] text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#262B3D]">
              <span className="font-bold text-white uppercase text-[10px] sm:text-[11px]">
                WhatsApp Prefilled Message
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#25D366] font-black bg-[#25D366]/10 px-2 py-0.5 rounded">
                Ref: {orderRef}
              </span>
            </div>

            <div className="space-y-1.5 text-gray-300">
              <div className="bg-[#141824] p-2.5 sm:p-3 rounded-xl border border-[#262B3D] font-mono text-[10px] sm:text-[11px] text-gray-300 relative max-h-32 sm:max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{prefilledWhatsAppMessage}</pre>
                <button
                  onClick={handleCopyMessage}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#1C2234] hover:bg-[#262B3D] text-gray-300 hover:text-white"
                  title="Copy text"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#00F59B]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-[10px] sm:text-[11px] text-gray-400 bg-[#141824]/60 p-2 sm:p-2.5 rounded-xl border border-[#262B3D]">
              <AlertCircle className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
              <span>
                Opening WhatsApp does not auto-charge. Discuss squad, payment, and tactics directly with our team.
              </span>
            </div>

            <button
              onClick={handleContinueWithWhatsApp}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#25D366]/20 cursor-pointer disabled:opacity-50 min-h-[46px]"
            >
              <span>{isSubmitting ? 'Registering Order...' : 'Continue to Official WhatsApp'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 bg-[#0B0D13] p-3.5 sm:p-5 rounded-2xl border border-[#262B3D] text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#262B3D]">
              <span className="font-bold text-white uppercase text-[10px] sm:text-[11px]">
                Discord Server & Interactive Bot System
              </span>
              <span className="text-[10px] text-[#5865F2] font-black bg-[#5865F2]/10 px-2 py-0.5 rounded">
                Ref: {orderRef}
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed text-[11px] sm:text-xs">
              Our Discord bot creates a private, encrypted ticket channel for you, provides live match updates, and streams your booster in 1080p 60fps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              
              {/* Option 1: Not a member */}
              <div className="bg-[#141824] p-3 sm:p-4 rounded-xl border border-[#262B3D] space-y-1.5">
                <span className="font-black text-white text-[11px] uppercase block">
                  1. New to our Discord?
                </span>
                <p className="text-[10px] text-gray-400">
                  Join our verified community with 15,000+ FIFA players.
                </p>
                <button
                  onClick={() => handleContinueWithDiscord('invite')}
                  className="w-full py-2.5 rounded-lg bg-[#1C2234] hover:bg-[#262B3D] border border-[#262B3D] text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[38px]"
                >
                  <span>Join Discord Community</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Option 2: Already a member / Bot channel */}
              <div className="bg-[#141824] p-3 sm:p-4 rounded-xl border border-[#5865F2]/40 space-y-1.5">
                <span className="font-black text-[#5865F2] text-[11px] uppercase block">
                  2. Already in Server?
                </span>
                <p className="text-[10px] text-gray-400">
                  Direct to order ticket bot with your ref #{orderRef}.
                </p>
                <button
                  onClick={() => handleContinueWithDiscord('bot')}
                  className="w-full py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white font-black text-[11px] uppercase flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md shadow-[#5865F2]/20 min-h-[38px]"
                >
                  <span>Launch Order Bot Ticket</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-gray-400 gap-2">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
                <span>Discord OAuth2 & Bot Ready</span>
              </span>
              <button
                onClick={() => {
                  setIsContactModalOpen(false);
                  openTrackerWithId(orderRef);
                }}
                className="text-[#00F59B] hover:underline font-bold cursor-pointer"
              >
                Track Order on Web →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
