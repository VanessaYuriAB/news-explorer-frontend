/*
🔹 Hook — Bootstrap de autenticação

Responsável apenas por decidir se o app está autenticado e quando o bootstrap termina.

📁 Responsabilidades:

- observar tokenJwt
- validar token (ou tentar)
- controlar checkingAuth
- decidir logout
- não carregar dados de perfil

Retorno típico:

{
  isAuthenticated,
  checkingAuth,
  authError
}

✅ Esse hook:

- roda uma vez por token
- controla o “gate” da aplicação
- não sabe nada sobre perfil ou notícias
*/

import { useEffect } from 'react';
import { getCurrentUser } from '../utils/mainApi';

// Resolve o “gate” quando não há token: não tenta “validar” token, só encerra o
// loading quando não existe

function useAuthBootstrap({
  tokenJwt,
  setLoggedIn,
  setCheckingAuth,
  handleLogout,
}) {
  useEffect(() => {
    if (!tokenJwt) {
      setCheckingAuth(false); // sem token, já encerra gate, finalizando a verificação de
      // autenticação e retornando
      return;
    }

    // Valida JWT, buscando dados do usuário no backend e encerra checkingAuth
    (async () => {
      try {
        await getCurrentUser(tokenJwt);
        setLoggedIn(true);
      } catch (error) {
        console.error(
          `Erro no efeito 'autenticação', em 'useAuthBootstrap', para a busca dos dados do
          usuário logado \n`,
          error,
        );

        // Se ocorrer erro de autorização (token inválido), desloga o usuário
        if (error.status === 401) {
          handleLogout();
          return;
        }
      } finally {
        // Finaliza a verificação de autenticação
        setCheckingAuth(false);
      }
    })();

    // Sempre que token mudar, decide o gate
    // Com token, precisa do bootstrap (user/news)
  }, [tokenJwt, setLoggedIn, setCheckingAuth, handleLogout]);
}

export default useAuthBootstrap;
