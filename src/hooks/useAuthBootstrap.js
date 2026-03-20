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

// Resolve o “gate” quando não há token: não tenta “validar” token, só encerra o
// loading quando não existe

function useAuthBootstrap({ tokenJwt, setCheckingAuth }) {
  useEffect(() => {
    // Sempre que token mudar, decide o gate
    if (tokenJwt) {
      setCheckingAuth(true); // com token, precisa do bootstrap (carregar user/news)
    } else {
      setCheckingAuth(false); // sem token, encerra gate, finalizando a verificação de
      // autenticação
    }
  }, [tokenJwt, setCheckingAuth]);
}

export default useAuthBootstrap;
