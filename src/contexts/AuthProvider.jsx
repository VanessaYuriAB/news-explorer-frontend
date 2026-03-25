import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import { getToken, removeToken, setAndStorageToken } from '../utils/token';
import useAuthBootstrap from '../hooks/useAuthBootstrap';
import { register, login } from '../utils/authApi';
import AuthContext from './AuthContext';

function AuthProvider({ children }) {
  /* ---------------------------
          HOOK DE ROUTER
  ---------------------------- */
  const navigate = useNavigate();

  /* ---------------------------
              ESTADOS
  ---------------------------- */

  const [tokenJwt, setTokenJwt] = useState(() => {
    const jwt = getToken();
    return jwt ? jwt : '';
  });

  const [loggedIn, setLoggedIn] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true); // para verificar autenticação
  // ao montar o app e controlar a renderização do jsx: está verificando?

  /* ---------------------------
            HELPER
  ---------------------------- */

  // Manipulador para deslogar: declarado antes do efeito de montagem/refresh e
  // memorizado em useCallback para estabilizar e não causar re-render
  // Auth expõe logout e User escuta mudança de login e limpa dados do usuário
  const handleLogout = useCallback(() => {
    removeToken(setTokenJwt);

    setLoggedIn(false);

    navigate('/', { replace: true });
  }, [navigate]);

  /* ---------------------------
              HOOK
  ---------------------------- */

  // Efeito de autenticação

  // Gate de autenticação com validação do JWT
  useAuthBootstrap({
    tokenJwt,
    setLoggedIn,
    setCheckingAuth,
    handleLogout,
  });

  /* ---------------------------
            HANDLERS
  ---------------------------- */

  // Signup e signin sem try/catch para lançar erro, já será lançado naturalmente pela
  // função chamada em cada um (register() ou login()), subindo para o useFormSubmit
  // do seu componente, essencial para o funcionamento de onSuccess e onError

  // Signup
  const handleRegistration = useCallback(async (newUserData) => {
    await register(newUserData);
  }, []);

  // Signin
  const handleLogin = useCallback(async (userData) => {
    const loggedUser = await login(userData);

    if (loggedUser.token) {
      setAndStorageToken(loggedUser.token, setTokenJwt);
    }

    // Login apenas ajusta token, focado na autenticação
    // Dados de perfil apenas no efeito de montagem/refresh, em useUserData, no UserProvider
    // A lógica de carregamento de perfil pode ser aplicada tanto no login quanto no
    // refresh da página
  }, []);

  /* ---------------------------
             PROVIDER
  ---------------------------- */

  const valueOfAuthProvider = useMemo(() => {
    return {
      tokenJwt,
      loggedIn,
      checkingAuth,
      handleLogout,
      handleRegistration,
      handleLogin,
    };
  }, [
    tokenJwt,
    loggedIn,
    checkingAuth,
    handleLogout,
    handleRegistration,
    handleLogin,
  ]);

  return (
    <AuthContext.Provider value={valueOfAuthProvider}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
