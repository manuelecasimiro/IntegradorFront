import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Clock, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export const VolunteerCard = ({ volunteer, onRequestClick }) => {
  const profile = volunteer.volunteerProfile || {};
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  const statusConfig = {
    available: {
      label: 'Disponível',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    },
    busy: {
      label: 'Em Acompanhamento',
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
      dot: 'bg-amber-500',
    },
    unavailable: {
      label: 'Indisponível',
      bg: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
      dot: 'bg-zinc-400',
    },
    blocked: {
      label: 'Bloqueado',
      bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
      dot: 'bg-red-500',
    },
  };

  const status = statusConfig[profile.availability_status] || statusConfig.available;

  return (
    <article className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700/60 transition-all flex flex-col h-full">
      {/* Topo: Foto, Nome e Status */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className="relative">
          <img
            src={
              volunteer.profile_photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(volunteer.name)}&background=ea580c&color=fff&size=128`
            }
            alt={`Foto de perfil do voluntário ${volunteer.name}`}
            data-audiodescricao={`Foto de perfil de ${volunteer.name}. Voluntário solidário, status atual: ${status.label}.`}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-100 dark:border-zinc-800 shadow-sm"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${status.dot}`}
            title={`Status: ${status.label}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <h3 className="text-base font-black text-zinc-950 dark:text-zinc-50 truncate">
              {volunteer.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${status.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Avaliação & Quantidade de Acompanhamentos */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-orange-50/50 dark:bg-zinc-800/60 border border-orange-100/60 dark:border-zinc-800 mb-4 text-center">
        <div>
          <span className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            Avaliação
          </span>
          <div className="flex items-center justify-center gap-1 mt-0.5 text-zinc-900 dark:text-zinc-100 font-extrabold text-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
            <span>{Number(profile.rating_avg || 5.0).toFixed(1)}</span>
          </div>
        </div>
        <div className="border-l border-zinc-200 dark:border-zinc-700">
          <span className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            Acompanhamentos
          </span>
          <div className="mt-0.5 text-zinc-900 dark:text-zinc-100 font-extrabold text-sm">
            {profile.completed_services_count || 0}
          </div>
        </div>
      </div>

      {/* Descrição / Biografia */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4 flex-1">
        {profile.biography || 'Voluntário solidário dedicado a fornecer apoio e acessibilidade em eventos.'}
      </p>

      {/* Habilidades */}
      <div className="mb-5">
        <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Competências & Habilidades
        </span>
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[11px] text-zinc-400 font-semibold self-center">
              +{skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
        <Link
          to={`/volunteers/${volunteer.id}`}
          className="inline-flex items-center justify-center gap-1 py-2.5 px-3 min-h-[44px] rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 font-bold text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-600 active:scale-95"
        >
          <span>Ver Perfil</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>

        <button
          onClick={() => onRequestClick(volunteer)}
          disabled={profile.availability_status === 'blocked'}
          type="button"
          title={profile.availability_status === 'blocked' ? 'Voluntário com pendência cadastral em aberto' : 'Solicitar contratação'}
          className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[44px] rounded-xl font-bold text-xs text-white shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-orange-600 active:scale-95 ${
            profile.availability_status === 'blocked'
              ? 'bg-zinc-400 cursor-not-allowed opacity-60'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{profile.availability_status === 'blocked' ? 'Bloqueado' : 'Contratar'}</span>
        </button>
      </div>
    </article>
  );
};
