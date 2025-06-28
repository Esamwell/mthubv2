import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    if (res?.error) {
      toast({
        title: 'Erro no login',
        description: res.error,
        variant: 'destructive',
      });
    } else {
      window.location.href = '/dashboard';
    }
    setLoading(false);
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
          <div className="flex items-center justify-between text-xs text-gray-200 mb-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="accent-yellow-400 rounded" />
              Lembrar senha
            </label>
            <a href="#" className="text-yellow-300 hover:text-yellow-400 transition-colors">Esqueci a senha</a>
          </div>
          <Button type="submit" className="w-full rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 text-lg shadow-md transition-all" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-200">
          Não tem uma conta? <a href="#" className="font-semibold text-yellow-300 hover:text-yellow-400 transition-colors">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
};
