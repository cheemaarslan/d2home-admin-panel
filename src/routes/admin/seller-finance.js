import { lazy } from 'react';

const SellerFinance = [
    {
        path: 'seller-finance/:recordId',
        component: lazy(() => import('views/seller-finance')),
    },
    
];

export default SellerFinance;
