import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('inova_a11y_contrast') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('inova_a11y_font') || 'md';
  });

  const [vlibrasEnabled, setVlibrasEnabled] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. Controle de Alto Contraste
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('inova_a11y_contrast', highContrast);
  }, [highContrast]);

  // 2. Controle de Escala de Fonte
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
    root.classList.add(`font-scale-${fontSize}`);
    localStorage.setItem('inova_a11y_font', fontSize);
  }, [fontSize]);

  const toggleContrast = () => setHighContrast(prev => !prev);

  const increaseFont = () => {
    const scales = ['sm', 'md', 'lg', 'xl'];
    const currentIndex = scales.indexOf(fontSize);
    if (currentIndex < scales.length - 1) {
      setFontSize(scales[currentIndex + 1]);
    }
  };

  const decreaseFont = () => {
    const scales = ['sm', 'md', 'lg', 'xl'];
    const currentIndex = scales.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(scales[currentIndex - 1]);
    }
  };

  const resetFont = () => setFontSize('md');

  // 3. Mecanismo de Síntese de Voz e Audiodescrição
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakText = useCallback((text, onComplete) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; // Velocidade natural
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // 4. Ativar / Desativar Audiodescrição Interativa
  const toggleSpeech = () => {
    if (speechEnabled) {
      stopSpeaking();
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(true);
      speakText('Audiodescrição e leitor de tela ativados. Passe o mouse ou navegue com o teclado para ouvir os conteúdos.');
    }
  };

  // 5. Integração com o VLibras
  const triggerVLibras = () => {
    setVlibrasEnabled(prev => !prev);
    // Simula o clique no botão do widget oficial do VLibras
    const vlibrasBtn = document.querySelector('[vw-access-button]');
    if (vlibrasBtn) {
      vlibrasBtn.click();
    }
  };

  // 6. Ouvintes Globais para Audiodescrição e Leitura Interativa quando ativado
  useEffect(() => {
    if (!speechEnabled) return;

    let timeoutId = null;

    const handleFocusOrHover = (e) => {
      const el = e.target.closest('button, a, h1, h2, h3, h4, p, img, input, textarea, select, [role="button"], [data-audiodescricao]');
      if (!el || el.closest('aside[aria-label*="acessibilidade"]')) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        let text = '';
        if (el.tagName === 'IMG') {
          const desc = el.getAttribute('data-audiodescricao') || el.alt || 'Imagem do evento';
          text = `Audiodescrição: ${desc}`;
        } else if (el.tagName === 'A') {
          const label = el.getAttribute('aria-label') || el.innerText || el.title || 'link';
          text = `Link: ${label}`;
        } else if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
          const label = el.getAttribute('aria-label') || el.innerText || el.title || 'botão';
          text = `Botão: ${label}`;
        } else if (['H1', 'H2', 'H3', 'H4'].includes(el.tagName)) {
          text = `Título: ${el.innerText}`;
        } else if (el.tagName === 'P' && el.innerText?.trim()) {
          text = el.innerText.trim();
        }

        if (text) {
          speakText(text);
        }
      }, 350);
    };

    const handleSelection = () => {
      const selected = window.getSelection()?.toString()?.trim();
      if (selected && selected.length > 1) {
        speakText(selected);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopSpeaking();
      }
    };

    document.addEventListener('mouseover', handleFocusOrHover);
    document.addEventListener('focusin', handleFocusOrHover);
    document.addEventListener('mouseup', handleSelection);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseover', handleFocusOrHover);
      document.removeEventListener('focusin', handleFocusOrHover);
      document.removeEventListener('mouseup', handleSelection);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [speechEnabled, speakText, stopSpeaking]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleContrast,
        fontSize,
        increaseFont,
        decreaseFont,
        resetFont,
        vlibrasEnabled,
        triggerVLibras,
        speechEnabled,
        toggleSpeech,
        isSpeaking,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser utilizado dentro de AccessibilityProvider');
  }
  return context;
};
