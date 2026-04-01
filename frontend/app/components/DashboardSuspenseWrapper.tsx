'use client';

import { Suspense, ReactNode } from 'react';

interface DashboardSuspenseWrapperProps {
    children: ReactNode;
    fallback: ReactNode;
}

export function DashboardSuspenseWrapper({
    children,
    fallback,
}: DashboardSuspenseWrapperProps) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
}
