import { lazy } from 'react';

const SellerFinance = [
    {
        path: 'seller-finance/:recordId', // Changed from :shopUuid to :recordId
        component: lazy(() => import('views/seller-finance/ShopDetails')),
    },
];

export default SellerFinance;