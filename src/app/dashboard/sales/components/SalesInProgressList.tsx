import React from 'react'
import { SaleInProgress } from '@/app/dashboard/sales/types';
import { SaleCard } from './SalesCard';

type Props = { sales: SaleInProgress[] };

export const SalesInProgressList: React.FC<Props> = ({ sales }) => {
    if (!sales.length) return null;
    return (
        <div>
            <h3 className="text-lg font-semibold my-3">Ventas en Proceso</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sales.map((sale) => (
                    <SaleCard key={sale.id} sale={sale} />
                ))}
            </div>
        </div>
    );
}

export default SalesInProgressList