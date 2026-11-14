import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { VolunteerCard } from '../components/volunteers/VolunteerCard';
import { RequestModal } from '../components/volunteers/RequestModal';
import { Search, Users, HeartHandshake, Filter } from 'lucide-react';

export const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVolunteers = () => {
    setLoading(true);
    const params = {
      search: search || undefined,
      skill: selectedSkill || undefined,
      status: selectedStatus || undefined,
    };

    api.get('/volunteers', params)
      .then((res) => {
        setVolunteers(res?.data?.data || []);
      })
      .catch((err) => {
        console.error('Erro ao carregar voluntários:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVolunteers();
  }, [selectedSkill, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVolunteers();
  };

  const handleRequestClick = (vol) => {
    setSelectedVolunteer(vol);
    setIsModalOpen(true);
  };

  return (
    <div id="conteudo-principal" className="space-y-8 py-8 sm:py-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Rede de Apoio e Solidariedade</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
          Voluntários Disponíveis para Acompanhamento
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
          Conheça pessoas capacitadas em Libras, guia vidente, mobilidade e acolhimento para curtir eventos com você.
        </p>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar voluntário pelo nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-medium focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              <option value="">Todas as Habilidades</option>
              <option value="Libras">Libras (Língua de Sinais)</option>
              <option value="Mobilidade">Mobilidade & Acompanhamento</option>
              <option value="Guia Vidente">Guia Vidente</option>
              <option value="Acolhimento">Acolhimento & Orientação</option>
              <option value="Audiodescrição">Audiodescrição de Apoio</option>
            </select>
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-medium focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              <option value="">Todos os Status</option>
              <option value="available">Apenas Disponíveis</option>
              <option value="busy">Em Atendimento</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-sm text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-orange-600"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Grid de Voluntários */}
      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-500">
          Carregando voluntários disponíveis...
        </div>
      ) : volunteers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((vol) => (
            <VolunteerCard
              key={vol.id}
              volunteer={vol}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-md mx-auto space-y-3">
          <Users className="w-12 h-12 text-orange-500 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Nenhum voluntário encontrado
          </h2>
          <p className="text-xs text-zinc-500">
            Tente remover os filtros ou pesquisar por outro termo.
          </p>
        </div>
      )}

      {/* Modal de Solicitação */}
      <RequestModal
        volunteer={selectedVolunteer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
