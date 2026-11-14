import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { User, Phone, Mail, CheckCircle2, AlertCircle, Save, ShieldAlert, Globe, Calendar } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, isVolunteer, isClient } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [instagram, setInstagram] = useState(user?.volunteerProfile?.instagram_url || '');
  const [bio, setBio] = useState(user?.profile?.bio || user?.volunteerProfile?.biography || '');
  const [needs, setNeeds] = useState(user?.profile?.accessibility_needs || '');
  const [availabilityStatus, setAvailabilityStatus] = useState(user?.volunteerProfile?.availability_status || 'available');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isBlocked = user?.volunteerProfile?.availability_status === 'blocked';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({
        name,
        phone,
        bio,
        biography: bio,
        accessibility_needs: needs,
        instagram_url: instagram,
        availability_status: isVolunteer && !isBlocked ? availabilityStatus : undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="conteudo-principal" className="max-w-2xl mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-zinc-950 dark:text-zinc-50">
          Meu Perfil
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Gerencie suas informações cadastrais, canais de contato e preferências de acessibilidade.
        </p>
      </div>

      {/* Alerta de Voluntário Bloqueado por Pendência (Seção 6 e 12) */}
      {isBlocked && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-black text-sm">Status Atual: Bloqueado por Pendência</strong>
            <p>
              Seu perfil possui uma pendência decorrente de ausência relatada em evento anterior ({user?.volunteerProfile?.pendencies_notes || 'Ausência reportada'}). Você não poderá aceitar novas contratações até que a pendência seja analisada e regularizada pela governança da plataforma.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <img
            src={
              user?.profile_photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=ea580c&color=fff&size=150`
            }
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400"
          />
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-orange-600 font-bold uppercase">
                {user?.role === 'volunteer' ? 'Voluntário Solidário' : user?.role === 'client' ? 'Cliente PCD' : 'Administrador'}
              </span>
              {isVolunteer && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                    isBlocked
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : availabilityStatus === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}
                >
                  {isBlocked ? 'Bloqueado' : availabilityStatus === 'available' ? 'Disponível' : 'Indisponível'}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prof-name" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Nome Completo
            </label>
            <input
              id="prof-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-email" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                E-mail (Cadastro)
              </label>
              <input
                id="prof-email"
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="prof-phone" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Telefone / WhatsApp
              </label>
              <input
                id="prof-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-cpf" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                CPF (Protegido por LGPD)
              </label>
              <input
                id="prof-cpf"
                type="text"
                disabled
                value={user?.cpf || 'Cadastrado'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="prof-instagram" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Instagram (Opcional)
              </label>
              <input
                id="prof-instagram"
                type="text"
                placeholder="@seu.perfil"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>
          </div>

          {isVolunteer && (
            <div>
              <label htmlFor="prof-status" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Status de Disponibilidade Geral
              </label>
              <select
                id="prof-status"
                disabled={isBlocked}
                value={isBlocked ? 'blocked' : availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 font-semibold focus-visible:ring-2 focus-visible:ring-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isBlocked ? (
                  <option value="blocked">🔴 Bloqueado por Pendência Administrativa</option>
                ) : (
                  <>
                    <option value="available">🟢 Disponível para Novos Acompanhamentos</option>
                    <option value="unavailable">⚪ Indisponível no Momento</option>
                  </>
                )}
              </select>
            </div>
          )}

          {isClient && (
            <div>
              <label htmlFor="prof-needs" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Deficiência & Necessidades de Acessibilidade
              </label>
              <textarea
                id="prof-needs"
                rows="3"
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                placeholder="Descreva necessidades específicas (ex: cadeirante, baixa visão, intérprete de Libras, sensibilidade auditiva)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
              />
            </div>
          )}

          <div>
            <label htmlFor="prof-bio" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Apresentação Pessoal / Preferências
            </label>
            <textarea
              id="prof-bio"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all focus-visible:ring-2 focus-visible:ring-orange-600"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
