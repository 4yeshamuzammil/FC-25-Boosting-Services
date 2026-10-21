/**
 * ASP.NET Core Web API Contract & Client Service
 * Configured to interface with ASP.NET Core 8 / 9 Controllers & SQL Server Database
 */

import { SAMPLE_ORDERS } from '../data/mockData';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  GET_PROFILE: '/api/auth/profile',

  // Services & Pricing
  GET_SERVICES: '/api/services',
  GET_RANKS: '/api/services/ranks',
  CALCULATE_PRICE: '/api/services/calculate',

  // Orders
  CREATE_ORDER: '/api/orders',
  GET_USER_ORDERS: '/api/orders/user',
  TRACK_ORDER: '/api/orders/track', // ?orderId=FC-12345
  UPDATE_ORDER_STATUS: '/api/orders/status',

  // Reviews & FAQ
  GET_REVIEWS: '/api/reviews',
  GET_FAQS: '/api/faqs',

  // Payment
  CREATE_STRIPE_PAYMENT_INTENT: '/api/payments/stripe/create-intent',
  PAYPAL_CAPTURE: '/api/payments/paypal/capture',
};

// Simulated in-memory and localStorage client fallback
export const apiClient = {
  async trackOrder(orderId) {
    const localOrders = JSON.parse(localStorage.getItem('fc_orders') || '[]');
    const found = localOrders.find(
      (o) => o.id.toLowerCase() === orderId.trim().toLowerCase()
    );
    if (found) return found;

    return SAMPLE_ORDERS.find(
      (o) => o.id.toLowerCase() === orderId.trim().toLowerCase()
    ) || null;
  },

  async createOrder(orderPayload) {
    const newOrderId = `FC-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullOrder = {
      id: newOrderId,
      ...orderPayload,
      status: 'In Progress',
      progress: 20,
      currentScore: 'Booster Assigned & Regional VPN Connected',
      boosterName: 'Pro ' + (orderPayload.platform === 'pc' ? 'Vortex' : 'Kaiser') + ' (Top 100 Global)',
      boosterVpn: 'Matching Client Regional Subnet',
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const existingOrders = JSON.parse(localStorage.getItem('fc_orders') || '[]');
    const updated = [fullOrder, ...existingOrders];
    localStorage.setItem('fc_orders', JSON.stringify(updated));
    return fullOrder;
  },
};
