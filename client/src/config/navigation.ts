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
