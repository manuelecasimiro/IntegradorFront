import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RequestModal } from '../components/volunteers/RequestModal';
import {
  Star,
  CheckCircle,
  Calendar,
  Globe,
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  MessageSquare,
  Award,
} from 'lucide-react';

export const VolunteerProfilePage = () => {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.get(`/volunteers/${id}`)
      .then((res) => {
        setVolunteer(res?.data);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar perfil do voluntário.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-zinc-500">Carregando perfil do voluntário...</div>;
  }

  if (error || !volunteer) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-red-600 font-bold">{error || 'Voluntário não encontrado'}</p>
        <Link to="/volunteers" className="inline-flex items-center gap-2 text-sm text-orange-600 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Voluntários</span>
        </Link>
      </div>
    );
  }

  const profile = volunteer.volunteerProfile || {};
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const reviews = volunteer.reviews_received || [];

  return (
    <div id="conteudo-principal" className="space-y-8 py-8">
      <Link
        to="/volunteers"
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para lista de voluntários</span>
      </Link>

      {/* Header do Perfil */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={
              volunteer.profile_photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(volunteer.name)}&background=ea580c&color=fff&size=200`
            }
            alt={`Foto de ${volunteer.name}`}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-orange-100 dark:border-zinc-800 shadow-md"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50">
                {volunteer.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  profile.availability_status === 'blocked'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : profile.availability_status === 'available'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${profile.availability_status === 'blocked' ? 'bg-red-500' : profile.availability_status === 'available' ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                {profile.availability_status === 'blocked'
                  ? 'Bloqueado por Pendência'
                  : profile.availability_status === 'available'
                  ? 'Disponível para Eventos'
                  : 'Indisponível no Momento'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500">
              <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-extrabold text-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{Number(profile.rating_avg || 5.0).toFixed(1)}</span>
                <span className="text-zinc-400 font-normal">({reviews.length} avaliações)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-orange-600" />
                <span>{profile.completed_services_count || 0} acompanhamentos realizados</span>
              </div>
            </div>

            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-1"
              >
                <Globe className="w-4 h-4" />
                <span>Perfil no LinkedIn</span>
              </a>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={profile.availability_status === 'blocked'}
            type="button"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all focus-visible:ring-2 focus-visible:ring-orange-600 ${
              profile.availability_status === 'blocked'
                ? 'bg-zinc-400 cursor-not-allowed text-white opacity-60'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>{profile.availability_status === 'blocked' ? 'Voluntário Bloqueado' : 'Solicitar Contratação'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biografia, Experiência e Habilidades */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              Apresentação e Motivação
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {profile.biography || 'Voluntário comprometido com a inclusão de pessoas com deficiência.'}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              Experiência em Eventos e Apoio
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {profile.experience || 'Experiência prática adquirida em eventos culturais e apoio solidário.'}
            </p>
          </div>

          {/* Avaliações Públicas Recebidas */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span>Avaliações de Clientes Atendidos ({reviews.length})</span>
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.client?.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.client?.name || 'Cliente')}&background=ea580c&color=fff`}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {rev.client?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 py-3">Este voluntário ainda não possui avaliações públicas.</p>
            )}
          </div>
        </div>

        {/* Sidebar: Habilidades e Segurança */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Habilidades Verificadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Voluntariado Seguro</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Todos os acompanhamentos ocorrem exclusivamente em locais públicos e nos horários combinados via chat oficial.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RequestModal
        volunteer={volunteer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
