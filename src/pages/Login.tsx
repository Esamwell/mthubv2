import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824]">
      {/* Fundo animado sutil */}
      <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000" />
      <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-yellow-700 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob" />

      <div className="relative z-10 w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2 text-center drop-shadow">MTHub</h1>
        <p className="text-gray-200 text-center mb-8 text-sm tracking-wide">Sistema de Gestão de Clientes</p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400"><Mail size={18} /></span>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@email.com"
                className="pl-10 pr-3 py-2 rounded-full bg-white/20 border border-white/20 text-gray-100 placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 backdrop-blur-md shadow-sm"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-100 mb-1">Senha</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400"><Lock size={18} /></span>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-3 py-2 rounded-full bg-white/20 border border-white/20 text-gray-100 placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 backdrop-blur-md shadow-sm"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 text-lg shadow-md transition-all">Entrar</Button>
        </form>
      </div>
    </div>
  );
};
