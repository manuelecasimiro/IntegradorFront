import React, { useState, useEffect, useRef } from 'react';
import { EventCard } from './EventCard';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const EventCarousel = ({ events = [], autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timerRef = useRef(null);

  const total = events.length;

  // Auto-play timer
  useEffect(() => {
    if (total <= 1 || !isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPlaying, autoPlayInterval, currentIndex]);

  if (!events || events.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Suporte a swipe de toque (Touch gestures no mobile)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentEvent = events[currentIndex];

  return (
    <div
      className="relative w-full space-y-4"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carrossel de eventos acessíveis"
      aria-label="Eventos em destaque com recursos de acessibilidade"
    >
      {/* Contêiner do Card Ativo */}
      <div className="relative overflow-hidden rounded-2xl max-w-2xl mx-auto shadow-sm">
        <div className="transition-all duration-300 transform">
          <EventCard event={currentEvent} />
        </div>

        {/* Botão Anterior */}
        <button
          onClick={handlePrev}
          type="button"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-orange-500 z-10 active:scale-95"
          aria-label="Ver evento anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Botão Próximo */}
        <button
          onClick={handleNext}
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-orange-500 z-10 active:scale-95"
          aria-label="Ver próximo evento"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Controles de Navegação: Indicadores e Play/Pause */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {/* Play/Pause para acessibilidade WCAG 2.2.2 */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          type="button"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label={isPlaying ? 'Pausar rotação automática' : 'Iniciar rotação automática'}
          title={isPlaying ? 'Pausar carrossel' : 'Iniciar rotação'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Indicadores de Slide (Dots) */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Slides do carrossel">
          {events.map((evt, idx) => (
            <button
              key={evt.id}
              onClick={() => handleDotClick(idx)}
              type="button"
              role="tab"
              aria-selected={currentIndex === idx}
              aria-label={`Ir para evento ${idx + 1}: ${evt.name}`}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-500 ${
                currentIndex === idx
                  ? 'w-8 bg-orange-600'
                  : 'w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 min-w-[45px] text-right">
          {currentIndex + 1} de {total}
        </span>
      </div>
    </div>
  );
};
