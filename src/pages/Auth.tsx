import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

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
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fundo animados */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>

      <Card className="w-full max-w-md bg-[#2A2A2A] border border-gray-800 shadow-lg rounded-xl z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-500">MTHub</CardTitle>
          <CardDescription className="text-gray-400">Sistema de Gestão de Clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            
            
            <TabsContent value="login" className="mt-4">
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
                    placeholder="seuemail@email.com"
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                
                
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
