import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShieldCheck, Check, CreditCard, Lock, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    clearCart,
    cartTotal,
    createOrder,
    openTrackerWithId,
    openContactModal,
    showToast,
    user,
  } = useApp();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'paypal' | 'crypto' | 'whatsapp'
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Form Fields
  const [gamerTag, setGamerTag] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [discordTag, setDiscordTag] = useState('');
  const [loginMethod, setLoginMethod] = useState('account'); // 'account' (EA login) | 'selfplay' (Play with Pro)
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'FCPRO10' || promoCode.trim().toUpperCase() === 'DBA10') {
      setDiscountPercent(0.10); // 10% off
      showToast('Promo code applied: 10% OFF!', 'success');
    } else {
      showToast('Invalid promo code. Try "FCPRO10"', 'error');
    }
  };

  const finalTotal = (cartTotal * (1 - discountPercent)).toFixed(2);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!gamerTag.trim()) {
      showToast('Please enter your GamerTag / PSN / Xbox ID', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your notification email', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user ? user.id : 'guest',
        customerName: user ? user.name : gamerTag,
        customerEmail: email,
        gamerTag,
        discordTag,
        serviceName: cart.map((i) => i.serviceName).join(' + '),
        details: cart.map((i) => i.details).join(' | '),
        price: Number(finalTotal),
        platform: cart[0]?.platform || 'ps5',
        paymentMethod,
        loginMethod,
      };

      const created = await createOrder(orderPayload);
      clearCart();
      setIsCartOpen(false);
      setStep('cart');
      showToast(`Order #${created.id} confirmed! Opening Live Tracker...`, 'success');
      openTrackerWithId(created.id);
    } catch {
      showToast('Failed to create order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-lg bg-[#0B0D13] border-l border-[#262B3D] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#262B3D] flex items-center justify-between bg-[#141824]">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-white uppercase tracking-wider">
                {step === 'cart' ? 'Your Boost Cart' : 'Streamlined Checkout'}
              </span>
              <span className="text-xs text-[#00F59B] font-bold bg-[#00F59B]/10 px-2 py-0.5 rounded">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[#1C2234] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-[#141824] border border-[#262B3D] flex items-center justify-center mx-auto text-gray-500">
                  🛒
                </div>
                <h4 className="text-base font-bold text-white">Your cart is empty</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Browse our FC 25 / 26 Champions, Division Rivals, or Coins packages to get started.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#00F59B] text-[#0B0D13] font-bold text-xs uppercase"
                >
                  Browse Services
                </button>
              </div>
            ) : step === 'cart' ? (
              /* CART ITEMS VIEW */
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-[#141824] border border-[#262B3D] rounded-2xl p-4 flex items-start justify-between space-x-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-white">{item.serviceName}</span>
                          <span className="text-[10px] font-bold text-[#00F59B] bg-[#00F59B]/10 px-1.5 rounded uppercase">
                            {item.platform}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">{item.details}</p>
                        <div className="text-sm font-black text-[#00F59B] pt-1">
                          ${Number(item.price).toFixed(2)} USD
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-500 hover:text-[#FF3B30] p-1.5 rounded-lg hover:bg-[#1C2234] transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="bg-[#141824] border border-[#262B3D] rounded-2xl p-3.5 space-y-2">
                  <span className="text-xs font-bold text-gray-300">Have a Discount Code?</span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Try code FCPRO10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-[#00F59B]"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-1.5 rounded-xl bg-[#1C2234] hover:bg-[#262B3D] text-xs font-bold text-white border border-[#262B3D]"
                    >
                      Apply
                    </button>
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-[11px] text-[#00F59B] font-bold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>10% Discount Applied!</span>
                    </span>
                  )}
                </div>

                {/* Guarantee Banner */}
                <div className="p-3 rounded-xl bg-[#00F59B]/5 border border-[#00F59B]/20 flex items-center space-x-2 text-xs text-[#00F59B]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Includes 100% Ban-Free Regional VPN Protection</span>
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM VIEW */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                
                {/* 1. Account Details */}
                <div className="space-y-3 bg-[#141824] p-4 rounded-2xl border border-[#262B3D]">
                  <span className="font-black uppercase tracking-wider text-white block">
                    1. Account & Gamer Credentials
                  </span>

                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">
                      GamerTag / PSN ID / Xbox Gamertag *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ProStriker_99"
                      value={gamerTag}
                      onChange={(e) => setGamerTag(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F59B]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">
                      Notification Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F59B]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 font-semibold block mb-1">
                      Discord Tag (For Stream / Booster chat)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus#1234"
                      value={discordTag}
                      onChange={(e) => setDiscordTag(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F59B]"
                    />
                  </div>
                </div>

                {/* 2. Login Mode Toggle */}
                <div className="space-y-2 bg-[#141824] p-4 rounded-2xl border border-[#262B3D]">
                  <span className="font-black uppercase tracking-wider text-white block">
                    2. Service Execution Mode
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('account')}
                      className={`p-2.5 rounded-xl border text-left ${
                        loginMethod === 'account'
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <span className="font-bold text-white block">Piloted (VPN Boost)</span>
                      <span className="text-[10px] text-gray-400">Booster plays on account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('selfplay')}
                      className={`p-2.5 rounded-xl border text-left ${
                        loginMethod === 'selfplay'
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <span className="font-bold text-white block">Self-Play / Duo</span>
                      <span className="text-[10px] text-gray-400">You play with our pro</span>
                    </button>
                  </div>
                </div>

                {/* 3. Payment Method Selection */}
                <div className="space-y-2.5 bg-[#141824] p-4 rounded-2xl border border-[#262B3D]">
                  <span className="font-black uppercase tracking-wider text-white block">
                    3. Select Payment Gateway
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-3 rounded-xl border flex items-center space-x-2 ${
                        paymentMethod === 'stripe'
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#00F59B]" />
                      <span className="font-bold">Stripe / Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-xl border flex items-center space-x-2 ${
                        paymentMethod === 'paypal'
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <span className="font-bold text-[#0079C1]">PayPal</span>
                      <span className="text-gray-300 font-bold">Express</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-3 rounded-xl border flex items-center space-x-2 ${
                        paymentMethod === 'crypto'
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <span className="font-bold text-[#00F59B]">Crypto (USDT)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whatsapp')}
                      className={`p-3 rounded-xl border flex items-center space-x-2 ${
                        paymentMethod === 'whatsapp'
                          ? 'bg-[#0B0D13] border-[#00F59B] text-white'
                          : 'bg-[#1C2234] border-[#262B3D] text-gray-400'
                      }`}
                    >
                      <span className="font-bold text-[#25D366]">WhatsApp Pay</span>
                    </button>
                  </div>
                </div>

              </form>
            )}
          </div>

          {/* Footer Controls & Price Total */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#141824] border-t border-[#262B3D] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="text-white">${cartTotal.toFixed(2)} USD</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#00F59B]">
                    <span>Discount:</span>
                    <span>-{(cartTotal * discountPercent).toFixed(2)} USD</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-[#262B3D]">
                  <span className="text-sm font-black text-white uppercase">Total in USD:</span>
                  <span className="text-2xl font-black text-[#00F59B]">${finalTotal}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      openContactModal({
                        serviceName: cart.map(c => c.serviceName).join(' + '),
                        details: cart.map(c => c.details).join(' | '),
                        price: finalTotal,
                        platform: cart[0]?.platform || 'ps5',
                      });
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] via-[#00F59B] to-[#5865F2] hover:opacity-95 text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer"
                  >
                    <span>Order via WhatsApp or Discord</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 rounded-xl bg-[#0B0D13] hover:bg-[#1C2234] border border-[#262B3D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Web Card / Instant Checkout</span>
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full py-1 text-[11px] text-gray-500 hover:text-white"
                  >
                    Clear Cart
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00F59B]/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Processing Payment...' : `Pay $${finalTotal} USD & Start Boost`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full py-2 text-[11px] text-gray-400 hover:text-white"
                  >
                    ← Back to Cart
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
