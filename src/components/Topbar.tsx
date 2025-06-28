import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from './ui/sidebar';

export const Topbar = () => {
  const { profile, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-between h-16 bg-background border-b border-border px-4 sm:px-6">
      {/* Botão de menu para mobile */}
      <div className="flex sm:hidden">
        <SidebarTrigger />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-amarelo">
            <AvatarFallback className="bg-amarelo text-foreground text-sm">
              {profile?.nome?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <p className="font-medium">{profile?.nome || 'Usuário'}</p>
            <p className="text-sm text-muted-foreground">
              {profile?.user_type === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 