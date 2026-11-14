import React from 'react';
import {
  Accessibility,
  Eye,
  HandMetal,
  Subtitles,
  Footprints,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const accessibilityItems = [
  { key: 'wheelchair_accessible', label: 'Cadeirantes', icon: Accessibility },
  { key: 'sign_language_interpreter', label: 'Intérprete Libras', icon: HandMetal },
  { key: 'audio_description', label: 'Audiodescrição', icon: Eye },
  { key: 'accessible_restrooms', label: 'Banheiro Adaptado', icon: CheckCircle2 },
  { key: 'ramps', label: 'Rampas de Acesso', icon: Compass },
  { key: 'subtitles', label: 'Legendas ao Vivo', icon: Subtitles },
  { key: 'tactile_paving', label: 'Piso Tátil', icon: Footprints },
  { key: 'specialized_assistance', label: 'Equipe de Apoio', icon: Users },
];

export const AccessibilityBadges = ({ accessibility = {}, compact = false }) => {
  if (!accessibility) return null;

  const activeItems = accessibilityItems.filter(item => accessibility[item.key]);

  if (activeItems.length === 0) {
    return (
      <span className="text-xs text-zinc-500 italic">
        Recursos sob consulta com o organizador.
      </span>
    );
  }

  const itemsToRender = compact ? activeItems.slice(0, 4) : activeItems;
  const remainingCount = activeItems.length - itemsToRender.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list" aria-label="Recursos de acessibilidade disponíveis">
      {itemsToRender.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.key}
            role="listitem"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50"
          >
            <Icon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <span>{item.label}</span>
          </span>
        );
      })}

      {compact && remainingCount > 0 && (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          title={`${remainingCount} outros recursos disponíveis`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};
