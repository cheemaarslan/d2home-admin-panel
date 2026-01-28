import { lazy } from 'react';

const DeliveryManFinance = [
    {
        path: 'deliveryman-finance',
        component: lazy(() => import('views/deliveryman-finance')),
    },
    
];

export default DeliveryManFinance;
