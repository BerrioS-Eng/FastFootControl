import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showActions?: boolean;
}

/**
 * Componente de skeleton para mostrar mientras carga la tabla
 * Mejora la experiencia de usuario con placeholders visuales
 */
export function SkeletonTable({ rows = 5, columns = 6, showActions = true }: SkeletonTableProps) {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-40" /> {/* Search */}
          <Skeleton className="h-10 w-32" /> {/* Filter */}
          <Skeleton className="h-10 w-32" /> {/* Filter */}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-24" /> {/* Export */}
          <Skeleton className="h-10 w-32" /> {/* New user */}
        </div>
      </div>

      {/* Desktop table skeleton */}
      <div className="hidden md:block">
        <div className="border rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 border-b p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4" /> {/* Checkbox */}
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
              ))}
              {showActions && <Skeleton className="h-4 w-20" />}
            </div>
          </div>

          {/* Table rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="border-b p-4 last:border-b-0">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" /> {/* Checkbox */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                <Skeleton className="h-4 flex-1" /> {/* Name */}
                <Skeleton className="h-4 flex-1" /> {/* Email */}
                <Skeleton className="h-6 w-16 rounded-full" /> {/* Role badge */}
                <Skeleton className="h-6 w-16 rounded-full" /> {/* Status badge */}
                <Skeleton className="h-4 flex-1" /> {/* Date */}
                {showActions && (
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-1/3" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" /> {/* Results info */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para cards individuales en vista móvil
 */
export function SkeletonUserCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton para estados vacíos
 */
export function SkeletonEmpty() {
  return (
    <div className="text-center py-12">
      <div className="space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  );
}