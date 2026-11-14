import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Heart, ShieldCheck, Accessibility } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 text-sm mt-auto border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1 - Apresentação */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" variant="inverse" />
            <p className="text-zinc-400 max-w-md leading-relaxed text-sm">
              Plataforma desenvolvida para romper as barreiras de acessibilidade no mercado de eventos,
              conectando Pessoas com Deficiência (PCDs) a voluntários dedicados e divulgando recursos
              inclusivos físicos e digitais com segurança e autonomia.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-800/50 text-orange-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Conforme diretrizes WCAG 2.1 nível AA & Lei Geral de Proteção de Dados (LGPD)</span>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">
              Navegação
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-orange-400 transition-colors">
                  Buscar Eventos Acessíveis
                </Link>
              </li>
              <li>
                <Link to="/volunteers" className="hover:text-orange-400 transition-colors">
                  Encontrar Voluntários
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-orange-400 transition-colors">
                  Quero ser Voluntário
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Compromisso Social */}
          <div>
            <h2 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">
              Iniciativa & Parceria
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Demanda alinhada com as diretrizes de Inovação Social do <strong>SENAI / Firjan</strong>.
            </p>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-1">
                <Accessibility className="w-4 h-4 text-orange-500" />
                <span>Voluntariado Solidário</span>
              </div>
              <p className="text-zinc-500 text-[11px]">
                Atuação em conformidade com a Lei Federal nº 9.608/1998. Sem cobrança de taxas.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Inova Acess. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5 text-zinc-500">
            Feito com <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> para promover a inclusão no entretenimento
          </p>
        </div>
      </div>
    </footer>
  );
};
