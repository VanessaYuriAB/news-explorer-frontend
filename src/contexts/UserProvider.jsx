import useAuth from '../hooks/useAuth';
import usePopups from '../hooks/usePopups';
import { useState } from 'react';
import useUserData from '../hooks/useUserData';
import useResetUserData from '../hooks/useResetUserData';
import UserContext from './UserContext';

function UserProvider({ children }) {
  // Consumo de AuthContext
  const {
    tokenJwt,
    loggedIn,
    setLoggedIn,
    handleLogout,
    checkingAuth,
    setCheckingAuth,
  } = useAuth();

  // Consumo de PopupsContext
  const { showApiError } = usePopups();

  /* ---------------------------
              ESTADOS
  ---------------------------- */

  const [currentUser, setCurrentUser] = useState({
    email: '',
    name: '',
  });

  const [savedUserNews, setSavedUserNews] = useState({ userArticles: [] });

  /* ---------------------------
              HOOK
  ---------------------------- */

  // Efeito de montagem/refresh: carregamento dos dados do usuário
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

  // Reseta dados do perfil do usuário, conforme status de loggedIn
  useResetUserData({ loggedIn, setCurrentUser, setSavedUserNews });

  /* ---------------------------
             PROVIDER
  ---------------------------- */

  return (
    <UserContext.Provider
      value={{
        currentUser,
        savedUserNews,
        setSavedUserNews, // usado por salvar/des-salvar em app
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
