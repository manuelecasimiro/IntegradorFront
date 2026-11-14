import React from 'react';
import { Link } from 'react-router-dom';
import { AccessibilityBadges } from './AccessibilityBadges';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

export const EventCard = ({ event }) => {
  // Format date: DD de MMMM de YYYY
  const formatDate = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5) + 'h';
  };

  return (
    <article className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700/60 transition-all flex flex-col h-full">
      {/* Banner Imagem */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={event.banner_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=300&fit=crop'}
          alt={`Banner do evento ${event.name}: em ${event.location}, ${event.city}.`}
          data-audiodescricao={`Banner visual do evento ${event.name}. Localizado em ${event.location}, cidade de ${event.city}. Data do evento: ${formatDate(event.event_date)}.`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-zinc-950/90 text-orange-700 dark:text-orange-400 shadow-sm backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <time dateTime={event.event_date}>{formatDate(event.event_date)}</time>
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
          <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{event.location} • {event.city}, {event.state}</span>
        </div>

        <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
          {event.name}
        </h3>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Recursos de Acessibilidade */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 mb-4">
          <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Acessibilidade no local
          </span>
          <AccessibilityBadges accessibility={event.accessibility} compact={true} />
        </div>

        {/* Botão de Ação */}
        <Link
          to={`/events/${event.id}`}
          className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-bold text-sm bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 active:scale-95"
        >
          <span>Ver Recursos & Detalhes</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};
