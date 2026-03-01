// ----------------------------------------------
// Componente para proteger a rota '/saved-news':
// usuários não autorizados não podem acessá-la
// ----------------------------------------------

import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import PopupsContext from '../../contexts/PopupsContext';
import useOpenedPopups from '../../hooks/useOpenedPopups';

function ProtectedRoute({ children }) {
  const { loggedIn } = useContext(AuthContext);
  const { handleOpenPopup } = useContext(PopupsContext);

  const { openSignin } = useOpenedPopups({
    handleOpenPopup,
  });

  // Efeito colaral: se não estiver logado, além de redirecionar para '/', abre
  // popup de login
  useEffect(() => {
    if (!loggedIn) {
      openSignin();
    }
  }, [openSignin, loggedIn]);

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }

  // Caso contrário, renderiza o componente filho protegido (SavedNewsCardList)
  return children;
}

export default ProtectedRoute;
