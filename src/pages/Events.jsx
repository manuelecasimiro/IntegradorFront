import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EventCard } from '../components/events/EventCard';
import { EventCarousel } from '../components/events/EventCarousel';
import { Search, Filter, X, SlidersHorizontal, Accessibility, Calendar, LayoutGrid, Layers } from 'lucide-react';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'

  // Accessibility Checkboxes
  const [accessibilityFilters, setAccessibilityFilters] = useState({
    wheelchair_accessible: false,
    sign_language_interpreter: false,
    audio_description: false,
    accessible_restrooms: false,
    ramps: false,
    subtitles: false,
    tactile_paving: false,
    specialized_assistance: false,
  });

  const fetchEvents = () => {
    setLoading(true);
    const params = {
      search: search || undefined,
      city: city || undefined,
    };

    Object.entries(accessibilityFilters).forEach(([key, value]) => {
      if (value) params[key] = 1;
    });

    api.get('/events', params)
      .then((res) => {
        setEvents(res?.data?.data || []);
      })
      .catch((err) => {
        console.error('Erro ao buscar eventos:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [accessibilityFilters, city]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCheckboxChange = (key) => {
    setAccessibilityFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearFilters = () => {
    setSearch('');
    setCity('');
    setAccessibilityFilters({
      wheelchair_accessible: false,
      sign_language_interpreter: false,
      audio_description: false,
      accessible_restrooms: false,
      ramps: false,
      subtitles: false,
      tactile_paving: false,
      specialized_assistance: false,
    });
  };

  const activeFiltersCount = Object.values(accessibilityFilters).filter(Boolean).length;

  return (
    <div id="conteudo-principal" className="space-y-8 py-8 sm:py-10">
      {/* Cabeçalho */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda Inclusiva</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50">
          Encontre Eventos com Recursos de Acessibilidade
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
          Filtre espetáculos, shows e festivais pelos recursos específicos que atendem suas necessidades de locomoção, audição ou visão.
        </p>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar evento por nome, local ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-medium focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              <option value="">Todas as Cidades</option>
              <option value="Rio de Janeiro">Rio de Janeiro</option>
              <option value="São Paulo">São Paulo</option>
              <option value="Curitiba">Curitiba</option>
              <option value="Belo Horizonte">Belo Horizonte</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-sm text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-orange-600"
          >
            Buscar
          </button>

          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`px-4 py-2.5 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeFiltersCount > 0
                ? 'bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300'
                : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Recursos {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </form>

        {/* Painel Expansível de Filtros de Acessibilidade */}
        {filtersOpen && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Selecione os recursos de acessibilidade desejados:
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpar Filtros</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'wheelchair_accessible', label: 'Cadeirantes' },
                { key: 'sign_language_interpreter', label: 'Intérprete Libras' },
                { key: 'audio_description', label: 'Audiodescrição' },
                { key: 'accessible_restrooms', label: 'Banheiro Adaptado' },
                { key: 'ramps', label: 'Rampas de Acesso' },
                { key: 'subtitles', label: 'Legendas ao Vivo' },
                { key: 'tactile_paving', label: 'Piso Tátil' },
                { key: 'specialized_assistance', label: 'Equipe de Apoio' },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    accessibilityFilters[item.key]
                      ? 'bg-orange-50 border-orange-500 text-orange-900 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-600'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={accessibilityFilters[item.key]}
                    onChange={() => handleCheckboxChange(item.key)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cabeçalho da Lista com Alternador de Visualização (Carrossel vs Grade) */}
      {!loading && events.length > 0 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            {events.length} evento{events.length > 1 ? 's' : ''} encontrado{events.length > 1 ? 's' : ''}
          </span>

          <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl" role="group" aria-label="Modo de visualização dos eventos">
            <button
              onClick={() => setViewMode('carousel')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'carousel'
                  ? 'bg-white dark:bg-zinc-900 text-orange-600 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              aria-pressed={viewMode === 'carousel'}
              title="Visualizar em carrossel dinâmico (ideal para celular)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Carrossel</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-orange-600 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              aria-pressed={viewMode === 'grid'}
              title="Visualizar em grade completa"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grade</span>
            </button>
          </div>
        </div>
      )}

      {/* Exibição dos Eventos (Carrossel ou Grade) */}
      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-500">
          Carregando eventos disponíveis...
        </div>
      ) : events.length > 0 ? (
        viewMode === 'carousel' ? (
          <EventCarousel events={events} autoPlayInterval={5000} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-md mx-auto space-y-4">
          <Accessibility className="w-12 h-12 text-orange-500 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Nenhum evento encontrado
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Não encontramos eventos com os critérios selecionados. Tente ajustar os filtros ou buscar por outra cidade.
          </p>
          <button
            onClick={handleClearFilters}
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};
