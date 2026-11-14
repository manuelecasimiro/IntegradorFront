import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  User,
  HeartHandshake,
  ExternalLink,
  Info,
} from 'lucide-react';

export const TicketsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/volunteer-requests')
        .then((res) => {
          // Filtrar contratações aceitas ou concluídas que possuem código de ingresso vinculado
          const list = (res?.data?.data || []).filter(
            (r) => ['accepted', 'completed'].includes(r.status) && r.ticket_code
          );
          setRequests(list);
        })
        .catch((err) => console.error('Erro ao buscar ingressos vinculados:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div id="conteudo-principal" className="space-y-10 py-8 sm:py-12">
      {/* Cabeçalho da Página */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
          <Ticket className="w-4 h-4 text-orange-600" />
          <span>Ingressos & Vinculação de Acesso</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
          Ingressos e Códigos Vinculados
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Para garantir o acesso conjunto em eventos, a plataforma gera um <strong>Código Identificador Único</strong> que associa o ingresso da pessoa com deficiência ao ingresso do voluntário acompanhante (Lei 12.933/2013 e Lei do Voluntariado).
        </p>
      </div>

      {/* Como Funciona a Vinculação (Seção 10) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h2 className="text-base font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-600" />
          <span>Como funciona a vinculação de ingressos:</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
            <span className="font-black text-orange-600 block">Passo 1</span>
            <strong className="text-zinc-900 dark:text-zinc-100 block">Compra do Ingresso PCD</strong>
            <span>O cliente adquire seu ingresso PCD nas bilheterias ou plataformas oficiais do evento com direito a acompanhante.</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
            <span className="font-black text-orange-600 block">Passo 2</span>
            <strong className="text-zinc-900 dark:text-zinc-100 block">Confirmação da Contratação</strong>
            <span>O voluntário aceita a solicitação e o sistema gera automaticamente o Código Identificador de Vinculação (INOVA-TKT).</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
            <span className="font-black text-orange-600 block">Passo 3</span>
            <strong className="text-zinc-900 dark:text-zinc-100 block">Acesso Conjunto no Evento</strong>
            <span>Apresente o código na tenda de acessibilidade ou na catraca exclusiva do evento para validar a entrada conjunta.</span>
          </div>
        </div>
      </div>

      {/* Lista de Ingressos Vinculados Ativos */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
          Seus Ingressos e Contratações Vinculadas
        </h2>

        {!isAuthenticated ? (
          <div className="p-10 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <Ticket className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              Faça login para consultar seus ingressos vinculados
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Acesse sua conta para visualizar os códigos gerados para seus acompanhamentos confirmados.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
            >
              <span>Fazer Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-sm text-zinc-500">
            Carregando ingressos vinculados...
          </div>
        ) : requests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Topo do Ingresso */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                        Ingresso Vinculado • Evento Acessível
                      </span>
                      <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-50 line-clamp-1">
                        {req.event?.name}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      Confirmado
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>{req.event?.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>{req.event?.start_time?.substring(0, 5)}h</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="truncate">{req.event?.location} • {req.event?.city}, {req.event?.state}</span>
                    </div>
                  </div>

                  {/* Participantes Vinculados */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase">Cliente (PCD)</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 truncate block">
                        {req.client?.name}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase">Voluntário Acompanhante</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 truncate block">
                        {req.volunteer?.name}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Base do Ingresso: Código Identificador Único */}
                <div className="p-4 sm:p-5 bg-orange-50/70 dark:bg-orange-950/30 border-t border-dashed border-orange-200 dark:border-orange-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block">
                      Código Identificador de Vinculação:
                    </span>
                    <span className="font-mono text-base font-black text-orange-700 dark:text-orange-300 tracking-wider">
                      {req.ticket_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(req.ticket_code)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 shadow-sm"
                    >
                      {copiedCode === req.ticket_code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/chat/${req.id}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 text-xs font-bold text-white shadow-sm hover:bg-orange-700"
                    >
                      <span>Abrir Chat</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <Ticket className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
              Nenhum ingresso vinculado ativo no momento
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Quando você tiver uma contratação de acompanhamento aceita para um evento, o código do ingresso vinculado aparecerá aqui automaticamente.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
              >
                <span>Explorar Eventos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/requests"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs"
              >
                <span>Ver Minhas Contratações</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
