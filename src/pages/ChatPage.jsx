import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, CheckCheck, Clock, MapPin, AlertCircle, Shield } from 'lucide-react';

export const ChatPage = () => {
  const { id } = useParams(); // request_id
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requestData, setRequestData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const res = await api.get(`/requests/${id}/messages`);
      setRequestData(res?.data?.request);
      setMessages(res?.data?.messages || []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar mensagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // Polling interval to check for new messages every 4 seconds
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await api.post(`/requests/${id}/messages`, {
        message: messageText,
      });
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      alert('Erro ao enviar mensagem: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-sm text-zinc-500">Abrindo sala de conversa segura...</div>;
  }

  if (error || !requestData) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-red-600 font-bold">{error || 'Chat indisponível'}</p>
        <Link to="/requests" className="inline-flex items-center gap-2 text-sm text-orange-600 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Solicitações</span>
        </Link>
      </div>
    );
  }

  const isVolunteer = user?.role === 'volunteer';
  const otherParty = isVolunteer ? requestData.client : requestData.volunteer;

  return (
    <div id="conteudo-principal" className="max-w-4xl mx-auto py-6 space-y-4">
      {/* Barra Superior do Chat */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/requests"
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 focus-visible:ring-2 focus-visible:ring-orange-600"
            aria-label="Voltar para Minhas Solicitações"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <img
            src={
              otherParty?.profile_photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParty?.name || 'Usuário')}&background=ea580c&color=fff`
            }
            alt=""
            className="w-11 h-11 rounded-xl object-cover border border-orange-200"
          />

          <div>
            <h1 className="text-base font-black text-zinc-950 dark:text-zinc-50">
              {otherParty?.name}
            </h1>
            <span className="text-xs text-orange-600 font-bold block">
              Evento: {requestData.event?.name}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Canal de Apoio Confirmado</span>
        </div>
      </div>

      {/* Caixa de Mensagens */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-[calc(100dvh-200px)] sm:h-[600px] min-h-[460px] overflow-hidden">
        {/* Banner de Lembrete do Encontro */}
        <div className="chat-meeting-banner p-3 bg-orange-50/70 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/40 text-xs text-orange-900 dark:text-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span className="truncate">
              <strong>Ponto de encontro:</strong> {requestData.meeting_point || 'Combinar aqui pelo chat'}
            </span>
          </div>
          {requestData.meeting_time && (
            <span className="font-bold sm:self-auto self-end">Horário: {requestData.meeting_time.substring(0, 5)}h</span>
          )}
        </div>

        {/* Histórico com Scroll */}
        <div
          role="log"
          aria-label="Histórico de mensagens"
          tabIndex={0}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-2">
              <p className="text-sm font-semibold">Nenhuma mensagem ainda.</p>
              <p className="text-xs max-w-xs">
                Inicie a conversa para combinar os detalhes de acolhimento e o ponto exato de encontro no evento.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const time = new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={
                        msg.sender?.profile_photo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.name || 'U')}&background=ea580c&color=fff`
                      }
                      alt=""
                      className="w-7 h-7 rounded-full object-cover mb-1"
                    />
                  )}

                  <div
                    className={`chat-bubble max-w-[75%] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                      isMe
                        ? 'chat-bubble-me bg-orange-600 text-white rounded-br-none'
                        : 'chat-bubble-other bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                    }`}
                  >
                    {!isMe && (
                      <span className="chat-sender-name block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-0.5">
                        {msg.sender?.name}
                      </span>
                    )}
                    <p className="chat-message-text leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div
                      className={`chat-message-meta flex items-center justify-end gap-1 text-[10px] mt-1 font-medium ${
                        isMe ? 'text-orange-200' : 'text-zinc-400'
                      }`}
                    >
                      <time>{time}</time>
                      {isMe && (
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${msg.read_at ? 'text-white' : 'text-orange-300'}`}
                          title={msg.read_at ? 'Lida' : 'Entregue'}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Envio de Mensagem */}
        <form onSubmit={handleSendMessage} className="p-2.5 sm:p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <label htmlFor="input-chat-msg" className="sr-only">
            Digite sua mensagem para {otherParty?.name}
          </label>
          <input
            id="input-chat-msg"
            type="text"
            placeholder={`Escreva sua mensagem para ${otherParty?.name?.split(' ')[0]}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            className="flex-1 px-4 py-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base sm:text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-md disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-orange-600 min-w-[46px] min-h-[46px] flex items-center justify-center flex-shrink-0"
            aria-label="Enviar mensagem"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
