
"use client"
import FormCreateProducts from '@/components/products/FormCreateProducts'
import React, { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'
import { Product } from './types'

export default   function Products() {
    const [productos, setProductos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`)
            .then((res) => res.json())
            .then(setProductos)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className='mx-8 my-6 flex flex-col gap-9'>
            <FormCreateProducts />
            {
                loading ?
                <p>Cargando...</p> :
                <DataTable columns={columns} data={productos} />
            }
        </div>
    )
}

