import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'cliente';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { profile, loading } = useAuth();

  console.log('ProtectedRoute: profile:', profile, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    console.log('ProtectedRoute: Profile é nulo, redirecionando para /auth');
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && profile.user_type !== requiredRole) {
    console.warn(`Acesso negado: Usuário (${profile.user_type}) tentou acessar rota restrita a ${requiredRole}. Redirecionando...`);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Profile válido, renderizando conteúdo.');
  return <>{children}</>;
};
