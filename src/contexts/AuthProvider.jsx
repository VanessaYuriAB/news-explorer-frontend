import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import usePopups from '../hooks/usePopups';
import { setAndStorageToken, getToken, removeToken } from '../utils/token';
import useAuthBootstrap from '../hooks/useAuthBootstrap';
import useUserData from '../hooks/useUserData';
import { register, login } from '../utils/authApi';
import AuthContext from './AuthContext';

function AuthProvider({ children }) {
  // Consumo de PopupsContext
  const { showApiError } = usePopups();

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

  const [currentUser, setCurrentUser] = useState({
    email: '',
    name: '',
  });

  const [savedUserNews, setSavedUserNews] = useState({ userArticles: [] });

  /* ---------------------------
            HELPER
  ---------------------------- */

  // Manipulador para deslogar: declarado antes dos efeitos de montagem/refresh e
  // memorizado em useCallback para estabilizar e não causar re-render
  const handleLogout = useCallback(() => {
    setCurrentUser({ email: '', name: '' });
    setSavedUserNews({ userArticles: [] });

    removeToken(setTokenJwt);

    setLoggedIn(false);

    navigate('/', { replace: true });
  }, [navigate]);

  /* ---------------------------
              HOOKS
  ---------------------------- */

  // Efeitos de montagem/refresh: ciclo de autenticação + carregamento de dados do
  // usuário atualmente logado, com set dos estados globais

  // Gate de autenticação
  useAuthBootstrap({ tokenJwt, setCheckingAuth });

  // Carregamento dos dados do usuário
  // Só roda se estiver com backend ativo (com o token do usuário)
  useUserData({
    tokenJwt,
    setLoggedIn,
    setCurrentUser,
    setSavedUserNews,
    handleLogout,
    showApiError,
    checkingAuth,
    setCheckingAuth,
  });

  /* ---------------------------
            HANDLERS
  ---------------------------- */

  // Signup e signin sem try/catch para lançar erro, já será lançado naturalmente pela
  // função chamada em cada um (register() ou login()), subindo para o useFormSubmit
  // do seu componente, essencial para o funcionamento de onSuccess e onError

  // Signup
  const handleRegistration = async (newUserData) => {
    await register(newUserData);
  };

  // Signin
  const handleLogin = async (userData) => {
    const loggedUser = await login(userData);

    if (loggedUser.token) {
      // Antes de logar, limpa dados anteriores de perfil de usuário
      // Para reforço, pq a limpeza tbm é aplicada no logout
      setCurrentUser({
        email: '',
        name: '',
      });

      setSavedUserNews({ userArticles: [] });

      setAndStorageToken(loggedUser.token, setTokenJwt);
    }

    // Login apenas ajusta token, focado na autenticação
    // Dados de perfil apenas no efeito de montagem/refresh, em useUserData
    // A lógica de carregamento de perfil pode ser aplicada tanto no login quanto no
    // refresh da página
  };

  /* ---------------------------
             PROVIDER
  ---------------------------- */

  return (
    <AuthContext.Provider
      value={{
        tokenJwt,
        loggedIn,
        checkingAuth,
        currentUser,
        savedUserNews,
        setSavedUserNews, // usado por salvar/des-salvar em app
        handleLogout,
        handleRegistration,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
