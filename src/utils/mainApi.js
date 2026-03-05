import { baseMainApiUrl, makeApisRequest } from './utilsApis';

// Assinatura: fetch(url-to-requested-resource, options-object)
// É um método assíncrono, retorna uma promisse e method padrão: GET

// O spread (...) aplica a verificação injetando propriedade, os parênteses garantem que
// o ternário seja avaliado primeiro e só depois o resultado (objeto) seja espalhado >
// para evitar erros de token Bearer null em Authorization > retornando 401 ou 403 ao
// invés de 400 com Validation failed

// POST - /articles
const saveNews = async (cardObject, tokenJwt) => {
  const savedCard = await makeApisRequest({
    endpoint: `${baseMainApiUrl}/articles`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(tokenJwt !== '' ? { Authorization: `Bearer ${tokenJwt}` } : {}),
    },
    reqBody: cardObject, // vem do componente NewsCardList/NewsCard, um obj simple pq a
    // conversão para JSON é aplicada no makeApisRequest
  });

  return savedCard;

  // Se a solicitação não for bem-sucedida, repassa o erro adiante > handleSaveCard
  // Try/catch desnecessário aqui tbm
};

// DELETE - /articles/:id >
const unsaveNews = async (cardId, tokenJwt) => {
  const unsavedCard = await makeApisRequest({
    endpoint: `${baseMainApiUrl}/articles/${cardId}`,
    method: 'DELETE',
    headers: {
      ...(tokenJwt !== '' ? { Authorization: `Bearer ${tokenJwt}` } : {}),
    },
  });

  return unsavedCard;

  // Se a solicitação não for bem-sucedida, repassa o erro adiante > memoizedHandleUnsave
  // Try/catch desnecessário aqui tbm
};

// GET - /articles
const getUserNews = async (tokenJwt) => {
  const userNews = await makeApisRequest({
    endpoint: `${baseMainApiUrl}/articles`,
    method: 'GET',
    headers: {
      ...(tokenJwt !== '' ? { Authorization: `Bearer ${tokenJwt}` } : {}),
    },
  });

  return userNews;

  // Se a solicitação não for bem-sucedida, repassa o erro adiante > efeito de montagem
  // Try/catch desnecessário aqui tbm
};

// GET - /users/me > aplicado no efeito de montagem da aplicação
const getCurrentUser = async (tokenJwt) => {
  const userInfos = await makeApisRequest({
    endpoint: `${baseMainApiUrl}/users/me`,
    method: 'GET',
    headers: {
      ...(tokenJwt !== '' ? { Authorization: `Bearer ${tokenJwt}` } : {}),
    },
  });

  return userInfos;

  // Se a solicitação não for bem-sucedida, repassa o erro adiante > efeito de montagem
  // Try/catch desnecessário aqui tbm
};

export { saveNews, unsaveNews, getUserNews, getCurrentUser };
