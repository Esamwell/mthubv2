import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <Topbar />
        <div className="flex-1 p-8">{/* Container com padding padrão */}
          {children}
        </div>
      </main>
    </div>
  );
};
