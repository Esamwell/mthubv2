import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login - redireciona para dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fundo animados - Placeholder */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>

      <div className="bg-[#2A2A2A] p-8 rounded-xl shadow-lg w-full max-w-md z-10 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">Gratify</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@samuelmay.co"
              className="w-full bg-[#3A3A3A] text-gray-100 border-gray-700 focus:border-yellow-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#3A3A3A] text-gray-100 border-gray-700 focus:border-yellow-500"
              required
            />
          </div>
          
          <div className="text-center">
            <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600">
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
