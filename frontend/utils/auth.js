import { useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Hook centralizado para gerenciar autenticação JWT e perfil do usuário
export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sincroniza dados com localStorage e valida token na API
  const syncUserData = useCallback(async () => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    setToken(storedToken || null);

    if (storedToken && storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        setUser(parsed);
      } catch (e) {
        console.error("Erro ao ler userData local:", e);
      }

      // Validação assíncrona do token no backend (GET /auth/me)
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem("userData", JSON.stringify(data.user));
          }
        } else if (res.status === 401 || res.status === 403) {
          // Token expirado ou inválido
          console.warn("Token JWT inválido ou expirado. Sessão encerrada.");
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setUser(null);
          setToken(null);
        }
      } catch (netErr) {
        // Se a API estiver temporariamente offline, preserva os dados em cache
        console.warn("API de autenticação indisponível, usando cache local:", netErr.message);
      }
    } else {
      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    syncUserData();

    const handleStorageChange = (e) => {
      if (e.key === "userData" || e.key === "token") {
        syncUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [syncUserData]);

  // Função para login com email e senha
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "E-mail ou senha incorretos.");
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user, token: data.token };
      }

      throw new Error("Resposta inválida do servidor.");
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função para cadastro de novo usuário
  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar usuário.");
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user, token: data.token };
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setToken(null);
  };

  // Atualizar plano do usuário
  const updatePlan = async (plano_id) => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) return false;

    try {
      const res = await fetch(`${API_URL}/auth/plan`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plano_id })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("userData", JSON.stringify(data.user));
        }
        return true;
      }
    } catch (e) {
      console.error("Erro ao atualizar plano no backend:", e);
    }

    // Fallback local se a requisição falhar
    if (user) {
      const updated = { ...user, plano_id };
      setUser(updated);
      localStorage.setItem("userData", JSON.stringify(updated));
    }
    return true;
  };

  // Atualização direta do objeto usuário
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  // Estado e gestão de Tenant / Franquia ativa (Multibases)
  const [tenant, setTenant] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("activeTenant");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { id: 1, slug: "matriz", name: "Bibliotech - Matriz Central" };
  });

  const [tenants, setTenants] = useState([
    { id: 1, slug: "matriz", name: "Bibliotech - Matriz Central" },
    { id: 2, slug: "franquia-sp", name: "Bibliotech - Franquia São Paulo" }
  ]);

  // Carrega lista de tenants disponíveis
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch(`${API_URL}/tenants`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setTenants(json.data);
          }
        }
      } catch (e) {}
    };
    fetchTenants();
  }, []);

  // Trocar de franquia / empresa ativa
  const switchTenant = (newTenant) => {
    setTenant(newTenant);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTenant", JSON.stringify(newTenant));
      window.dispatchEvent(new Event("storage"));
    }
  };

  // Funções de compatibilidade legada
  const changeCompany = (company) => switchTenant(company);
  const updateCompanyData = (id, name, role) => {
    switchTenant({ id, slug: name.toLowerCase().replace(/\s+/g, '-'), name });
  };

  return {
    user,
    token,
    loading,
    tenant,
    tenants,
    switchTenant,
    companyId: tenant?.id,
    companyName: tenant?.name,
    login,
    register,
    logout,
    updatePlan,
    updateUser,
    changeCompany,
    updateCompanyData,
    syncUserData
  };
}
