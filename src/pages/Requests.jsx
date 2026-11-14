import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ReviewModal } from '../components/volunteers/ReviewModal';
import {
  MessageSquare,
  Check,
  X,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Ticket,
  Copy,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const Requests = () => {
  const { user, isVolunteer, isClient } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'accepted', 'completed'
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Modal de Comparecimento (Seção 12)
  const [attendanceModalReq, setAttendanceModalReq] = useState(null);
  const [attendanceChoice, setAttendanceChoice] = useState(true);
  const [attendanceNotes, setAttendanceNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    api.get('/volunteer-requests')
      .then((res) => {
        setRequests(res?.data?.data || []);
      })
      .catch((err) => {
        console.error('Erro ao buscar contratações:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    if (!window.confirm('Deseja aceitar esta contratação de acompanhamento? O chat e o código de ingresso vinculado serão liberados imediatamente.')) return;
    setActionLoading(true);
    try {
      await api.put(`/volunteer-requests/${id}/accept`);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Erro ao aceitar contratação.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Tem certeza de que deseja recusar esta contratação?')) return;
    setActionLoading(true);
    try {
      await api.put(`/volunteer-requests/${id}/reject`);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Erro ao recusar solicitação.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceModalReq) return;

    setActionLoading(true);
    try {
      await api.put(`/volunteer-requests/${attendanceModalReq.id}/confirm-attendance`, {
        attended: attendanceChoice,
        notes: attendanceNotes.trim() || undefined,
      });
      setAttendanceModalReq(null);
      setAttendanceNotes('');
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Erro ao registrar comparecimento.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const statusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pendente
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Aceita & Confirmada
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3.5 h-3.5" />
            Concluída
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Recusada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="conteudo-principal" className="space-y-8 py-8 sm:py-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-2">
          <span>Seção Oficial: Contratações</span>
        </div>
        <h1 className="text-3xl font-black text-zinc-950 dark:text-zinc-50">
          Contratações de Acompanhamento
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          {isVolunteer
            ? 'Gerencie pedidos de suporte enviados por pessoas com deficiência para eventos e acesse os chats de acolhimento.'
            : 'Acompanhe suas solicitações com voluntários capacitados, acerte os pontos de encontro e consulte seus ingressos vinculados.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'Todas as Contratações' },
          { key: 'pending', label: 'Pendentes' },
          { key: 'accepted', label: 'Aceitas & Confirmadas' },
          { key: 'completed', label: 'Concluídas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            type="button"
            className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.key
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de Contratações */}
      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-500">Carregando contratações...</div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const otherParty = isVolunteer ? req.client : req.volunteer;
            const canChat = ['accepted', 'completed'].includes(req.status);
            const canReview = isClient && req.status === 'completed' && !req.review;
            const canConfirmAttendance = isClient && req.status === 'accepted' && req.attendance_confirmed === null;

            return (
              <div
                key={req.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        otherParty?.profile_photo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParty?.name || 'Usuário')}&background=ea580c&color=fff`
                      }
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-orange-200"
                    />
                    <div>
                      <div className="text-xs text-zinc-400 font-semibold uppercase">
                        {isVolunteer ? 'Solicitante PCD' : 'Voluntário Solidário'}
                      </div>
                      <div className="text-base font-black text-zinc-900 dark:text-zinc-100">
                        {otherParty?.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {req.attendance_confirmed === true && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Comparecimento Confirmado
                      </span>
                    )}
                    {req.attendance_confirmed === false && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        Ausência Registrada
                      </span>
                    )}
                    {statusBadge(req.status)}
                  </div>
                </div>

                {/* Evento e Ponto de Encontro */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                  <div>
                    <span className="font-bold text-zinc-500 block mb-0.5">Evento Vinculado:</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100 block">
                      {req.event?.name}
                    </span>
                    <span className="text-zinc-500">
                      {req.event?.location} • {req.event?.event_date}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-zinc-500 block mb-0.5">Ponto de Encontro / Horário:</span>
                    <span className="text-zinc-800 dark:text-zinc-200 block font-semibold">
                      {req.meeting_point || 'A combinar pelo chat'}
                    </span>
                    {req.meeting_time && (
                      <span className="text-orange-600 font-bold block">
                        Horário: {req.meeting_time.substring(0, 5)}h
                      </span>
                    )}
                  </div>
                </div>

                {/* Código Identificador do Ingresso Vinculado (Seção 10) */}
                {req.ticket_code && (
                  <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>
                        <strong>Código do Ingresso Vinculado:</strong>{' '}
                        <span className="font-mono font-black text-orange-700 dark:text-orange-300 ml-1">
                          {req.ticket_code}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(req.ticket_code)}
                        className="p-1 px-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 flex items-center gap-1"
                      >
                        {copiedCode === req.ticket_code ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-zinc-500" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                      <Link to="/tickets" className="text-[11px] font-bold text-orange-600 hover:underline">
                        Ver Ingresso
                      </Link>
                    </div>
                  </div>
                )}

                {req.message && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                    "{req.message}"
                  </p>
                )}

                {/* Ações disponíveis */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="text-[11px] text-zinc-400">
                    Solicitado em: {new Date(req.requested_at).toLocaleDateString('pt-BR')}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botões do Voluntário quando Pendente */}
                    {isVolunteer && req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={actionLoading}
                          type="button"
                          className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => handleAccept(req.id)}
                          disabled={actionLoading}
                          type="button"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                        >
                          Aceitar Contratação
                        </button>
                      </>
                    )}

                    {/* Chat Seguro liberado */}
                    {canChat && (
                      <Link
                        to={`/chat/${req.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Abrir Chat com {otherParty?.name?.split(' ')[0]}</span>
                      </Link>
                    )}

                    {/* Confirmação de Comparecimento pelo Cliente (Seção 12) */}
                    {canConfirmAttendance && (
                      <button
                        onClick={() => {
                          setAttendanceModalReq(req);
                          setAttendanceChoice(true);
                          setAttendanceNotes('');
                        }}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Confirmar Comparecimento</span>
                      </button>
                    )}

                    {/* Avaliação pelo Cliente */}
                    {canReview && (
                      <button
                        onClick={() => {
                          setReviewRequest(req);
                          setIsReviewOpen(true);
                        }}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Avaliar Voluntário</span>
                      </button>
                    )}

                    {req.review && (
                      <span className="text-xs font-bold text-amber-600 inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Avaliado ({req.review.rating}★)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-md mx-auto space-y-3">
          <Clock className="w-12 h-12 text-orange-500 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Nenhuma contratação nesta categoria
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {isVolunteer
              ? 'Quando clientes solicitarem seu acompanhamento em eventos, os pedidos aparecerão aqui.'
              : 'Navegue pelos eventos e solicite voluntários disponíveis para acompanhá-lo com segurança.'}
          </p>
          {!isVolunteer && (
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm mt-2"
            >
              <span>Explorar Eventos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Modal de Confirmação de Comparecimento (Seção 12) */}
      {attendanceModalReq && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Auditoria Pós-Evento (Seção 12)</span>
              </div>
              <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-50">
                O voluntário compareceu ao evento?
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Confirmação do acompanhamento de <strong>{attendanceModalReq.volunteer?.name}</strong> no evento <strong>{attendanceModalReq.event?.name}</strong>.
              </p>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendanceChoice(true)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    attendanceChoice
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span>Sim, compareceu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceChoice(false)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    !attendanceChoice
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 ring-2 ring-red-500'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-red-600" />
                  <span>Não compareceu</span>
                </button>
              </div>

              {!attendanceChoice && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-[11px] text-red-700 dark:text-red-300 leading-tight">
                  Atenção: Ao relatar ausência sem justificativa, o voluntário será temporariamente bloqueado para novas contratações pela administração para averiguação da ocorrência.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Observações ou Comentários (Opcional):
                </label>
                <textarea
                  rows={2}
                  value={attendanceNotes}
                  onChange={(e) => setAttendanceNotes(e.target.value)}
                  placeholder="Detalhes sobre o encontro no evento..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAttendanceModalReq(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-700"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Avaliação Pública */}
      <ReviewModal
        request={reviewRequest}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={() => {
          setIsReviewOpen(false);
          fetchRequests();
        }}
      />
    </div>
  );
};
