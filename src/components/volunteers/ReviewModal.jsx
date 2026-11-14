import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Star, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ReviewModal = ({ request, isOpen, onClose, onReviewSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/reviews', {
        request_id: request.id,
        rating,
        comment: comment.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onReviewSuccess) onReviewSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Erro ao registrar avaliação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-8 max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="review-titulo" className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-1">
          Avaliar Acompanhamento
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          Como foi sua experiência com o voluntário <strong>{request.volunteer?.name}</strong> no evento <strong>{request.event?.name}</strong>?
        </p>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Avaliação Registrada!
            </h3>
            <p className="text-xs text-zinc-500">
              Obrigado por ajudar a fortalecer nossa rede inclusiva.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Estrelas */}
            <div className="text-center py-2">
              <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
                Sua Nota de 1 a 5 Estrelas
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg transition-transform hover:scale-110"
                    aria-label={`${star} estrelas`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-zinc-300 dark:text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-orange-600 mt-1 block">
                {rating === 5 ? 'Excelente!' : rating === 4 ? 'Muito Bom' : rating === 3 ? 'Bom' : rating === 2 ? 'Regular' : 'Ruim'}
              </span>
            </div>

            {/* Comentário */}
            <div>
              <label htmlFor="review-comment" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Comentário ou Elogio (Opcional)
              </label>
              <textarea
                id="review-comment"
                rows="3"
                placeholder="Conte como foi o apoio recebido..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
