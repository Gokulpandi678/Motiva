import {
  BarChart3,
  CheckSquare,
  GraduationCap,
  History,
  LayoutDashboard,
  MessageCircleQuestion,
  Tags,
  Ticket,
  Users,
} from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/learnings', label: 'Learnings', icon: GraduationCap },
  { to: '/relationships', label: 'Relationships', icon: Users },
  { to: '/skills', label: 'Skills', icon: BarChart3 },
  { to: '/topics', label: 'Topics', icon: History },
  { to: '/faqs', label: 'FAQs', icon: MessageCircleQuestion },
  { to: '/tags', label: 'Tags & Domains', icon: Tags },
];

/** The mobile bottom nav's own 4 direct tabs — the rest live under its "More" tab. */
const MOBILE_PRIMARY_PATHS = ['/', '/tickets', '/tasks', '/learnings'];

export const MOBILE_PRIMARY_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((item) =>
  MOBILE_PRIMARY_PATHS.includes(item.to),
);

export const MOBILE_MORE_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter(
  (item) => !MOBILE_PRIMARY_PATHS.includes(item.to),
);
