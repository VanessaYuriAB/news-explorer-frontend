import useAuth from '../hooks/useAuth';
import usePopups from '../hooks/usePopups';
import { useState, useMemo } from 'react';
import useUserData from '../hooks/useUserData';
import useResetUserData from '../hooks/useResetUserData';
import UserContext from './UserContext';

function UserProvider({ children }) {
  // Consumo de AuthContext
  const { tokenJwt, loggedIn } = useAuth();

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

  const [checkingUser, setCheckingUser] = useState(false);

  /* ---------------------------
              HOOK
  ---------------------------- */

  // Efeito de montagem/refresh: carregamento dos dados e artigos do usuário
  // Só roda se estiver com backend ativo (com o token do usuário)
  useUserData({
    tokenJwt,
    loggedIn,
    setCurrentUser,
    setSavedUserNews,
    showApiError,
    setCheckingUser,
  });

  // Reseta dados do perfil do usuário, conforme status de loggedIn
  useResetUserData({ loggedIn, setCurrentUser, setSavedUserNews });

  /* ---------------------------
             PROVIDER
  ---------------------------- */

  const valueOfUserProvider = useMemo(() => {
    return {
      currentUser,
      savedUserNews,
      setSavedUserNews, // usado por salvar/des-salvar em app, setter: estável, ñ entra
      // nas deps do memo
      checkingUser,
    };
  }, [currentUser, savedUserNews, checkingUser]);

  return (
    <UserContext.Provider value={valueOfUserProvider}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
