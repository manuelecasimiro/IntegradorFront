import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { EventCard } from '../components/events/EventCard';
import { EventCarousel } from '../components/events/EventCarousel';
import { VolunteerCard } from '../components/volunteers/VolunteerCard';
import { RequestModal } from '../components/volunteers/RequestModal';
import {
  Accessibility,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  Users,
  ArrowRight,
  UserCheck,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  HelpCircle,
  Ticket,
} from 'lucide-react';

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/events'),
      api.get('/volunteers'),
    ])
      .then(([eventsRes, volRes]) => {
        setEvents(eventsRes?.data?.data?.slice(0, 3) || []);
        setVolunteers(volRes?.data?.data?.slice(0, 3) || []);
      })
      .catch((err) => console.error('Erro ao carregar dados da Home:', err));
  }, []);

  const handleRequestClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: 'Como funciona a solicitação de um voluntário para um evento?',
      a: 'Basta escolher o evento desejado, navegar pela lista de voluntários capacitados que possuem disponibilidade para a data e clicar em "Solicitar Contratação". Após o envio, o voluntário avalia o pedido e, ao aceitar, um chat privativo e seguro é liberado para combinarem o ponto de encontro.',
    },
    {
      q: 'O serviço de acompanhamento tem algum custo para a pessoa com deficiência?',
      a: 'Não. O Inova Acesso baseia-se na Lei do Voluntariado Solidário (Lei nº 9.608/1998). Os voluntários doam suas habilidades e tempo para proporcionar acessibilidade, inclusão e acolhimento em eventos.',
    },
    {
      q: 'Como é garantida a segurança e confiabilidade dos voluntários?',
      a: 'Todos os voluntários passam por verificação cadastral de dados, histórico de habilidades (Libras, audiodescrição, mobilidade física), termos de responsabilidade e avaliações públicas após cada evento concluído.',
    },
    {
      q: 'O que acontece caso o voluntário não compareça ao evento?',
      a: 'A plataforma possui um sistema rigoroso de confirmação de comparecimento. Caso o voluntário não compareça sem justificativa prévia comprovada, seu cadastro é automaticamente bloqueado para novas contratações gerando pendência com a administração da plataforma.',
    },
    {
      q: 'Como funciona a vinculação de ingressos para o evento?',
      a: 'Após a contratação ser aceita, a plataforma gera um Código Identificador Único de Ingresso Vinculado (INOVA-TKT), que conecta o ingresso PCD ao ingresso do voluntário acompanhante conforme as regras do produtor do evento e a Lei 12.933/2013.',
    },
  ];

  return (
    <div id="conteudo-principal" className="space-y-16 py-8 sm:py-12">
      {/* 1. HERO SECTION OFICIAL (Seção 19: Incluir é Inovar) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white p-8 sm:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white">
            <Accessibility className="w-4 h-4" />
            <span>Slogan Oficial: Incluir é Inovar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Incluir é Inovar.
          </h1>

          <p className="text-base sm:text-lg text-orange-100 font-medium leading-relaxed max-w-2xl">
            Conectando pessoas com deficiência a voluntários capacitados para uma experiência mais acessível, segura e acolhedora em shows, festivais e eventos.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/volunteers"
              className="px-6 py-3.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-black text-sm shadow-md transition-all inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Encontrar um voluntário</span>
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-orange-950/40 hover:bg-orange-950/60 text-white font-black text-sm border border-white/20 backdrop-blur-sm transition-all inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-orange-300" />
              <span>Quero ser voluntário</span>
            </Link>
          </div>
        </div>

        {/* Efeito decorativo de fundo */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </section>

      {/* 2. COMO FUNCIONA? (Seção 19: Os 4 Passos) */}
      <section aria-labelledby="como-funciona-titulo" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 id="como-funciona-titulo" className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50">
            Como funciona a plataforma?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Processo ágil, humanizado e seguro para garantir que ninguém fique de fora da cultura.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Cadastre-se
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Crie seu perfil informando suas necessidades de acessibilidade ou suas habilidades como voluntário solidário.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Escolha o evento
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Descubra shows, espetáculos teatrais e festivais com auditoria completa de recursos de acessibilidade física e digital.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Encontre um voluntário
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Consulte voluntários disponíveis para a data, veja avaliações de outros clientes e envie a solicitação de contratação.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 relative">
            <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              Tenha acompanhamento
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Combine ponto de encontro no chat seguro e aproveite o evento com total autonomia, acolhimento e suporte.
            </p>
          </div>
        </div>
      </section>

      {/* 3. EVENTOS COM RECURSOS ACESSÍVEIS (Carrossel no Mobile) */}
      <section aria-labelledby="eventos-destaque" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 id="eventos-destaque" className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50">
              Eventos com Recursos Acessíveis
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Espetáculos, festivais e feiras com estrutura para receber você.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            <span>Ver todos os eventos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {events.length > 0 ? (
          <>
            {/* Mobile: Carrossel com Swipe */}
            <div className="block md:hidden">
              <EventCarousel events={events} autoPlayInterval={5000} />
            </div>
            {/* Desktop: Grid Responsivo */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            Carregando eventos acessíveis...
          </div>
        )}
      </section>

      {/* 4. DUAS COLUNAS: PARA CLIENTES & PARA VOLUNTÁRIOS (Seção 19) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Para Clientes */}
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50">
            Para Clientes com Deficiência
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tenha autonomia e tranquilidade para curtir seus artistas favoritos. Com o Inova Acesso você:
          </p>
          <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-black">✓</span>
              <span>Visualiza antecipadamente banheiros adaptados, rampas, pisos táteis e intérpretes de Libras.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-black">✓</span>
              <span>Escolhe voluntários treinados e com histórico positivo avaliado por outros clientes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-black">✓</span>
              <span>Conversa pelo chat interno e gera código de ingresso vinculado para o seu acompanhante.</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              to="/volunteers"
              className="inline-flex items-center gap-2 text-xs font-black text-orange-600 hover:text-orange-700"
            >
              <span>Buscar voluntários disponíveis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Para Voluntários */}
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50">
            Para Voluntários Solidários
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Coloque suas habilidades a serviço da inclusão social e viva momentos inesquecíveis:
          </p>
          <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-black">✓</span>
              <span>Informe em quais eventos você tem disponibilidade com apenas um clique.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-black">✓</span>
              <span>Destaque suas competências em Libras, guia vidente, suporte a cadeirantes ou acolhimento neurodivergente.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-black">✓</span>
              <span>Receba certificados de horas complementares e construa uma reputação solidária de impacto real.</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs font-black text-orange-600 hover:text-orange-700"
            >
              <span>Cadastrar-se como voluntário</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. VOLUNTÁRIOS SOLIDÁRIOS EM DESTAQUE */}
      <section aria-labelledby="voluntarios-destaque" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 id="voluntarios-destaque" className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50">
              Rede de Voluntários Capacitados
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Pessoas prontas para apoiar você em shows e festivais.
            </p>
          </div>
          <Link
            to="/volunteers"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            <span>Ver todos os voluntários</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {volunteers.map((vol) => (
            <VolunteerCard
              key={vol.id}
              volunteer={vol}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>
      </section>

      {/* 6. PERGUNTAS FREQUENTES (FAQ) (Seção 19) */}
      <section aria-labelledby="faq-titulo" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>Tire suas dúvidas</span>
          </div>
          <h2 id="faq-titulo" className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50">
            Perguntas Frequentes
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tudo o que você precisa saber sobre o Inova Acesso.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm text-zinc-900 dark:text-zinc-100 hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                aria-expanded={openFaq === idx}
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform ${openFaq === idx ? 'rotate-180 text-orange-600' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. ÁREA VISUAL COM BOTÃO EMERGÊNCIA (Seção 13) */}
      <section className="rounded-3xl border-2 border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Área de Apoio & Segurança</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px]">Em breve</span>
          </div>
          <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-50">
            Canal de Emergência Integrado
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
            Em eventos presenciais, a plataforma contará com acionamento emergencial rápido e compartilhamento voluntário de localização. Lembramos que em casos graves, acione sempre os canais oficiais: SAMU (192) e Polícia Militar (190).
          </p>
        </div>

        <button
          type="button"
          disabled
          className="px-6 py-3.5 rounded-2xl bg-red-600/90 text-white font-black text-sm shadow-md cursor-not-allowed opacity-80 flex items-center gap-2 flex-shrink-0"
          title="Funcionalidade em fase de homologação com organizadores"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>EMERGÊNCIA (Em breve)</span>
        </button>
      </section>

      <RequestModal
        volunteer={selectedVolunteer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
