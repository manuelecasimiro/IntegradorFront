import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Calendar,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  UserPlus,
  Ban,
  RotateCcw,
  Search,
  Trash2,
  X,
  Building,
  AlertTriangle,
  UserCheck,
  Plus,
  Compass,
  MapPin,
  Clock,
  Ticket,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user: currentAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('users'); // 'users', 'events', 'pendencies'
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal para Criar Organizador
  const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('organizador123');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgBio, setOrgBio] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Modal para Gerenciar / Criar Evento (Seção 7)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('18:00');
  const [eventEndTime, setEventEndTime] = useState('22:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventCity, setEventCity] = useState('São Paulo');
  const [eventState, setEventState] = useState('SP');
  const [eventBanner, setEventBanner] = useState('');
  const [eventTicketInfo, setEventTicketInfo] = useState('');
  const [eventAccessibility, setEventAccessibility] = useState({
    wheelchair_accessible: true,
    sign_language_interpreter: true,
    audio_description: false,
    accessible_restrooms: true,
    ramps: true,
    subtitles: false,
    tactile_paving: false,
    specialized_assistance: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        role: userRoleFilter || undefined,
        search: search || undefined,
      };
      if (activeStatusFilter === 'active') params.is_active = 1;
      if (activeStatusFilter === 'banned') params.is_active = 0;

      const [statsRes, usersRes, eventsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users', params),
        api.get('/events'),
      ]);
      setStats(statsRes?.data);
      const userList = Array.isArray(usersRes?.data?.data)
        ? usersRes.data.data
        : Array.isArray(usersRes?.data)
        ? usersRes.data
        : [];
      setUsers(userList);

      const eventList = Array.isArray(eventsRes?.data?.data)
        ? eventsRes.data.data
        : Array.isArray(eventsRes?.data)
        ? eventsRes.data
        : [];
      setEvents(eventList);
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userRoleFilter, activeStatusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const notify = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  // 1. Banir ou Desbanir Usuário
  const handleToggleStatus = async (user) => {
    const actionText = user.is_active ? 'banir / desativar' : 'reativar';
    if (!window.confirm(`Tem certeza que deseja ${actionText} o usuário ${user.name}?`)) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/admin/users/${user.id}/toggle-status`);
      notify(res?.message || 'Status atualizado com sucesso.');
      loadData();
    } catch (err) {
      notify(err.message || 'Erro ao alterar status.', true);
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Alterar Papel
  const handleChangeRole = async (user, newRole) => {
    if (user.role === newRole) return;
    if (!window.confirm(`Deseja alterar o papel de "${user.name}" de "${user.role}" para "${newRole}"?`)) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      notify(res?.message || 'Papel alterado com sucesso.');
      loadData();
    } catch (err) {
      notify(err.message || 'Erro ao alterar papel do usuário.', true);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Excluir Usuário
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`ATENÇÃO: Deseja excluir permanentemente o cadastro de ${user.name}? Esta ação não pode ser desfeita.`)) return;

    setActionLoading(true);
    try {
      const res = await api.delete(`/admin/users/${user.id}`);
      notify(res?.message || 'Usuário removido com sucesso.');
      loadData();
    } catch (err) {
      notify(err.message || 'Erro ao excluir usuário.', true);
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Regularizar Pendência de Voluntário (Seção 12)
  const handleResolvePendency = async (volunteerId, volunteerName) => {
    if (!window.confirm(`Deseja regularizar a pendência do voluntário "${volunteerName}" e restaurar seu status para Disponível?`)) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/admin/volunteers/${volunteerId}/resolve-pendency`);
      notify(res?.message || 'Pendência regularizada com sucesso!');
      loadData();
    } catch (err) {
      notify(err.message || 'Erro ao regularizar pendência.', true);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Excluir Evento (Seção 7)
  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Tem certeza de que deseja excluir o evento "${event.name}"?`)) return;

    setActionLoading(true);
    try {
      await api.delete(`/events/${event.id}`);
      notify('Evento excluído com sucesso.');
      loadData();
    } catch (err) {
      notify(err.message || 'Erro ao excluir evento.', true);
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Criar Novo Evento (Seção 7)
  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    try {
      await api.post('/events', {
        name: eventName,
        description: eventDescription,
        event_date: eventDate,
        start_time: eventStartTime,
        end_time: eventEndTime,
        location: eventLocation,
        address: eventAddress,
        city: eventCity,
        state: eventState,
        banner_url: eventBanner || undefined,
        ticket_information: eventTicketInfo || undefined,
        ...eventAccessibility,
      });

      notify('Evento cadastrado com sucesso!');
      setIsEventModalOpen(false);
      setEventName('');
      setEventDescription('');
      setEventDate('');
      setEventLocation('');
      setEventAddress('');
      loadData();
    } catch (err) {
      setModalError(err.message || 'Erro ao criar evento.');
    } finally {
      setModalLoading(false);
    }
  };

  // 7. Criar Organizador
  const handleCreateOrganizer = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    try {
      const res = await api.post('/admin/users/organizer', {
        name: orgName,
        email: orgEmail,
        password: orgPassword,
        phone: orgPhone || undefined,
        bio: orgBio || undefined,
      });

      notify(res?.message || 'Organizador credenciado com sucesso!');
      setIsOrganizerModalOpen(false);
      setOrgName('');
      setOrgEmail('');
      setOrgPhone('');
      setOrgBio('');
      loadData();
    } catch (err) {
      setModalError(err.message || 'Erro ao credenciar organizador.');
    } finally {
      setModalLoading(false);
    }
  };

  const blockedVolunteers = users.filter(
    (u) => u.role === 'volunteer' && (u.volunteerProfile?.availability_status === 'blocked' || u.volunteerProfile?.pendencies_notes)
  );

  return (
    <div id="conteudo-principal" className="space-y-8 py-8 sm:py-10">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel do Administrador Geral</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 dark:text-zinc-50">
            Governança da Plataforma Inova Acesso
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Gestão de usuários, moderação de voluntários, controle de eventos e resolução de pendências.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEventModalOpen(true)}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Criar Evento</span>
          </button>
          <button
            onClick={() => setIsOrganizerModalOpen(true)}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all hover:bg-zinc-800 border border-zinc-700"
          >
            <Building className="w-4 h-4" />
            <span>+ Credenciar Organizador</span>
          </button>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 transition-all ${
            feedback.isError
              ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
          }`}
        >
          {feedback.isError ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Indicadores / Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>Usuários Totais</span>
            </span>
            <div className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
              {stats.total_users}
            </div>
            <span className="text-[11px] text-zinc-400">Na base local</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Clientes PCD</span>
            </span>
            <div className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
              {stats.total_clients}
            </div>
            <span className="text-[11px] text-blue-600 font-semibold">Pessoas com deficiência</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voluntários</span>
            </span>
            <div className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
              {stats.total_volunteers}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Solidários capacitados</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Eventos Ativos</span>
            </span>
            <div className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
              {events.length}
            </div>
            <span className="text-[11px] text-purple-600 font-semibold">Cadastrados no sistema</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-red-600" />
              <span>Contas Banidas</span>
            </span>
            <div className="text-2xl font-black text-red-600">
              {stats.banned_users}
            </div>
            <span className="text-[11px] text-zinc-400">Inativas por moderação</span>
          </div>
        </div>
      )}

      {/* Tabs de Navegação Administrativa (Seção 5 e 7) */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setCurrentTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            currentTab === 'users'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Usuários & Moderação
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            currentTab === 'events'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Gerenciar Eventos ({events.length})
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('pendencies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentTab === 'pendencies'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Pendências & Bloqueios</span>
          {blockedVolunteers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px]">
              {blockedVolunteers.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: GESTÃO DE USUÁRIOS */}
      {currentTab === 'users' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-50">
                  Gerenciamento de Perfis, Acessos e Moderação
                </h2>
                <p className="text-xs text-zinc-500">
                  Você pode conceder permissão de organizador, suspender/banir contas ou reativar perfis.
                </p>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, e-mail ou CPF..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </form>

              <div className="w-full sm:w-48">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  <option value="">Todos os Papéis</option>
                  <option value="client">Clientes PCD</option>
                  <option value="volunteer">Voluntários Solidários</option>
                  <option value="organizer">Organizadores</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>

              <div className="w-full sm:w-44">
                <select
                  value={activeStatusFilter}
                  onChange={(e) => setActiveStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  <option value="">Todos os Status</option>
                  <option value="active">🟢 Apenas Ativos</option>
                  <option value="banned">🔴 Apenas Banidos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Usuário & Contato</th>
                  <th className="py-3.5 px-4">Papel Atual</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Conceder Acesso / Papel</th>
                  <th className="py-3.5 px-4 text-right">Moderação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-zinc-500">
                      Carregando base de usuários...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((u) => {
                    const isSelf = u.id === currentAdmin?.id;

                    return (
                      <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                u.profile_photo ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ea580c&color=fff&size=64`
                              }
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover border border-zinc-200"
                            />
                            <div>
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-black">
                                    Você
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-500">{u.email}</div>
                              {u.phone && <div className="text-[10px] text-zinc-400">{u.phone}</div>}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                : u.role === 'organizer'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : u.role === 'volunteer'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {u.role === 'client' ? 'Cliente PCD' : u.role === 'volunteer' ? 'Voluntário' : u.role === 'organizer' ? 'Organizador' : 'Admin'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              u.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {u.is_active ? 'Ativo' : 'Banido'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isSelf ? (
                            <span className="text-[11px] text-zinc-400 italic">Administrador Geral</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u, e.target.value)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200"
                            >
                              <option value="client">Cliente PCD</option>
                              <option value="volunteer">Voluntário Solidário</option>
                              <option value="organizer">👑 Conceder: Organizador</option>
                              <option value="admin">Administrador</option>
                            </select>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isSelf ? (
                            <span className="text-[11px] text-zinc-400">Protegido</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleStatus(u)}
                                disabled={actionLoading}
                                type="button"
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  u.is_active
                                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                              >
                                {u.is_active ? <><Ban className="w-3.5 h-3.5" /><span>Banir</span></> : <><RotateCcw className="w-3.5 h-3.5" /><span>Desbanir</span></>}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u)}
                                disabled={actionLoading}
                                type="button"
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-zinc-500">
                      Nenhum usuário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GERENCIAR EVENTOS (Seção 7) */}
      {currentTab === 'events' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-50">
                Gerenciamento Oficial de Eventos
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Cadastre novos eventos, audite recursos de acessibilidade e controle os voluntários relacionados.
              </p>
            </div>
            <button
              onClick={() => setIsEventModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento</span>
            </button>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-200">
                      <img
                        src={evt.banner_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=300&fit=crop'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                        {evt.city} - {evt.state}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-zinc-950 dark:text-zinc-50 line-clamp-1">
                      {evt.name}
                    </h3>

                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>{evt.event_date} às {evt.start_time?.substring(0, 5)}h</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <Link
                      to={`/events/${evt.id}`}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Ver Detalhes & Voluntários
                    </Link>

                    <button
                      onClick={() => handleDeleteEvent(evt)}
                      type="button"
                      className="p-1.5 text-zinc-400 hover:text-red-600"
                      title="Excluir evento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 space-y-3">
              <Calendar className="w-10 h-10 text-orange-500 mx-auto opacity-70" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Nenhum evento cadastrado no momento.
              </p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Crie um novo evento acessível clicando no botão "+ Novo Evento" acima.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PENDÊNCIAS E BLOQUEIOS (Seção 12) */}
      {currentTab === 'pendencies' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-50">
              Controle de Pendências & Voluntários Bloqueados
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Voluntários relatados por ausência em eventos ficam impedidos de aceitar novas contratações até a resolução da pendência.
            </p>
          </div>

          {blockedVolunteers.length > 0 ? (
            <div className="space-y-3">
              {blockedVolunteers.map((vol) => (
                <div
                  key={vol.id}
                  className="p-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={vol.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=ea580c&color=fff`}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-red-300"
                    />
                    <div>
                      <div className="font-black text-sm text-zinc-950 dark:text-zinc-50">
                        {vol.name}
                      </div>
                      <div className="text-xs text-zinc-500">{vol.email} • {vol.phone}</div>
                      <div className="text-xs text-red-700 dark:text-red-300 font-semibold mt-1">
                        Motivo do Bloqueio: {vol.volunteerProfile?.pendencies_notes || 'Ausência reportada pelo cliente.'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolvePendency(vol.id, vol.name)}
                    disabled={actionLoading}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Regularizar Pendência & Desbloquear</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Nenhuma pendência ativa no momento
              </p>
              <p className="text-xs text-zinc-400">
                Todos os voluntários cadastrados estão em conformidade e aptos a atender solicitações.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal para Criar Novo Evento (Seção 7) */}
      {isEventModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase mb-1">
                <span>Administração de Eventos</span>
              </div>
              <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50">
                Cadastrar Novo Evento Acessível
              </h3>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Nome do Evento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Festival Inclusivo 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Descrição Detalhada *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Informações sobre atrações, proposta inclusiva e organização..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Início *</label>
                  <input
                    type="time"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Término *</label>
                  <input
                    type="time"
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Local / Estádio / Teatro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Teatro Municipal"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Endereço Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Av. Paulista, 1000"
                    value={eventAddress}
                    onChange={(e) => setEventAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Estado (UF) *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={eventState}
                    onChange={(e) => setEventState(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">URL da Imagem do Banner (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={eventBanner}
                  onChange={(e) => setEventBanner(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                />
              </div>

              {/* Recursos de Acessibilidade */}
              <div>
                <span className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-2">Recursos de Acessibilidade no Local:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.keys(eventAccessibility).map((k) => (
                    <label key={k} className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eventAccessibility[k]}
                        onChange={(e) => setEventAccessibility({ ...eventAccessibility, [k]: e.target.checked })}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="capitalize">{k.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md"
                >
                  {modalLoading ? 'Cadastrando...' : 'Publicar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Credenciamento de Organizador */}
      {isOrganizerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setIsOrganizerModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase mb-1">
                <Building className="w-3.5 h-3.5" />
                <span>Credenciamento</span>
              </div>
              <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50">
                Credenciar Nova Produtora / Organizador
              </h3>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateOrganizer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Nome da Produtora *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rio Entretenimento Acessível"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">E-mail Profissional *</label>
                  <input
                    type="email"
                    required
                    placeholder="contato@produtora.com"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Senha Inicial *</label>
                  <input
                    type="password"
                    required
                    value={orgPassword}
                    onChange={(e) => setOrgPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Telefone / Contato</label>
                <input
                  type="text"
                  placeholder="(XX) 90000-0000"
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">Descrição da Produtora</label>
                <textarea
                  rows={2}
                  placeholder="Projetos e compromissos com acessibilidade..."
                  value={orgBio}
                  onChange={(e) => setOrgBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOrganizerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md"
                >
                  {modalLoading ? 'Salvando...' : 'Conceder Credenciamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
