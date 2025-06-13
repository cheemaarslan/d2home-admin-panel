import { lazy } from 'react';

const SellerFinance = [
    {
        path: 'seller-finance/:shopUuid',  // Note this now has :shopUuid parameter
        component: lazy(() => import('views/seller-finance/ShopDetails')),
    },
];

export default SellerFinance;