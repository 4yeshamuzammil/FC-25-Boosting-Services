import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    if (activeTab === 'login') {
      login(email, password);
    } else {
      if (!name.trim()) {
        showToast('Please enter your gamer username', 'error');
        return;
      }
      register(name, email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="w-full max-w-md bg-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F59B] to-[#00D687] text-[#0B0D13] flex items-center justify-center font-black text-xl italic mx-auto shadow-lg shadow-[#00F59B]/20">
            FC
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-gray-400">
            Track orders, view receipts, and chat live with your assigned pro.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#0B0D13] p-1 rounded-xl mb-6 border border-[#262B3D]">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeTab === 'login'
                ? 'bg-[#141824] text-[#00F59B] border border-[#262B3D]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeTab === 'register'
                ? 'bg-[#141824] text-[#00F59B] border border-[#262B3D]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {activeTab === 'register' && (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Gamer Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. KaiserFC"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00F59B]"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00F59B]"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00F59B]"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer mt-2"
          >
            {activeTab === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#262B3D]/70 flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>SSL 256-Bit Encrypted Data Protection</span>
        </div>

      </div>
    </div>
  );
}
