import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Contrast, ZoomIn, ZoomOut, Volume2, VolumeX, HandMetal } from 'lucide-react';

export const AccessibilityBar = () => {
  const {
    highContrast,
    toggleContrast,
    increaseFont,
    decreaseFont,
    resetFont,
    vlibrasEnabled,
    triggerVLibras,
    speechEnabled,
    toggleSpeech,
    isSpeaking,
    stopSpeaking,
  } = useAccessibility();

  return (
    <aside
      aria-label="Barra de recursos de acessibilidade digital"
      className="bg-zinc-950 text-white text-xs border-b border-zinc-800"
    >
      {/* VERSÃO DESKTOP (sm e acima) */}
      <div className="hidden sm:flex max-w-7xl mx-auto px-4 py-2 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-orange-400">Acessibilidade:</span>
          <a
            href="#conteudo-principal"
            className="text-zinc-300 hover:text-white underline focus-visible:ring-1 focus-visible:ring-orange-400 rounded px-1"
          >
            Ir para conteúdo [Alt + 1]
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Alto Contraste */}
          <button
            onClick={toggleContrast}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
              highContrast ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
            aria-pressed={highContrast}
            title="Alternar modo de alto contraste [Alt + 5]"
          >
            <Contrast className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Alto Contraste</span>
          </button>

          {/* Ajuste de Tamanho da Fonte */}
          <div className="inline-flex items-center rounded-lg bg-zinc-800 p-0.5" role="group" aria-label="Controle de tamanho de fonte">
            <button
              onClick={decreaseFont}
              type="button"
              className="p-1.5 hover:bg-zinc-700 rounded text-zinc-200 transition-colors"
              title="Diminuir tamanho do texto (A-)"
              aria-label="Diminuir texto"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={resetFont}
              type="button"
              className="px-2 py-1 text-xs font-bold hover:bg-zinc-700 rounded text-zinc-200"
              title="Restaurar tamanho padrão do texto"
              aria-label="Restaurar tamanho da fonte"
            >
              A
            </button>
            <button
              onClick={increaseFont}
              type="button"
              className="p-1.5 hover:bg-zinc-700 rounded text-zinc-200 transition-colors"
              title="Aumentar tamanho do texto (A+)"
              aria-label="Aumentar texto"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Tradutor para Libras 3D Oficial */}
          <button
            onClick={triggerVLibras}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
              vlibrasEnabled ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
            aria-pressed={vlibrasEnabled}
            title="Abrir avatar 3D oficial do VLibras para tradução em sinais"
          >
            <HandMetal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Libras {vlibrasEnabled ? '(Aberto)' : ''}</span>
          </button>

          {/* Audiodescrição e Leitor de Voz */}
          <button
            onClick={toggleSpeech}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
              speechEnabled ? 'bg-orange-500 text-black shadow-sm ring-2 ring-orange-300' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
            aria-pressed={speechEnabled}
            title="Ativar/Desativar audiodescrição e leitor de tela interativo"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-zinc-950' : ''}`} aria-hidden="true" />
            <span>{speechEnabled ? 'Audiodescrição Ativa' : 'Audiodescrição / Voz'}</span>
          </button>

          {/* Botão de Silenciar Rápido quando estiver falando */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors"
              title="Silenciar áudio agora [Esc]"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Silenciar</span>
            </button>
          )}
        </div>
      </div>

      {/* VERSÃO MOBILE: Barra Organizada, Compacta e Touch-Friendly */}
      <div className="sm:hidden px-2.5 py-1.5 flex items-center justify-between gap-1">
        {/* Botão Contraste Compacto */}
        <button
          onClick={toggleContrast}
          type="button"
          className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
            highContrast ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-200'
          }`}
          aria-pressed={highContrast}
          aria-label="Alto Contraste"
        >
          <Contrast className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Contraste</span>
        </button>

        {/* Grupo de Fontes Compacto */}
        <div className="flex items-center bg-zinc-800 rounded-lg p-0.5" role="group" aria-label="Tamanho de fonte">
          <button
            onClick={decreaseFont}
            type="button"
            className="px-2 py-1 text-[11px] font-bold text-zinc-300 active:bg-zinc-700 rounded"
            aria-label="Diminuir fonte"
          >
            A-
          </button>
          <button
            onClick={resetFont}
            type="button"
            className="px-1.5 py-1 text-[10px] font-black text-orange-400 active:bg-zinc-700 rounded"
            aria-label="Fonte padrão"
          >
            A
          </button>
          <button
            onClick={increaseFont}
            type="button"
            className="px-2 py-1 text-[11px] font-bold text-zinc-300 active:bg-zinc-700 rounded"
            aria-label="Aumentar fonte"
          >
            A+
          </button>
        </div>

        {/* Libras */}
        <button
          onClick={triggerVLibras}
          type="button"
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
            vlibrasEnabled ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'
          }`}
          aria-pressed={vlibrasEnabled}
          aria-label="Libras 3D"
        >
          <HandMetal className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Libras</span>
        </button>

        {/* Áudio / Voz */}
        <button
          onClick={toggleSpeech}
          type="button"
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
            speechEnabled ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-200'
          }`}
          aria-pressed={speechEnabled}
          aria-label="Audiodescrição e Leitor de Voz"
        >
          <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${isSpeaking ? 'animate-pulse' : ''}`} />
          <span>{speechEnabled ? 'Voz On' : 'Voz'}</span>
        </button>
      </div>
    </aside>
  );
};
