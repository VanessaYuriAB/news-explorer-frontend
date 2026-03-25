import { useMemo } from 'react';

// Encapsula derivado para 'merge' das listas de artigos (busca na NewsApi e salvos pelo
// usuário)
// Implementado em NewsProvider

function useMergeSavedFlag({ loggedIn, searchedNews, savedUserNews }) {
  const searchedArticlesArray = searchedNews?.articles;
  const userArticlesArray = savedUserNews?.userArticles; // pode ser undefined

  // Calcula derivado
  const mergedArticles = useMemo(() => {
    // Verificação de segurança para login e erro de leitura de searchedNews.articles =
    // null > retorna o valor calculado de uma lista vazia e segura > para evitar crashes,
    // o retorno precisa ser um array para ser aplicado o .map, precisa ser o tipo esperado

    if (!loggedIn || !Array.isArray(searchedArticlesArray)) return [];

    // Dentro do array searchedNews.articles, existe algum elemento com a propriedade
    // url igual a algum elemento dentro do array savedUserNews.userArticles? Se sim,
    // adiciona flag isSaved como true, se não, como false

    const safeUserArticlesArray = userArticlesArray ?? []; // fallback dentro do useMemo
    // não participa do “contrato” das deps

    return searchedArticlesArray.map((searchedItem) => {
      const isSaved = safeUserArticlesArray.some((savedItem) => {
        return savedItem.link === searchedItem.url;
      });

      return { ...searchedItem, isSaved };
    });
  }, [loggedIn, searchedArticlesArray, userArticlesArray]);

  return mergedArticles;
}

export default useMergeSavedFlag;
