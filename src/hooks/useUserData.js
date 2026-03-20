/*
🔹 Hook — Dados do usuário (perfil + cards)

Só roda depois que a autenticação foi confirmada.

📁 Responsabilidades:

- buscar user (getCurrentUser)
- buscar notícias (getUserNews)
- setar estados globais
- tratar erros que não são de auth

Entrada típica:

useUserData({
  tokenJwt,
  isAuthenticated
});

✅ Esse hook:

- assume que auth já está resolvida
- pode ser reutilizado (ex: refresh manual)
- fica muito mais simples que um efeito para auth e setData juntos
*/

import { useRef, useEffect } from 'react';
import { getUserNews, getCurrentUser } from '../utils/mainApi';

// Carrega perfil + cards, e encerra checkingAuth

function useUserData({
  tokenJwt,
  setLoggedIn,
  setCurrentUser,
  setSavedUserNews,
  handleLogout,
  showApiError,
  checkingAuth,
  setCheckingAuth,
}) {
  // Ref para indicar sucesso ou falha na montagem do app e efeito não rodar em loop
  // Em efeitos de bootstrap, erro ≠ sucesso parcial
  const bootstrapFailedRef = useRef(false);

  // Se houver falha (429/500), o usuário pode ficar preso sem recuperar, mesmo após um
  // novo login, portanto aplicado efeito para reset ao trocar token
  useEffect(() => {
    bootstrapFailedRef.current = false;
  }, [tokenJwt]);

  useEffect(() => {
    // Se não houver token, retorna
    if (!tokenJwt) return;

    // Impede o retry automático
    if (bootstrapFailedRef.current) return;

    // Flag para verificar se o componente está montado: evita setState após desmontar
    let isMounted = true;

    // Fetch e set dos dados + checkingAuth
    // Define e executa a função assíncrona
    (async () => {
      try {
        const userInfos = await getCurrentUser(tokenJwt);

        const userSavedCards = await getUserNews(tokenJwt);

        if (!isMounted) return;

        setLoggedIn(true);

        // Seta variáveis de estado com dados do backend (user e articles)
        setCurrentUser({
          email: userInfos.user.email,
          name: userInfos.user.name,
        });

        setSavedUserNews(userSavedCards);
      } catch (error) {
        console.error(
          `Erro no efeito 'de montagem', em 'useUserData', para a busca e set dos dados do
          usuário logado \n`,
          error,
        );

        if (!isMounted) return;

        // Se ocorrer erro de autorização (token inválido), desloga o usuário
        if (error.status === 401) {
          handleLogout();
          return;
        }

        // Para erros 429, 500, etc: mostra msg de erro em popup tooltip
        // Usa o mesmo hook implementado nos handlers para salvar e des-salvar artigos
        showApiError(error);

        // Evita loop de montagem, travando a ref ao defini-la como true para indicar
        // falha no bootstrap - impede tds as próximas tentativas, controlando o ciclo de
        // vida da aplicação e quebrando o loop
        // Se usado apenas o return: interrompe apenas a tentativa atual, permitindo o loop
        // O return controla uma execução e o bootstrapFailedRef controla o comportamento
        // futuro do app
        bootstrapFailedRef.current = true;
      } finally {
        if (isMounted) {
          // Finaliza a verificação de autenticação
          setCheckingAuth(false);
        }
      }
    })();

    // Cleanup (função de limpeza)
    return () => {
      isMounted = false;
    };
  }, [
    tokenJwt,
    setLoggedIn,
    setCurrentUser,
    setSavedUserNews,
    handleLogout,
    showApiError,
    checkingAuth,
    setCheckingAuth,
  ]);
}

export default useUserData;
