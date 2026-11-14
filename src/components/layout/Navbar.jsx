import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../common/Logo';
import { Menu, X, LogOut, User, Calendar, Users, MessageSquare, Shield, Ticket } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isVolunteer, isClient, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
      isActive
        ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 font-bold'
        : 'text-zinc-700 hover:text-orange-600 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Oficial */}
          <Logo />

          {/* Links de Navegação Desktop (Seção 5) */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navItemClass}>
              Início
            </NavLink>
            <NavLink to="/events" className={navItemClass}>
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Eventos
            </NavLink>
            <NavLink to="/volunteers" className={navItemClass}>
              <Users className="w-4 h-4" aria-hidden="true" />
              Voluntários
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/requests" className={navItemClass}>
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  Contratações
                </NavLink>
                <NavLink to="/tickets" className={navItemClass}>
                  <Ticket className="w-4 h-4" aria-hidden="true" />
                  Ingressos
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navItemClass}>
                <Shield className="w-4 h-4" aria-hidden="true" />
                Painel Admin
              </NavLink>
            )}
          </nav>

          {/* Área do Usuário Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-orange-600"
                  aria-label={`Ver perfil de ${user.name}`}
                >
                  <img
                    src={user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ea580c&color=fff`}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-orange-600 font-semibold uppercase">
                      {user.role === 'client' ? 'Cliente PCD' : user.role === 'volunteer' ? 'Voluntário' : user.role === 'organizer' ? 'Organizador' : 'Admin'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:bg-red-950/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-zinc-800 dark:text-zinc-100 hover:text-orange-600 transition-colors focus-visible:ring-2 focus-visible:ring-orange-600 rounded-lg"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  Cadastre-se
                </Link>
              </div>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-orange-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-orange-50 dark:hover:bg-zinc-900"
          >
            Início
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-orange-50 dark:hover:bg-zinc-900"
          >
            Eventos
          </NavLink>
          <NavLink
            to="/volunteers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-orange-50 dark:hover:bg-zinc-900"
          >
            Voluntários
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-orange-50 dark:hover:bg-zinc-900"
              >
                Contratações
              </NavLink>
              <NavLink
                to="/tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-orange-50 dark:hover:bg-zinc-900"
              >
                Ingressos Vinculados
              </NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-orange-50 dark:hover:bg-zinc-900"
            >
              Painel Admin
            </NavLink>
          )}

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <img
                    src={user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ea580c&color=fff`}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-orange-500"
                  />
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{user.name}</div>
                    <div className="text-xs text-orange-600">{user.email}</div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sair da Conta
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700"
                >
                  Cadastre-se Gratuitamente
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
