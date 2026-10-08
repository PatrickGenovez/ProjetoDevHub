import Head from 'next/head';
import { useState, useEffect } from 'react';
import {
  Layers,
  Server,
  Zap,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  FolderGit2,
  Cpu,
  ShieldCheck,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Activity,
  ArrowUpRight,
  PackageCheck,
  Boxes,
  FileCode
} from 'lucide-react';
import ThemeToggle from '../components/menu/ThemeToggle';
import styles from '../styles/index.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('structure');
  const [copiedCommand, setCopiedCommand] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [counter, setCounter] = useState(0);

  // Verifica conectividade com o backend ao carregar
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(apiUrl, { method: 'GET' });
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (err) {
        setApiStatus('offline');
      }
    };

    checkBackend();
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(key);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const stackFrontend = [
    { name: 'Next.js 15', desc: 'Framework React com suporte a SSR, SSG e rotas de API.', icon: Code2 },
    { name: 'React 19', desc: 'Versão mais recente com suporte a Hooks e renderização rápida.', icon: Cpu },
    { name: 'Lucide Icons', desc: 'Conjunto de ícones leves, consistentes e modernos.', icon: Sparkles },
    { name: 'CSS Tokens & Temas', desc: 'Suporte completo a Dark Mode e Light Mode nativo.', icon: Zap },
    { name: 'Axios & Fetch', desc: 'Comunicação HTTP pré-configurada para o backend.', icon: Activity },
    { name: 'Rich UI Suite', desc: 'Recharts, Chart.js, TipTap, DnD-Kit e React-Toastify inclusos.', icon: Boxes }
  ];

  const stackBackend = [
    { name: 'Express.js', desc: 'Servidor Node.js modular, rápido e estruturado em rotas.', icon: Server },
    { name: 'Autenticação JWT', desc: 'Fluxos de login, cadastro e recuperação de senha já prontos.', icon: ShieldCheck },
    { name: 'Bcryptjs', desc: 'Criptografia segura de senhas integrada com salt rounds.', icon: ShieldCheck },
    { name: 'MySQL2 & PG', desc: 'Pool de conexões para bancos relacionais configurado.', icon: Database },
    { name: 'Cloudinary', desc: 'Upload e gestão de arquivos em nuvem preparado.', icon: PackageCheck },
    { name: 'Docker & Compose', desc: 'Containers prontos para ambiente de dev e produção.', icon: Terminal }
  ];

  const folderStructure = [
    {
      dir: 'frontend/',
      desc: 'Aplicação web Next.js',
      items: [
        'pages/ (Páginas e rotas da aplicação)',
        'components/ (Componentes reutilizáveis e menu/temas)',
        'styles/ (globals.css com tokens de tema e módulos CSS)',
        'utils/ (Hooks como useAuth e clientes utilitários)',
        'public/ (Imagens, ícones SVG e arquivos estáticos)',
        'Dockerfile & docker-compose.yml (Configuração de contêineres)'
      ]
    },
    {
      dir: 'backend/',
      desc: 'API REST Node.js Express',
      items: [
        'src/server.js (Inicialização do servidor e middlewares CORS/JSON)',
        'src/routes/ (Rotas modulares: auth.js, index.js)',
        'src/middlewares/ (Middleware de proteção por token JWT)',
        'src/config/ (Configuração de pool MySQL e Cloudinary)',
        '.env (Configuração de banco, porta e segredo JWT)',
        'vercel.json (Deploy serverless compatível)'
      ]
    }
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/auth/register', desc: 'Cadastro de novo usuário com hash de senha', body: '{ email, password, full_name }' },
    { method: 'POST', path: '/auth/login', desc: 'Autenticação e geração de token JWT', body: '{ email, password }' },
    { method: 'POST', path: '/auth/reset-password', desc: 'Redefinição segura de senha de usuário', body: '{ email, newPassword, confirmPassword }' },
    { method: 'GET', path: '/', desc: 'Healthcheck da API (retorna confirmação de funcionamento)', body: 'Nenhum' }
  ];

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Modelo Base • Boilerplate Fullstack</title>
        <meta
          name="description"
          content="Projeto base fullstack moderno configurado com Next.js, Node.js Express, Autenticação JWT, Dark Mode e Docker."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Top Navigation */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logoGroup}>
              <div className={styles.logoBadge}>
                <Layers size={22} className={styles.logoIcon} />
              </div>
              <div className={styles.logoTitleBlock}>
                <span className={styles.logoTitle}>MODELO BASE</span>
                <span className={styles.logoSubtitle}>Boilerplate Fullstack</span>
              </div>
            </div>

            <nav className={styles.navMenu}>
              <a href="#overview" className={styles.navLink}>Visão Geral</a>
              <a href="#stack" className={styles.navLink}>Stack & Recursos</a>
              <a href="#arquitetura" className={styles.navLink}>Arquitetura</a>
              <a href="#quickstart" className={styles.navLink}>Começar</a>
            </nav>

            <div className={styles.headerActions}>
              <div className={styles.themeToggleWrapper}>
                <ThemeToggle />
              </div>
              <a
                href="#quickstart"
                className={styles.ctaButtonHeader}
                id="header-start-btn"
              >
                <span>Usar Modelo</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="overview" className={styles.heroSection}>
          <div className={styles.heroGlow}></div>
          <div className={styles.container}>
            <div className={styles.heroBadge}>
              <span className={styles.pulseDot}></span>
              <span>Estrutura Base Pronta para o Seu Projeto</span>
            </div>

            <h1 className={styles.heroTitle}>
              Base sólida para criar seu{' '}
              <span className={styles.gradientText}>novo projeto fullstack</span>
            </h1>

            <p className={styles.heroDescription}>
              Todas as configurações essenciais, arquitetura limpa, dependências prontas, autenticação JWT, sistema de temas (Light & Dark) e Docker configurados para você começar a programar imediatamente.
            </p>

            {/* Quick Action Chips */}
            <div className={styles.heroActions}>
              <a href="#quickstart" className={styles.btnPrimary} id="hero-quickstart-btn">
                <span>Instruções de Inicialização</span>
                <ArrowUpRight size={18} />
              </a>
              <a href="#arquitetura" className={styles.btnSecondary} id="hero-architecture-btn">
                <span>Explorar Arquitetura</span>
                <FolderGit2 size={18} />
              </a>
            </div>

            {/* System Status Banner */}
            <div className={styles.statusCard}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Backend Status</span>
                <div className={styles.statusValue}>
                  <span
                    className={`${styles.indicatorDot} ${
                      apiStatus === 'online'
                        ? styles.dotOnline
                        : apiStatus === 'offline'
                        ? styles.dotOffline
                        : styles.dotChecking
                    }`}
                  ></span>
                  <span>
                    {apiStatus === 'online'
                      ? 'Online (Porta 5000)'
                      : apiStatus === 'offline'
                      ? 'Aguardando inicialização (npm run dev no backend)'
                      : 'Verificando conexão...'}
                  </span>
                </div>
              </div>

              <div className={styles.statusDivider}></div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Frontend Framework</span>
                <div className={styles.statusValue}>
                  <span className={styles.techTag}>Next.js 15.1</span>
                  <span className={styles.techTag}>React 19</span>
                </div>
              </div>

              <div className={styles.statusDivider}></div>

              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Autenticação</span>
                <div className={styles.statusValue}>
                  <ShieldCheck size={18} className={styles.shieldIcon} />
                  <span>JWT + Bcrypt configurados</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stack Highlights Section */}
        <section id="stack" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>TECNOLOGIAS INCLUÍDAS</span>
              <h2 className={styles.sectionTitle}>Tudo o que você precisa já configurado</h2>
              <p className={styles.sectionSubtitle}>
                Economize horas de setup inicial com as dependências e integrações já prontas para uso.
              </p>
            </div>

            <div className={styles.stackGrid}>
              {/* Frontend Card */}
              <div className={styles.stackCard}>
                <div className={styles.stackCardHeader}>
                  <div className={styles.stackIconWrapper}>
                    <Code2 size={24} className={styles.stackHeaderIcon} />
                  </div>
                  <div>
                    <h3 className={styles.stackCardTitle}>Frontend (Next.js)</h3>
                    <p className={styles.stackCardSubtitle}>Interface moderna, rápida e responsiva</p>
                  </div>
                </div>

                <div className={styles.stackItemsList}>
                  {stackFrontend.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className={styles.stackFeatureItem}>
                        <div className={styles.featureIconBox}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className={styles.featureItemTitle}>{item.name}</h4>
                          <p className={styles.featureItemDesc}>{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Backend Card */}
              <div className={styles.stackCard}>
                <div className={styles.stackCardHeader}>
                  <div className={styles.stackIconWrapper}>
                    <Server size={24} className={styles.stackHeaderIcon} />
                  </div>
                  <div>
                    <h3 className={styles.stackCardTitle}>Backend (Node.js & Express)</h3>
                    <p className={styles.stackCardSubtitle}>API REST segura e escalável</p>
                  </div>
                </div>

                <div className={styles.stackItemsList}>
                  {stackBackend.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className={styles.stackFeatureItem}>
                        <div className={styles.featureIconBox}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className={styles.featureItemTitle}>{item.name}</h4>
                          <p className={styles.featureItemDesc}>{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture & Interactive Explorer */}
        <section id="arquitetura" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>ESTRUTURA DO CÓDIGO</span>
              <h2 className={styles.sectionTitle}>Organização do Projeto</h2>
              <p className={styles.sectionSubtitle}>
                Navegue pelas pastas e rotas disponíveis para entender como o projeto está estruturado.
              </p>
            </div>

            <div className={styles.explorerContainer}>
              {/* Tab Navigation */}
              <div className={styles.explorerTabs}>
                <button
                  className={`${styles.explorerTabBtn} ${activeTab === 'structure' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('structure')}
                  id="tab-structure"
                >
                  <FolderGit2 size={18} />
                  <span>Estrutura de Pastas</span>
                </button>
                <button
                  className={`${styles.explorerTabBtn} ${activeTab === 'api' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('api')}
                  id="tab-api"
                >
                  <Server size={18} />
                  <span>Rotas da API Prontas</span>
                </button>
                <button
                  className={`${styles.explorerTabBtn} ${activeTab === 'interactive' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('interactive')}
                  id="tab-interactive"
                >
                  <Sparkles size={18} />
                  <span>Teste Interativo de UI</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className={styles.tabContentArea}>
                {activeTab === 'structure' && (
                  <div className={styles.foldersGrid}>
                    {folderStructure.map((folder, idx) => (
                      <div key={idx} className={styles.folderCard}>
                        <div className={styles.folderCardHeader}>
                          <FolderGit2 size={20} className={styles.folderIcon} />
                          <div>
                            <span className={styles.folderName}>{folder.dir}</span>
                            <span className={styles.folderDesc}>{folder.desc}</span>
                          </div>
                        </div>
                        <ul className={styles.folderItems}>
                          {folder.items.map((item, itemIdx) => (
                            <li key={itemIdx} className={styles.folderItemLi}>
                              <FileCode size={14} className={styles.fileIcon} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className={styles.apiEndpointsList}>
                    <div className={styles.apiNotice}>
                      <span>As rotas de autenticação abaixo estão implementadas em <code>backend/src/routes/auth.js</code>:</span>
                    </div>
                    {apiEndpoints.map((ep, idx) => (
                      <div key={idx} className={styles.endpointCard}>
                        <div className={styles.endpointTop}>
                          <span className={styles.httpBadge}>{ep.method}</span>
                          <code className={styles.endpointPath}>{ep.path}</code>
                          <span className={styles.endpointDesc}>{ep.desc}</span>
                        </div>
                        <div className={styles.endpointBottom}>
                          <span className={styles.bodyLabel}>Payload aceito:</span>
                          <code className={styles.bodyCode}>{ep.body}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'interactive' && (
                  <div className={styles.interactiveBox}>
                    <div className={styles.interactiveCard}>
                      <h4 className={styles.interactiveTitle}>Validação de Estado e React Hooks</h4>
                      <p className={styles.interactiveDesc}>
                        Este componente simples testa a reatividade, os tokens CSS do tema ativo e a integridade do ambiente Next.js.
                      </p>

                      <div className={styles.counterControl}>
                        <button
                          className={styles.counterBtn}
                          onClick={() => setCounter(Math.max(0, counter - 1))}
                        >
                          -
                        </button>
                        <div className={styles.counterDisplay}>
                          <span className={styles.counterValue}>{counter}</span>
                          <span className={styles.counterLabel}>cliques</span>
                        </div>
                        <button
                          className={styles.counterBtn}
                          onClick={() => setCounter(counter + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className={styles.interactiveNote}>
                        <CheckCircle2 size={16} className={styles.checkIcon} />
                        <span>Reatividade do React 19 funcionando perfeitamente</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quickstart Guide */}
        <section id="quickstart" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>INÍCIO RÁPIDO</span>
              <h2 className={styles.sectionTitle}>Como executar seu novo projeto</h2>
              <p className={styles.sectionSubtitle}>
                Execute o projeto localmente com os comandos abaixo no seu terminal.
              </p>
            </div>

            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Configurar Variáveis</h3>
                <p className={styles.stepDesc}>
                  Abra <code>backend/.env</code> e configure suas credenciais de banco e segredo JWT. No frontend, verifique <code>frontend/.env</code>.
                </p>
                <div className={styles.codeSnippetBox}>
                  <code>JWT_SECRET=sua_chave_aqui</code>
                </div>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>Iniciar o Backend</h3>
                <p className={styles.stepDesc}>
                  Acesse a pasta do backend e inicie o servidor com nodemon ou node.
                </p>
                <div className={styles.commandBox}>
                  <code>cd backend && npm run dev</code>
                  <button
                    className={styles.copyBtn}
                    onClick={() => handleCopy('cd backend && npm run dev', 'cmd-back')}
                    title="Copiar comando"
                  >
                    {copiedCommand === 'cmd-back' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Iniciar o Frontend</h3>
                <p className={styles.stepDesc}>
                  Acesse a pasta do frontend e suba o servidor Next.js em modo de desenvolvimento.
                </p>
                <div className={styles.commandBox}>
                  <code>cd frontend && npm run dev</code>
                  <button
                    className={styles.copyBtn}
                    onClick={() => handleCopy('cd frontend && npm run dev', 'cmd-front')}
                    title="Copiar comando"
                  >
                    {copiedCommand === 'cmd-front' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.logoGroup}>
                <div className={styles.logoBadgeSmall}>
                  <Layers size={18} />
                </div>
                <span className={styles.footerLogoTitle}>MODELO BASE</span>
              </div>
              <p className={styles.footerDesc}>
                Template de projeto limpo, modular e configurado para criação ágil de novas aplicações web.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Atalhos</span>
              <a href="#overview">Visão Geral</a>
              <a href="#stack">Stack</a>
              <a href="#arquitetura">Arquitetura</a>
              <a href="#quickstart">Como Executar</a>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Ambiente</span>
              <span>Next.js 15.1</span>
              <span>Node.js / Express</span>
              <span>Docker Ready</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Modelo Base • Boilerplate Fullstack. Pronto para desenvolvimento.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}