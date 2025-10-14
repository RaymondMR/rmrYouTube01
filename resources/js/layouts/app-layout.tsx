import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    contentClassName?: string;
}

export default ({
    children,
    breadcrumbs,
    contentClassName,
    ...props
}: AppLayoutProps) => (
    <AppLayoutTemplate
        breadcrumbs={breadcrumbs}
        contentClassName={contentClassName}
        {...props}
    >
        {children}
    </AppLayoutTemplate>
);
