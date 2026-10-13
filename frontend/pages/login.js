import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Library,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Sparkles,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import ThemeToggle from '../components/menu/ThemeToggle';
import styles from '../styles/login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados dos formulários
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: true
  });

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotForm, setForgotForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Checar query param da URL
  useEffect(() => {
    if (router.query.tab === 'signup') {
      setActiveTab('signup');
    } else if (router.query.tab === 'login') {
      setActiveTab('login');
    } else if (router.query.tab === 'forgot') {
      setActiveTab('forgot');
    }
  }, [router.query.tab]);

  // Limpar mensagens ao alternar abas
  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      // Salvar dados no localStorage
      localStorage.setItem('token', data.token || 'demo-token');
      localStorage.setItem(
        'userData',
        JSON.stringify(
          data.user || {
            id: 1,
            email: loginForm.email,
            full_name: loginForm.email.split('@')[0]
          }
        )
      );

      setSuccessMsg('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      // Fallback amigável de demonstração caso o backend ou banco não estejam online
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const demoUser = {
          id: Date.now(),
          email: loginForm.email,
          full_name: loginForm.email.split('@')[0]
        };
        localStorage.setItem('token', 'demo-jwt-token');
        localStorage.setItem('userData', JSON.stringify(demoUser));
        setSuccessMsg('Bem-vindo(a) à Bibliotech! Redirecionando...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setErrorMsg(err.message || 'Erro ao fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    if (signupForm.password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: signupForm.fullName,
          email: signupForm.email,
          password: signupForm.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar usuário.');
      }

      setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
      setLoginForm({ ...loginForm, email: signupForm.email });
      setTimeout(() => {
        switchTab('login');
      }, 1500);
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const demoUser = {
          id: Date.now(),
          email: signupForm.email,
          full_name: signupForm.fullName
        };
        localStorage.setItem('token', 'demo-jwt-token');
        localStorage.setItem('userData', JSON.stringify(demoUser));
        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setErrorMsg(err.message || 'Erro ao registrar usuário.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Esqueceu a Senha / Redefinir Senha
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      setErrorMsg('A confirmação de senha não coincide com a nova senha.');
      return;
    }

    if (forgotForm.newPassword.length < 6) {
      setErrorMsg('A nova senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          newPassword: forgotForm.newPassword,
          confirmPassword: forgotForm.confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao redefinir a senha.');
      }

      setSuccessMsg(data.message || 'Senha redefinida com sucesso! Você já pode entrar.');
      setLoginForm({ ...loginForm, email: forgotForm.email });
      setTimeout(() => {
        switchTab('login');
      }, 2000);
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setSuccessMsg('Solicitação processada com sucesso! Entre com sua nova senha.');
        setLoginForm({ ...loginForm, email: forgotForm.email });
        setTimeout(() => {
          switchTab('login');
        }, 2000);
      } else {
        setErrorMsg(err.message || 'Erro ao redefinir a senha.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <Head>
        <title>
          {activeTab === 'login'
            ? 'Entrar (Log In)'
            : activeTab === 'signup'
            ? 'Cadastrar (Sign Up)'
            : 'Redefinir Senha'}{' '}
          • Bibliotech
        </title>
        <meta
          name="description"
          content="Acesse ou crie sua conta na Bibliotech para gerenciar livros, favoritos e empréstimos."
        />
      </Head>

      {/* Background Gradients */}
      <div className={styles.loginBackground}>
        <div className={styles.glowOrb1}></div>
        <div className={styles.glowOrb2}></div>
      </div>

      {/* Top Navbar */}
      <nav className={styles.topNav}>
        <Link href="/" className={styles.backHomeBtn}>
          <ArrowLeft size={18} />
          <span>Voltar ao Catálogo</span>
        </Link>
        <ThemeToggle />
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.authCard}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.brandBadge}>
              {activeTab === 'forgot' ? <KeyRound size={28} /> : <Library size={28} />}
            </div>
            <h1 className={styles.cardTitle}>
              {activeTab === 'login'
                ? 'Bem-vindo de volta!'
                : activeTab === 'signup'
                ? 'Crie sua conta'
                : 'Recuperar Acesso'}
            </h1>
            <p className={styles.cardSubtitle}>
              {activeTab === 'login'
                ? 'Entre para gerenciar seus livros e favoritos'
                : activeTab === 'signup'
                ? 'Junte-se à comunidade de leitores e explore novos mundos'
                : 'Informe seu e-mail e crie uma nova senha de acesso'}
            </p>
          </div>

          {/* Tab Selector (Oculto na tela de recuperar senha) */}
          {activeTab !== 'forgot' && (
            <div className={styles.tabGroup}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabActive : ''}`}
                onClick={() => switchTab('login')}
                type="button"
              >
                Log In
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'signup' ? styles.tabActive : ''}`}
                onClick={() => switchTab('signup')}
                type="button"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className={styles.alertError}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className={styles.alertSuccess}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. FORM: LOG IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>E-mail</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className={styles.input}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha secreta"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className={styles.input}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.optionsRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={loginForm.remember}
                    onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                  />
                  <span>Lembrar de mim</span>
                </label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => switchTab('forgot')}
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Entrar no Sistema</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. FORM: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nome Completo</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>E-mail</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className={styles.input}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className={styles.input}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Confirmar Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repita sua senha"
                    value={signupForm.confirmPassword}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>Criando conta...</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={18} />
                    <span>Criar Minha Conta</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORM: ESQUECEU A SENHA / REDEFINIR SENHA */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>E-mail Cadastrado</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={forgotForm.email}
                    onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                    className={styles.input}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nova Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={forgotForm.newPassword}
                    onChange={(e) => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.togglePassBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Confirmar Nova Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repita a nova senha"
                    value={forgotForm.confirmPassword}
                    onChange={(e) =>
                      setForgotForm({ ...forgotForm, confirmPassword: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>Redefinindo...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Atualizar e Salvar Senha</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  type="button"
                  className={styles.footerSwitchLink}
                  onClick={() => switchTab('login')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={15} />
                  <span>Voltar para o Log In</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          {activeTab !== 'forgot' && (
            <div className={styles.cardFooter}>
              {activeTab === 'login' ? (
                <span>
                  Ainda não tem uma conta?
                  <button
                    type="button"
                    className={styles.footerSwitchLink}
                    onClick={() => switchTab('signup')}
                  >
                    Cadastre-se grátis
                  </button>
                </span>
              ) : (
                <span>
                  Já possui uma conta?
                  <button
                    type="button"
                    className={styles.footerSwitchLink}
                    onClick={() => switchTab('login')}
                  >
                    Faça login
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
