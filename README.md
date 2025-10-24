This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

## Configuración de API (Refactor)

Este proyecto ahora centraliza la URL base de la API en `src/lib/config.ts` y utiliza una capa de servicio en `src/lib/api/products.ts` más un hook `src/lib/hooks/useProducts.ts`.

- Variable de entorno soportada: `NEXT_PUBLIC_API_URL`
  - Ejemplo: `NEXT_PUBLIC_API_URL=http://192.168.101.11:8080`
  - Si no se define, se usará el valor por defecto anterior.

### Beneficios del refactor
- Separación de responsabilidades (UI, datos, configuración).
- Código más modular y escalable.
- Reutilización de llamadas a la API y manejo de estados de carga/errores.

### Rutas afectadas
- Página: `src/app/dashboard/products/page.tsx` ahora consume `useProducts`.
- API legacy: `src/app/dashboard/products/api/route.ts` reexporta desde `src/lib/api/products.ts` para mantener compatibilidad.
