import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ChevronDown,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Trophy,
  Zap,
  Flame,
  Award,
  Coins,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    cart,
    setIsCartOpen,
    user,
    setIsAuthModalOpen,
    setIsDashboardOpen,
    setIsTrackerOpen,
    theme,
    toggleTheme,
  } = useApp();

  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const serviceCategories = [
    {
      id: 'ut-champions',
      title: 'UT Champions Finals',
      desc: 'Rank 1 to 7 guaranteed wins with VPN',
      icon: Trophy,
      badge: 'TOP PICK',
      badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    },
    {
      id: 'division-rivals',
      title: 'Division Rivals Boost',
      desc: 'Division 10 to Elite & 7 Weekly Wins',
      icon: Zap,
      badge: 'POPULAR',
      badgeColor: 'text-[#FFB800] bg-[#FFB800]/10 border-[#FFB800]/30',
    },
    {
      id: 'coins',
      title: 'Buy EAFC Coins',
      desc: 'Comfort trade 100% EA tax covered',
      icon: Coins,
      badge: 'INSTANT',
      badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    },
    {
      id: 'all-services',
      title: 'Champions Play-Offs',
      desc: 'Direct qualification to Weekend League',
      icon: Flame,
      badge: null,
    },
    {
      id: 'all-services',
      title: 'Mastery Swaps & Objectives',
      desc: 'Unlock Season passes & special cards',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'all-services',
      title: 'UT Draft Win Boost',
      desc: 'Guaranteed 4-win draft rewards',
      icon: Award,
      badge: null,
    },
    {
      id: 'all-services',
      title: '1-on-1 Pro Coaching',
      desc: 'Tactics & private screen share reviews',
      icon: GraduationCap,
      badge: 'PROS',
      badgeColor: 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/30',
    },
    {
      id: 'all-services',
      title: 'Special Bundles & Discounts',
      desc: 'Combined packages up to 35% off',
      icon: ShieldCheck,
      badge: 'SAVE 35%',
      badgeColor: 'text-[#00F59B] bg-[#00F59B]/15 border-[#00F59B]/40',
    },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none font-sans">
      
      {/* Top Utility Bar */}
      <div className="w-full bg-[#080A0F] border-b border-[#262B3D]/60 py-1.5 px-3 sm:px-6 md:px-8 text-[11px] text-gray-400 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Live Pros Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center space-x-1.5 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse shrink-0"></span>
              <span className="text-[#00F59B] font-bold">14 Pros Online</span>
              <span className="hidden md:inline">| Ready for Instant Start</span>
            </span>
            <span className="hidden lg:inline-flex items-center text-gray-400">
              🛡️ Safe Regional VPN Encrypted
            </span>
          </div>

          {/* Quick Actions (Theme Switcher, Admin, Track, Currency) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-[#141824] border border-[#262B3D] text-[10px] sm:text-xs font-bold transition-all cursor-pointer hover:border-[#00F59B]/50"
              title={theme === 'dark' ? 'Switch to Light Theme (Red & White)' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span className="hidden xs:inline text-gray-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-red-600" />
                  <span className="hidden xs:inline text-gray-800">Dark</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center space-x-1 transition-colors cursor-pointer text-[10px] sm:text-xs font-bold ${
                currentPage === 'admin' ? 'text-[#FF3B30]' : 'text-gray-300 hover:text-[#FF3B30]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30]" />
              <span className="hidden xs:inline">Admin</span>
              <span>Portal</span>
            </button>

            <button
              onClick={() => setIsTrackerOpen(true)}
              className="flex items-center space-x-1 hover:text-[#00F59B] transition-colors cursor-pointer text-[10px] sm:text-xs"
            >
              <Search className="w-3.5 h-3.5 text-[#00F59B]" />
              <span className="font-semibold text-gray-200 hover:text-[#00F59B]">Track</span>
            </button>

            <div className="hidden sm:flex items-center space-x-1 text-gray-300 bg-[#141824] px-2 py-0.5 rounded border border-[#262B3D]">
              <span className="text-[10px] text-gray-400 font-bold">USD</span>
              <span className="font-bold text-[#00F59B]">($)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-nav bg-[#0B0D13]/95 border-b border-[#262B3D] px-3 sm:px-6 md:px-8 py-3 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#141824] to-[#1C2234] border border-[#262B3D] group-hover:border-[#00F59B]/50 flex items-center justify-center shadow-lg transition-all">
              <span className="text-lg sm:text-xl font-black italic tracking-tighter text-[#00F59B] group-hover:scale-105 transition-transform">
                FC
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center space-x-1">
                <span className="text-base sm:text-xl font-black tracking-wider text-white uppercase italic">
                  BOOST<span className="text-[#00F59B]">PRO</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-[#FF3B30] text-white">
                  FC 25/26
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] text-gray-400 uppercase -mt-0.5">
                ELITE SERVICES
              </span>
            </div>
          </div>

          {/* Desktop Center Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                currentPage === 'home'
                  ? 'text-white bg-[#141824] border border-[#262B3D]'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]/60'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all inline-flex items-center space-x-1.5 ${
                  isServicesOpen || ['ut-champions', 'division-rivals', 'coins', 'all-services'].includes(currentPage)
                    ? 'text-[#00F59B] bg-[#141824] border border-[#262B3D]'
                    : 'text-gray-300 hover:text-white hover:bg-[#141824]/60'
                }`}
              >
                <span>Services Catalog</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-[440px] bg-[#141824]/95 backdrop-blur-xl border border-[#262B3D] rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {serviceCategories.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(item.id)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#1C2234] border border-transparent hover:border-[#262B3D] text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0B0D13] border border-[#262B3D] flex items-center justify-center shrink-0 group-hover:border-[#00F59B]/50 transition-colors">
                          <IconComp className="w-4 h-4 text-[#00F59B] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-[#00F59B] transition-colors truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded border ${item.badgeColor || 'text-gray-300 bg-gray-800'}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('ut-champions')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                currentPage === 'ut-champions'
                  ? 'text-[#00F59B] bg-[#141824] border border-[#262B3D]'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]/60'
              }`}
            >
              UT Champions
            </button>

            <button
              onClick={() => handleNavClick('division-rivals')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                currentPage === 'division-rivals'
                  ? 'text-[#00F59B] bg-[#141824] border border-[#262B3D]'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]/60'
              }`}
            >
              Division Rivals
            </button>

            <button
              onClick={() => handleNavClick('coins')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                currentPage === 'coins'
                  ? 'text-[#00F59B] bg-[#141824] border border-[#262B3D]'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]/60'
              }`}
            >
              Buy Coins
            </button>
          </div>

          {/* Right Action Icons & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme Toggle Button (Desktop) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-gray-200 hover:text-[#00F59B] transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Theme (Red & White)' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFB800]" />
              ) : (
                <Moon className="w-4 h-4 text-red-600" />
              )}
            </button>

            {/* User Account / Auth Trigger */}
            {user ? (
              <button
                onClick={() => setIsDashboardOpen(true)}
                className="flex items-center space-x-1.5 bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer min-h-[38px]"
              >
                <div className="w-5 h-5 rounded-lg bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center font-black text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-gray-200">{user.name}</span>
                <span className="text-[9px] text-[#00F59B] uppercase font-black bg-[#00F59B]/10 px-1 py-0.2 rounded">
                  Orders
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer min-h-[38px]"
              >
                <User className="w-3.5 h-3.5 text-[#00F59B]" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-[#262B3D] text-gray-200 hover:text-[#00F59B] transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 bg-[#00F59B] text-[#0B0D13] font-black text-[10px] rounded-full flex items-center justify-center px-1 shadow-md shadow-[#00F59B]/30 animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button (iPhone / Android / Tab) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#141824] border border-[#262B3D] text-gray-300 hover:text-white min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#00F59B]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Fullscreen Slide Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[88px] bottom-0 z-50 bg-[#0B0D13]/98 backdrop-blur-2xl p-4 overflow-y-auto animate-in slide-in-from-top-4 duration-200 border-t border-[#262B3D] flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Primary Pages */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'home' ? 'bg-[#141824] border-[#00F59B] text-white' : 'bg-[#141824]/60 border-[#262B3D] text-gray-300'
                  }`}
                >
                  <span>Home</span>
                  <span className="text-[10px] text-gray-500">🏠</span>
                </button>

                <button
                  onClick={() => handleNavClick('ut-champions')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'ut-champions' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>UT Champions</span>
                  <span className="text-[10px] text-[#00F59B]">🏆</span>
                </button>

                <button
                  onClick={() => handleNavClick('division-rivals')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'division-rivals' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>Division Rivals</span>
                  <span className="text-[10px] text-[#FFB800]">⚡</span>
                </button>

                <button
                  onClick={() => handleNavClick('coins')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    currentPage === 'coins' ? 'bg-[#141824] border-[#00F59B] text-[#00F59B]' : 'bg-[#141824]/60 border-[#262B3D] text-white'
                  }`}
                >
                  <span>Buy Coins</span>
                  <span className="text-[10px] text-[#00F59B]">🪙</span>
                </button>
              </div>

              {/* All Services & Bundles */}
              <button
                onClick={() => handleNavClick('all-services')}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#141824] to-[#1C2234] border border-[#262B3D] text-xs font-black uppercase text-left flex items-center justify-between text-white"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#FFB800]" />
                  <span>All FC Packages & Bundles</span>
                </div>
                <span className="text-[9px] text-[#00F59B] bg-[#00F59B]/10 px-2 py-0.5 rounded">
                  SAVE 35%
                </span>
              </button>

              {/* Theme Switcher in Mobile Drawer */}
              <button
                onClick={toggleTheme}
                className="w-full py-2.5 px-3 rounded-xl bg-[#141824] border border-[#262B3D] text-white font-bold flex items-center justify-between text-xs"
              >
                <span className="flex items-center space-x-2">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-[#FFB800]" />
                      <span>Theme Mode: Dark Obsidian</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-red-600" />
                      <span>Theme Mode: Light Red & White</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#00F59B]">
                  {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                </span>
              </button>

              {/* Admin Portal & Tracking Shortcuts */}
              <div className="bg-[#141824]/70 rounded-2xl p-3 border border-[#262B3D] space-y-2 text-xs">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D13] border border-[#FF3B30]/30 text-white font-bold flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF3B30]" />
                    <span>Admin Order Portal</span>
                  </span>
                  <span className="text-[9px] bg-[#FF3B30]/20 text-[#FF3B30] px-1.5 py-0.5 rounded font-black">
                    MGMT
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsTrackerOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D13] border border-[#262B3D] text-white font-bold flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-[#00F59B]" />
                    <span>Track Live Order Status</span>
                  </span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>

            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-4 border-t border-[#262B3D] space-y-3 pb-6">
              {/* Mobile Drawer Theme Switcher */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141824] border border-[#262B3D]">
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-[#00F59B]" />
                  ) : (
                    <Sun className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-xs font-bold text-gray-200">
                    Theme: {theme === 'dark' ? 'Obsidian Dark' : 'Red & White Light'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 rounded-lg bg-[#0B0D13] border border-[#262B3D] text-xs font-bold text-white transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-red-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Currency: <strong className="text-white">USD ($)</strong></span>
                <span className="text-[#00F59B] font-bold">100% Ban-Free Protected</span>
              </div>

              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDashboardOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00F59B] text-[#0B0D13] font-black text-xs uppercase tracking-wider"
                >
                  View My Orders ({user.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00F59B] text-[#0B0D13] font-black text-xs uppercase tracking-wider"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
}
