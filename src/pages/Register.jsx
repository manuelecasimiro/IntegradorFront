import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  HeartHandshake,
  Accessibility,
  AlertCircle,
  Globe,
  ShieldCheck,
  Shield,
  KeyRound,
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(() => searchParams.get('role') || 'client'); // 'client' | 'volunteer' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Client specific
  const [accessibilityNeeds, setAccessibilityNeeds] = useState('');
  const [bio, setBio] = useState('');

  // Volunteer specific
  const [experience, setExperience] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const skillOptions = [
    'Libras',
    'Mobilidade e Acompanhamento',
    'Guia Vidente',
    'Acolhimento',
    'Orientação',
    'Audiodescrição de Apoio',
    'Comunicação Inclusiva',
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'volunteer' && !acceptTerms) {
      setError('É necessário aceitar os termos da Lei de Voluntariado para prosseguir.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name,
      email,
      password,
      role,
      admin_code: role === 'admin' ? adminCode : undefined,
      cpf: cpf || undefined,
      phone: phone || undefined,
      birth_date: birthDate || undefined,
      accessibility_needs: role === 'client' ? accessibilityNeeds : undefined,
      bio: role === 'client' ? bio : undefined,
      experience: role === 'volunteer' ? experience : undefined,
      linkedin_url: role === 'volunteer' ? linkedinUrl || undefined : undefined,
      skills: role === 'volunteer' ? selectedSkills : undefined,
    };

    try {
      await register(payload);
      navigate('/');
    } catch (err) {
      if (err.errors) {
        const firstErrorKey = Object.keys(err.errors)[0];
        setError(err.errors[firstErrorKey][0]);
      } else {
        setError(err.message || 'Erro ao realizar cadastro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="conteudo-principal" className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" />
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50 pt-2">
            Crie sua conta no Inova Acess
          </h1>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Faça parte da maior rede de entretenimento acessível e apoio solidário para eventos.
          </p>
        </div>

        {/* Seleção do Perfil (Cliente PCD vs Voluntário vs Admin - Seção 4) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              role === 'client'
                ? 'bg-white dark:bg-zinc-900 text-orange-700 dark:text-orange-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Accessibility className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Cliente (PCD)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              role === 'volunteer'
                ? 'bg-white dark:bg-zinc-900 text-orange-700 dark:text-orange-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Voluntário</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              role === 'admin'
                ? 'bg-white dark:bg-zinc-900 text-purple-700 dark:text-purple-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Admin</span>
          </button>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Validação de Código Exclusivo para Admin (Seção 4) */}
            {role === 'admin' && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-800 dark:text-purple-300">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>Código de Autorização Governamental</span>
                </div>
                <label htmlFor="reg-admin-code" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Código de Autorização do Administrador *
                </label>
                <input
                  id="reg-admin-code"
                  type="password"
                  required
                  placeholder="Digite o código configurado pelos criadores..."
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-zinc-800 text-sm font-mono text-zinc-950 dark:text-zinc-100"
                />
                <p className="text-[11px] text-zinc-500">
                  A conclusão do cadastro de administrador exige validação exclusiva no servidor, sem exposição no frontend (Seção 4).
                </p>
              </div>
            )}
            {/* Nome Completo */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                />
              </div>
            </div>

            {/* Email e Senha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Senha (mínimo 6) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                  />
                </div>
              </div>
            </div>

            {/* CPF e Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-cpf" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  CPF
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-phone"
                    type="text"
                    placeholder="(XX) 90000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                  />
                </div>
              </div>
            </div>

            {/* Campos Específicos de Cliente */}
            {role === 'client' && (
              <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label htmlFor="reg-needs" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Necessidades de Acessibilidade
                  </label>
                  <textarea
                    id="reg-needs"
                    rows="2"
                    placeholder="Ex: Sou cadeirante e necessito de suporte para rampas íngremes; ou: pessoa com deficiência auditiva buscando apoio em Libras..."
                    value={accessibilityNeeds}
                    onChange={(e) => setAccessibilityNeeds(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                  />
                </div>
              </div>
            )}

            {/* Campos Específicos de Voluntário */}
            {role === 'volunteer' && (
              <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label htmlFor="reg-exp" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Experiência ou Motivação no Voluntariado *
                  </label>
                  <textarea
                    id="reg-exp"
                    rows="2"
                    required
                    placeholder="Conte sobre sua vivência com acessibilidade ou seu desejo de ser voluntário em eventos..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                  />
                </div>

                <div>
                  <label htmlFor="reg-linkedin" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Perfil no LinkedIn (Opcional)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      id="reg-linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/seu-perfil"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-orange-600"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                    Competências / Habilidades que você domina:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {skillOptions.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer font-medium ${
                          selectedSkills.includes(skill)
                            ? 'bg-orange-50 border-orange-500 text-orange-900'
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => toggleSkill(skill)}
                          className="w-3.5 h-3.5 text-orange-600 rounded"
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Termo de Adesão ao Serviço Voluntário */}
                <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-orange-900 dark:text-orange-200">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Termo de Voluntariado Solidário</span>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer text-zinc-600 dark:text-zinc-300 text-[11px] leading-tight">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-orange-600 rounded"
                    />
                    <span>
                      Declaro que atuo voluntariamente, nos termos da Lei Federal nº 9.608/1998, sem qualquer vínculo empregatício ou remuneração, motivado pelo apoio social e inclusão de pessoas com deficiência em eventos.
                    </span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-sm text-white shadow-md transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-500">
          Já tem uma conta cadastrada?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
};
