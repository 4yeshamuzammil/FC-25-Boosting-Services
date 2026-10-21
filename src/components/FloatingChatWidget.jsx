import { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'support', text: 'Hello! Welcome to FC BOOST PRO. How can we help upgrade your team today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const { openTrackerWithId } = useApp();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');

    // Simulate smart support reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: 'Thank you for reaching out! A pro manager will join this chat in ~30 seconds. For urgent assistance or custom quotes, ping our WhatsApp desk or Discord community.',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 select-none font-sans">
      
      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] max-w-[380px] bg-[#141824] border border-[#262B3D] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[440px] sm:h-[480px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-[#0B0D13] p-4 border-b border-[#262B3D] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F59B] to-[#00D687] text-[#0B0D13] flex items-center justify-center font-black text-sm">
                  FC
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00F59B] ring-2 ring-[#0B0D13]" />
              </div>

              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  FC Support Desk
                </h4>
                <div className="flex items-center space-x-1 text-[10px] text-[#00F59B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
                  <span>Online • Avg reply &lt; 1 min</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[#1C2234] text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-[#0D101A] px-3 py-2 border-b border-[#262B3D] flex items-center justify-between text-[11px]">
            <button
              onClick={() => {
                setIsOpen(false);
                openTrackerWithId();
              }}
              className="text-[#00F59B] font-bold hover:underline"
            >
              🔍 Track My Order
            </button>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white flex items-center space-x-1"
            >
              <PhoneCall className="w-3 h-3 text-[#00F59B]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0B0D13]/60 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00F59B] text-[#0B0D13] font-semibold rounded-br-none'
                      : 'bg-[#1C2234] text-gray-200 border border-[#262B3D] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#0B0D13] border-t border-[#262B3D] flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about prices, VPN, or orders..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-[#141824] border border-[#262B3D] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F59B]"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00F59B] to-[#00D687] text-[#0B0D13] shadow-2xl shadow-[#00F59B]/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer relative group"
        aria-label="Open Live Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF3B30] rounded-full border-2 border-[#0B0D13]" />
          </>
        )}
      </button>

    </div>
  );
}
