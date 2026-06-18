import { createContext, useContext, useState, useCallback } from 'react';
import * as authApi from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authApi.getSession());

  const login = useCallback(async (email, senha) => {
    const session = await authApi.login(email, senha);
    setUsuario(session);
    return session;
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const session = await authApi.cadastro(dados);
    setUsuario(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    authApi.clearSession();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
