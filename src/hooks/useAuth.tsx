import { createContext, useContext, useEffect, useState } from 'react';

// Novo tipo simplificado
interface Profile {
  id: string;
  nome: string;
  email: string;
  empresa?: string;
  telefone?: string;
  user_type: 'admin' | 'cliente';
}

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<{ error: string } | undefined>;
  cadastrar: (dados: { nome: string; email: string; senha: string; empresa?: string; telefone?: string; user_type?: 'admin' | 'cliente' }) => Promise<{ error: string } | undefined>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      try {
        const saved = localStorage.getItem('profile');
        if (saved) {
          const parsedProfile: Profile = JSON.parse(saved);
          setProfile(parsedProfile);
        }
      } catch (error) {
        console.error("Failed to parse profile from localStorage", error);
        localStorage.removeItem('profile'); // Limpar dados inválidos
      } finally {
        setLoading(false); // Definir loading para false após tentar carregar
      }
    };
    loadProfile();
  }, []); // Rodar uma vez na montagem

  const login = async (email: string, senha: string) => {
    setLoading(true);
    console.log('useAuth: Tentando login com:', email);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const endpoint = API_URL ? `${API_URL}/login-cliente` : '/api/login-cliente';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      console.log('useAuth: Resposta do fetch (status):', res.status);
      
      // Log da resposta bruta antes de tentar JSON
      const textResponse = await res.text();
      console.log('useAuth: Resposta bruta do backend:', textResponse); 
      
      let data;
      try {
        data = JSON.parse(textResponse); // Tentar parsear manualmente
      } catch (jsonError) {
        console.error('useAuth: Erro ao parsear JSON da resposta:', jsonError);
        setLoading(false);
        return { error: 'Formato de resposta inválido do servidor.' };
      }

      console.log('useAuth: Dados recebidos do backend (parsed):', data); 

      if (res.ok) {
        if (data.user) { // Verificar se 'user' existe no objeto de dados
          setProfile(data.user);
          console.log('useAuth: Profile definido para:', data.user);
          localStorage.setItem('profile', JSON.stringify(data.user));
          console.log('useAuth: Profile salvo no localStorage.');
          setLoading(false);
          console.log('useAuth: Login bem-sucedido. Preparando para redirecionar...');
          return; // Retorna aqui, o redirecionamento será feito no Auth.tsx
        } else {
          console.error('useAuth: Resposta de sucesso sem objeto de usuário:', data);
          setLoading(false);
          return { error: 'Sucesso, mas dados de usuário ausentes.' };
        }
      } else {
        setLoading(false);
        console.error('useAuth: Erro na resposta do backend (com dados):', data.error);
        return { error: data.error || 'Erro desconhecido do servidor.' };
      }
    } catch (error) {
      setLoading(false);
      console.error('useAuth: Erro no fetch de login (conexão ou rede):', error);
      return { error: 'Erro de conexão ou requisição.' };
    }
  };

  const cadastrar = async (dados: { nome: string; email: string; senha: string; empresa?: string; telefone?: string; user_type?: 'admin' | 'cliente' }) => {
    setLoading(true);
    console.log('useAuth: Tentando cadastrar com:', dados.email);
    try {
      const res = await fetch('/api/cadastrar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      console.log('useAuth: Resposta do cadastro (status):', res.status);
      const data = await res.json();
      console.log('useAuth: Dados recebidos do backend (cadastro):', data);

      if (res.ok) {
        setLoading(false);
        console.log('useAuth: Cadastro bem-sucedido.');
        return;
      } else {
        setLoading(false);
        console.error('useAuth: Erro na resposta do backend (cadastro):', data.error);
        return { error: data.error };
      }
    } catch (error) {
      setLoading(false);
      console.error('useAuth: Erro no fetch de cadastro:', error);
      return { error: 'Erro de conexão ou requisição no cadastro.' };
    }
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('profile');
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ profile, loading, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
