import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaleInProgress } from '@/app/dashboard/sales/types';

type Props = {
    sale: SaleInProgress;
    onEdit: () => void;
    
};

export const SaleCard: React.FC<Props> = ({ sale, onEdit }) => {
    return (
        <Card className='w-80 border-amber-500 hover:cursor-pointer' onClick={onEdit}>
            <CardHeader>
                <CardTitle>{sale.concept}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Método de pago: {sale.paymentMethod || 'No especificado'}</p>
                <p>Total: {sale.totalPrice ? `$${sale.totalPrice}` : 'No especificado'}</p>
            </CardContent>
        </Card>
    );
};