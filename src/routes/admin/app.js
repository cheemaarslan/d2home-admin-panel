// ** React Imports
import { lazy } from 'react';

const AppRoutes = [
  {
    path: 'dashboard',
    component: lazy(() => import('views/dashboard')),
  },
  {
    path: 'payouts',
    component: lazy(() => import('views/admin-payouts')),
  },
  {
    path: 'seller-finance',
    component: lazy(() => import('views/seller-finance')),
  },
  {
    path: 'seller-finance/:shopUuid', // Note this now has :shopUuid parameter
    component: lazy(() => import('views/seller-finance/ShopDetails')),
  },
  {
    path: 'deliveryman-finance',
    component: lazy(() => import('views/deliveryman-finance')),
  },
  {
    path: 'deliveryman-details',
    component: lazy(() => import('views/deliveryman-finance/deliveryman-detail')),
  },
  // {
  //   path: 'deliveryman-finance/:shopUuid', // Note this now has :shopUuid parameter
  //   component: lazy(() => import('views/deliveryman-finance/OrderDetails')),
  // },
  {
    path: 'catalog/menu/categories',
    component: lazy(() => import('views/menu-categories')),
  },
  {
    path: 'settings/bookingUpload',
    component: lazy(() => import('views/booking-file-upload')),
  },
  {
    path: 'pos-system',
    component: lazy(() => import('views/pos-system')),
  },
  {
    path: 'cashback',
    component: lazy(() => import('views/cashback')),
  },
  {
    path: 'stories',
    component: lazy(() => import('views/story')),
  },
  {
    path: 'email/subscriber',
    component: lazy(() => import('views/email-subscribers')),
  },
  {
    path: 'subscriber',
    component: lazy(() => import('views/subscriber')),
  },
  {
    path: 'chat',
    component: lazy(() => import('views/chat')),
  },
  {
    path: 'transactions',
    component: lazy(() => import('views/transactions')),
  },
  {
    path: 'payout-requests',
    component: lazy(() => import('views/payout-requests')),
  },
  {
    path: 'catalog',
    component: lazy(() => import('views/catalog')),
  },
  {
    path: 'bonus/list',
    component: lazy(() => import('views/bonus')),
  },
];

export default AppRoutes;
