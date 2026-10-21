import { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_ORDERS } from '../data/mockData';
import { apiClient } from '../services/apiContract';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fc_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch {
      // fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'ut-champions' | 'division-rivals' | 'coins' | 'all-services' | 'admin'

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerSearchId, setTrackerSearchId] = useState('');

  // Contact Method Modal (WhatsApp / Discord)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeOrderForContact, setActiveOrderForContact] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fc_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const cartItem = {
      cartItemId: `${item.serviceId || 'srv'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...item,
    };
    setCart((prev) => [...prev, cartItem]);
    showToast(`Added "${item.serviceName}" to cart!`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  // User Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_orders');
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const login = (email, password) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      email,
      name: email.split('@')[0],
      discordTag: email.split('@')[0] + '#FUT',
      createdAt: new Date().toLocaleDateString(),
    };
    setUser(newUser);
    localStorage.setItem('fc_user', JSON.stringify(newUser));
    showToast(`Welcome back, ${newUser.name}!`, 'success');
    setIsAuthModalOpen(false);
  };

  const register = (name, email, password) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      discordTag: name + '#FUT',
      createdAt: new Date().toLocaleDateString(),
    };
    setUser(newUser);
    localStorage.setItem('fc_user', JSON.stringify(newUser));
    showToast(`Account created! Welcome, ${name}!`, 'success');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fc_user');
    showToast('You have been logged out.', 'info');
  };

  const createOrder = async (orderData) => {
    const fullOrder = await apiClient.createOrder(orderData);
    setOrders((prev) => [fullOrder, ...prev]);
    return fullOrder;
  };

  const updateOrderStatus = (orderId, newStatus, notes = '') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            currentScore: newStatus === 'Completed' ? 'Service 100% Completed & Proof Attached' : ord.currentScore,
            progress: newStatus === 'Completed' ? 100 : ord.progress,
            history: [
              ...(ord.history || []),
              {
                status: newStatus,
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                notes,
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
  };

  const openTrackerWithId = (orderId = '') => {
    setTrackerSearchId(orderId);
    setIsTrackerOpen(true);
  };

  // Open Contact Method Modal
  const openContactModal = (orderConfig) => {
    setActiveOrderForContact(orderConfig);
    setIsContactModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        isTrackerOpen,
        setIsTrackerOpen,
        trackerSearchId,
        setTrackerSearchId,
        openTrackerWithId,
        isContactModalOpen,
        setIsContactModalOpen,
        activeOrderForContact,
        openContactModal,
        theme,
        toggleTheme,
        toast,
        showToast,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        user,
        login,
        register,
        logout,
        orders,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
