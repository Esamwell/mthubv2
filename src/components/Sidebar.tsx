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

export const Sidebar = () => {
  const location = useLocation();
  const { logout, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    logout();
  };

  // Filtra os itens do menu com base no perfil do usuário
  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(profile?.user_type || 'cliente')
  );

  return (
    <div className="h-screen w-64 bg-background border-r border-border flex flex-col p-4">
      {/* Logo */}
      <div className="p-2 mb-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 justify-center">
          <img src="/mthub-logo.png" alt="MTHub Logo" className="h-8 object-contain w-auto" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors",
                    {
                      "bg-amarelo text-black": isActive,
                      "text-muted-foreground hover:bg-accent": !isActive,
                    }
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile - Movido para o final */}
      <div className="mb-2 px-2 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-amarelo">
            <AvatarFallback className="bg-amarelo text-black text-lg">{profile?.nome?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-md font-semibold text-foreground leading-tight">{profile?.nome || 'Usuário'}</p>
            <p className="text-sm text-muted-foreground leading-tight">{profile?.user_type === 'admin' ? 'Administrador' : 'Cliente'}</p>
          </div>
          <MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" />
        </div>
      </div>

      {/* Light Mode Toggle */}
      <div className="px-2 py-4 border-t border-border mt-auto">
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5" />
            <span className="text-sm font-medium">Light Mode</span>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-2 pb-4">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-black font-medium bg-amarelo hover:bg-amarelo-darker transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
