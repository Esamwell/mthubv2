import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Solicitacoes } from "./pages/Solicitacoes";
import { Calendario } from "./pages/Calendario";
import { Configuracoes } from "./pages/Configuracoes";
import { Ajuda } from "./pages/Ajuda";
import NotFound from "./pages/NotFound";
import { Usuarios } from "./pages/Usuarios";
import { Orcamento } from "./pages/Orcamento";

// Ajustado para forçar nova build no Vercel
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: Infinity,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute requiredRole="admin">
                <Clientes />
              </ProtectedRoute>
            } />
            <Route path="/solicitacoes" element={
              <ProtectedRoute>
                <Solicitacoes />
              </ProtectedRoute>
            } />
            <Route path="/calendario" element={
              <ProtectedRoute>
                <Calendario />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Configuracoes />
              </ProtectedRoute>
            } />
            <Route path="/usuarios" element={
              <ProtectedRoute requiredRole="admin">
                <Usuarios />
              </ProtectedRoute>
            } />
            <Route path="/orcamento" element={
              <ProtectedRoute requiredRole="admin">
                <Orcamento />
              </ProtectedRoute>
            } />
            <Route path="/ajuda" element={
              <ProtectedRoute>
                <Ajuda />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
