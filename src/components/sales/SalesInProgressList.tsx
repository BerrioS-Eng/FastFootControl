import React from 'react'
import { SaleInProgress } from '@/app/dashboard/sales/types';
import { SaleCard } from '@/components/sales/SalesCard';

type Props = {
  sales: SaleInProgress[];
  onEdit: (sale: SaleInProgress) => void;
  
};

export const SalesInProgressList: React.FC<Props> = ({ sales, onEdit }) => {
  if (!sales.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold my-3">Ventas en Proceso</h3>
      <div className="space-y-4">
        {sales.map((sale) => (
          <SaleCard
            key={sale.id}
            sale={sale}
            onEdit={() => onEdit(sale)}
          />
        ))}
      </div>
    </div>
  );
}

export default SalesInProgressList