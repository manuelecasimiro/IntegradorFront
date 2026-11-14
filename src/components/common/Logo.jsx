import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', variant = 'default' }) => {
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'lg' ? 'text-2xl' : 'text-xl';
  const isInverse = variant === 'inverse';

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-lg p-1"
      aria-label="Inova Acess - Ir para a página inicial"
    >
      <div className={`${iconSize} rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-sm group-hover:bg-orange-700 transition-colors flex-shrink-0`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a8.5 8.5 0 0 1 13 0" />
          <path d="M12 11v6" />
          <path d="M8 15h8" />
        </svg>
      </div>
      <div className="flex flex-col text-left">
        <span className={`${textSize} font-black tracking-tight flex items-center gap-1`}>
          <span
            className={`logo-inova ${isInverse ? 'text-white' : 'text-zinc-950'}`}
            style={{ color: isInverse ? '#ffffff' : 'var(--logo-inova-color, #09090b)' }}
          >
            Inova
          </span>
          <span className="text-orange-600">Acess</span>
        </span>
        <span className={`logo-subtitle text-[10px] uppercase font-bold tracking-widest -mt-1 ${isInverse ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Incluir é Inovar
        </span>
      </div>
    </Link>
  );
};
