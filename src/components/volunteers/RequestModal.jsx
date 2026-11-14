import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { X, Calendar, MapPin, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestModal = ({ volunteer, isOpen, onClose }) => {
  const { user, isAuthenticated, isClient } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [message, setMessage] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      setMessage('');
      setMeetingPoint('');
      setMeetingTime('');

      // Load available published events
      api.get('/events')
        .then((res) => {
          const list = res?.data?.data || [];
          setEvents(list);
          if (list.length > 0) {
            setSelectedEventId(list[0].id.toString());
          }
        })
        .catch((err) => {
          setError('Erro ao carregar lista de eventos.');
        });
    }
  }, [isOpen]);

  if (!isOpen || !volunteer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isClient) {
      setError('Apenas clientes cadastrados como PCD podem solicitar acompanhamento de voluntários.');
      return;
    }

    if (!selectedEventId) {
      setError('Por favor, selecione um evento.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/volunteer-requests', {
        volunteer_id: volunteer.id,
        event_id: Number(selectedEventId),
        message: message.trim() || undefined,
        meeting_point: meetingPoint.trim() || undefined,
        meeting_time: meetingTime || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/requests');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Erro ao enviar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-8 overflow-y-auto max-h-[92dvh]">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="modal-titulo" className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-1">
          Solicitar Acompanhamento Solidário
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          Você está solicitando o apoio voluntário de <strong>{volunteer.name}</strong>.
        </p>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Solicitação Enviada!
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              O voluntário foi notificado. Redirecionando para suas solicitações...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Evento */}
            <div>
              <label htmlFor="select-evento" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Selecione o Evento *
              </label>
              <select
                id="select-evento"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-medium focus-visible:ring-2 focus-visible:ring-orange-600"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} — {evt.city}/{evt.state} ({evt.event_date})
                  </option>
                ))}
              </select>
            </div>

            {/* Ponto de Encontro */}
            <div>
              <label htmlFor="input-ponto" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Ponto de Encontro Sugerido
              </label>
              <input
                id="input-ponto"
                type="text"
                placeholder="Ex: Tenda da Acessibilidade, Portão A, Foyer..."
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>

            {/* Horário de Encontro */}
            <div>
              <label htmlFor="input-horario" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Horário Previsto para Encontro
              </label>
              <input
                id="input-horario"
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>

            {/* Mensagem Inicial */}
            <div>
              <label htmlFor="textarea-msg" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Mensagem para o Voluntário
              </label>
              <textarea
                id="textarea-msg"
                rows="3"
                placeholder="Conte brevemente sobre suas necessidades de apoio (ex: locomoção, Libras, descrição de palco)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Ao enviar, o voluntário poderá aceitar ou recusar. O chat para combinação de detalhes será liberado assim que o voluntário confirmar.
            </p>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-orange-600"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Enviando...' : 'Enviar Solicitação'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
