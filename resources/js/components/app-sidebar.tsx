import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import playlistCategoriesRoutes from '@/routes/playlist-categories';
import channelCategoriesRoutes from '@/routes/channel-categories';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, Home, LayoutGrid, PlaySquare } from 'lucide-react';
import { type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Inicio',
        href: home(),
        icon: Home,
    },
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Categorías de playlists',
        href: playlistCategoriesRoutes.index(),
        icon: PlaySquare,
    },
    {
        title: 'Categorías de canales',
        href: channelCategoriesRoutes.index(),
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const sidebarPaletteStyles = {
    '--sidebar': 'rgb(226 223 206)',
    '--sidebar-foreground': 'rgb(0 0 0)',
    '--sidebar-primary': 'rgb(180 172 141)',
    '--sidebar-primary-foreground': 'rgb(0 0 0)',
    '--sidebar-accent': 'rgb(224 220 218)',
    '--sidebar-accent-foreground': 'rgb(0 0 0)',
    '--sidebar-border': 'rgb(180 172 141)',
    '--sidebar-ring': 'rgb(180 172 141)',
} as CSSProperties;

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            style={sidebarPaletteStyles}
            className={cn(
                '[&_[data-sidebar=sidebar]]:bg-[linear-gradient(180deg,_rgb(180,172,141)_0%,_rgb(226,223,206)_55%,_rgb(224,220,220)_100%)]',
                '[&_[data-sidebar=sidebar]]:text-neutral-900',
                '[&_[data-sidebar=group-label]]:text-neutral-700',
                '[&_[data-sidebar=menu-button]]:text-neutral-900',
                '[&_[data-sidebar=menu-button][data-active=true]]:text-neutral-900',
                '[&_[data-sidebar=menu-button]]:hover:text-neutral-900',
                '[&_[data-sidebar=menu-button]:hover]:bg-[rgb(224,220,218)]',
                '[&_[data-sidebar=menu-button][data-active=true]]:bg-[rgb(224,220,218)]',
            )}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
