import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'cliente'] },
  { icon: Users, label: 'Clientes', path: '/clientes', roles: ['admin'] },
  { icon: Users, label: 'Usuários', path: '/usuarios', roles: ['admin'] },
  { icon: FileText, label: 'Orçamento', path: '/orcamento', roles: ['admin'] },
  { icon: FileText, label: 'Solicitações', path: '/solicitacoes', roles: ['admin', 'cliente'] },
  { icon: Calendar, label: 'Calendário', path: '/calendario', roles: ['admin', 'cliente'] },
  { icon: Settings, label: 'Configurações', path: '/configuracoes', roles: ['admin', 'cliente'] },
  { icon: HelpCircle, label: 'Central de Ajuda', path: '/ajuda', roles: ['admin', 'cliente'] },
];
