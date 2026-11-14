import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { accessibilityItems } from '../components/events/AccessibilityBadges';
import { RequestModal } from '../components/volunteers/RequestModal';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Ticket,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Star,
  Check,
  HeartHandshake,
  UserPlus,
  AlertCircle,
} from 'lucide-react';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isVolunteer, isClient, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal de Contratação
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvent = () => {
    setLoading(true);
    api.get(`/events/${id}`)
      .then((res) => {
        setEvent(res?.data);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar detalhes do evento.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleToggleAvailability = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAvailabilityLoading(true);
    setFeedback(null);

    try {
      if (event?.has_volunteered) {
        await api.delete(`/events/${id}/volunteer-availability`);
        setFeedback({ msg: 'Sua disponibilidade para este evento foi retirada.', isError: false });
      } else {
        await api.post(`/events/${id}/volunteer-availability`);
        setFeedback({ msg: 'Disponibilidade registrada com sucesso para este evento!', isError: false });
      }
      fetchEvent();
    } catch (err) {
      setFeedback({ msg: err.message || 'Erro ao alterar disponibilidade.', isError: true });
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleOpenRequest = (vol) => {
    setSelectedVolunteer(vol);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="py-20 text-center text-sm text-zinc-500">Carregando informações do evento...</div>;
  }

  if (error || !event) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-red-600 font-bold">{error || 'Evento não encontrado'}</p>
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-orange-600 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Eventos</span>
        </Link>
      </div>
    );
  }

  const access = event.accessibility || {};
  const availableVolunteers = (event.event_volunteers || [])
    .map((ev) => ev.volunteer)
    .filter(Boolean);

  return (
    <div id="conteudo-principal" className="space-y-8 py-8">
      {/* Botão Voltar */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para lista de eventos</span>
      </Link>

      {/* Banner Principal */}
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 w-full shadow-lg bg-zinc-100 dark:bg-zinc-800">
        <img
          src={event.banner_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop'}
          alt={`Banner de ${event.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-bold text-xs uppercase tracking-wider">
              {event.city} - {event.state}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {event.name}
          </h1>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2.5 ${
            feedback.isError
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {feedback.isError ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Descrição, Acessibilidade e Voluntários Disponíveis */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informações de Data e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-zinc-400 uppercase">Data & Horário</span>
                <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                  {event.event_date} às {event.start_time?.substring(0, 5)}h
                </span>
                <span className="block text-xs text-zinc-500">Término previsto: {event.end_time?.substring(0, 5)}h</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-zinc-400 uppercase">Endereço do Local</span>
                <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                  {event.location}
                </span>
                <span className="block text-xs text-zinc-500 leading-tight">{event.address}</span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              Sobre a Proposta do Evento
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Checklist Completo de Recursos de Acessibilidade */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <span>Auditoria de Recursos Inclusivos</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Verificação declarada pelo organizador para atendimento às normas de acessibilidade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {accessibilityItems.map((item) => {
                const isAvailable = !!access[item.key];
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                      isAvailable
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                );
              })}
            </div>

            {access.additional_notes && (
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-xs text-orange-950 dark:text-orange-200 space-y-1">
                <span className="font-bold block">Orientações Práticas do Local:</span>
                <p>{access.additional_notes}</p>
              </div>
            )}
          </div>

          {/* VOLUNTÁRIOS DISPONÍVEIS NESTE EVENTO (Seção 8 do documento oficial) */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span>Seção Oficial: Voluntários Disponíveis</span>
              </div>
              <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-50">
                Voluntários com Disponibilidade Confirmada ({availableVolunteers.length})
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Estes voluntários solidários marcaram disponibilidade para atuar neste evento. Você pode consultar seus perfis e solicitar contratação imediata.
              </p>
            </div>

            {availableVolunteers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableVolunteers.map((vol) => {
                  const profile = vol.volunteer_profile || vol.volunteerProfile || {};
                  const skills = Array.isArray(profile.skills) ? profile.skills : [];

                  return (
                    <div
                      key={vol.id}
                      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={vol.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=ea580c&color=fff`}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-orange-200"
                          />
                          <div>
                            <h3 className="font-black text-sm text-zinc-950 dark:text-zinc-50">
                              {vol.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span>{Number(profile.rating_avg || 5.0).toFixed(1)}</span>
                              <span className="text-zinc-400 font-normal">({profile.completed_services_count || 0} acompanhamentos)</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {profile.biography || 'Voluntário disponível para apoiar pessoas com deficiência neste evento.'}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {skills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                        <Link
                          to={`/volunteers/${vol.id}`}
                          className="flex-1 py-2 px-3 text-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
                        >
                          Ver Perfil
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenRequest(vol)}
                          className="flex-1 py-2 px-3 text-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm"
                        >
                          Solicitar Contratação
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 space-y-2">
                <p className="text-xs font-medium">Ainda não há voluntários registrados especificamente para este evento.</p>
                <p className="text-[11px] text-zinc-400">Você também pode consultar a lista geral de voluntários da sua cidade.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Ações do Voluntário e Ingressos */}
        <div className="space-y-6">
          {/* Card de Ação do Voluntário (Seção 8: Tenho Disponibilidade) */}
          {isVolunteer && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100/60 dark:from-zinc-900 dark:to-zinc-800 border-2 border-orange-200 dark:border-zinc-700 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-400">
                <HeartHandshake className="w-4 h-4" />
                <span>Área do Voluntário</span>
              </div>
              <h3 className="text-base font-black text-zinc-950 dark:text-zinc-50">
                Disponibilidade para o Evento
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {event.has_volunteered
                  ? 'Você registrou disponibilidade para apoiar clientes com deficiência neste evento. Seu perfil está visível para solicitações.'
                  : 'Ao confirmar sua disponibilidade, seu card aparecerá nesta página para pessoas com deficiência solicitarem acompanhamento.'}
              </p>

              <button
                type="button"
                onClick={handleToggleAvailability}
                disabled={availabilityLoading}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  event.has_volunteered
                    ? 'bg-zinc-800 text-white hover:bg-zinc-900 border border-zinc-700'
                    : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95'
                }`}
              >
                {availabilityLoading ? (
                  <span>Processando...</span>
                ) : event.has_volunteered ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Retirar Disponibilidade</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>Tenho Disponibilidade</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Card para Clientes: Solicitar Acompanhamento Geral */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Precisa de Acompanhamento?
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Você pode solicitar que um dos nossos voluntários capacitados acompanhe você durante todo o evento com segurança e respeito.
            </p>

            <Link
              to="/volunteers"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Ver Todos os Voluntários</span>
            </Link>

            {event.ticket_information && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <Ticket className="w-4 h-4 text-orange-600" />
                  <span>Informação de Ingressos</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {event.ticket_information}
                </p>
                <Link to="/tickets" className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline pt-1">
                  <span>Como funciona a vinculação de ingressos</span>
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
              Organizado por: <strong>{event.organizer?.name || 'Organizador Inova'}</strong>
            </div>
          </div>
        </div>
      </div>

      <RequestModal
        volunteer={selectedVolunteer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
