import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UTChampionsPage from './pages/UTChampionsPage';
import DivisionRivalsPage from './pages/DivisionRivalsPage';
import CoinsBoostingPage from './pages/CoinsBoostingPage';
import AllServicesPage from './pages/AllServicesPage';
import AdminOrderDashboard from './components/AdminOrderDashboard';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import UserDashboardModal from './components/UserDashboardModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import ContactMethodModal from './components/ContactMethodModal';
import FloatingChatWidget from './components/FloatingChatWidget';
import Toast from './components/Toast';

function MainLayout() {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0D13] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#00F59B] selection:text-[#0B0D13]">
      <Navbar />

      <main className="flex-1 w-full">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'ut-champions' && <UTChampionsPage />}
        {currentPage === 'division-rivals' && <DivisionRivalsPage />}
        {currentPage === 'coins' && <CoinsBoostingPage />}
        {currentPage === 'all-services' && <AllServicesPage />}
        {currentPage === 'admin' && <AdminOrderDashboard />}
      </main>

      <Footer />

      {/* Global Modals, Drawers & Widgets */}
      <CartDrawer />
      <AuthModal />
      <UserDashboardModal />
      <OrderTrackerModal />
      <ContactMethodModal />
      <FloatingChatWidget />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
