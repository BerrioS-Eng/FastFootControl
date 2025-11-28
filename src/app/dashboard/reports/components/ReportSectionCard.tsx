"use client";

import React from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

interface ReportSectionCardProps {
    title: string;
    description?: string;
    headerExtras?: React.ReactNode; // filtros, etc.
    loading?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function ReportSectionCard({
                                      title,
                                      description,
                                      headerExtras,
                                      loading,
                                      className,
                                      children,
                                  }: ReportSectionCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="space-y-4">
                <div>
                    <CardTitle>{title}</CardTitle>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
                {headerExtras}
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-full"/> : children}
            </CardContent>
        </Card>
    );
}