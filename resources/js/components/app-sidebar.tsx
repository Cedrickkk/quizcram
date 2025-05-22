import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Archive, ChartNetwork, Hash, History, Settings2, Star } from 'lucide-react';
import AppLogo from './app-logo';
import NavActions from './nav-actions';

const mainNavItems: NavItem[] = [
  {
    title: 'Subjects',
    href: '/subjects',
    icon: Hash,
  },
  {
    title: 'Favorites',
    href: '/favorites',
    icon: Star,
  },
  {
    title: 'Archived',
    href: '/archives',
    icon: Archive,
  },
  {
    title: 'Recent Quizzes',
    href: '/recent-quizzes',
    icon: History,
  },
];

const actionsNavItems: NavItem[] = [
  {
    title: 'Analytics',
    href: '/analytics',
    icon: ChartNetwork,
  },
  {
    title: 'Quiz Settings',
    href: '/quiz-settings',
    icon: Settings2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route('subjects.index')} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
        <NavActions items={actionsNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
