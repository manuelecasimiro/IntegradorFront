import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);
    login(demoEmail, demoPassword)
      .then(() => navigate('/'))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div id="conteudo-principal" className="min-h-[80vh] flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" />
          <h1 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 pt-2">
            Acesse sua conta
          </h1>
          <p className="text-xs text-zinc-500">
            Entre para gerenciar suas solicitações e acompanhar eventos acessíveis.
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                E-mail Cadastrado *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Senha de Acesso *
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-sm text-white shadow-md transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </button>
          </form>

          {/* Atalhos de Avaliação / Demonstração com 1 Clique */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Acesso Rápido para Avaliação (1 Clique):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@inovaacess.com.br', 'password123')}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold text-center border border-purple-200"
              >
                👑 Dono / Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('organizador@inovaacess.com.br', 'password123')}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold text-center border border-amber-200"
              >
                🏢 Organizador
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('lucas.cliente@inovaacess.com.br', 'password123')}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold text-center border border-blue-200"
              >
                ♿ Cliente PCD
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('juliana.voluntaria@inovaacess.com.br', 'password123')}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold text-center border border-emerald-200"
              >
                🤝 Voluntária
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500">
          Ainda não possui uma conta?{' '}
          <Link to="/register" className="text-orange-600 font-bold hover:underline">
            Cadastre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  );
};
