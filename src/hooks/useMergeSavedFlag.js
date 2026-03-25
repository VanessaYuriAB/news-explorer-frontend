import { useMemo } from 'react';

// Implementado em NewsProvider

function useMergeSavedFlag({ loggedIn, searchedNews, savedUserNews }) {
  const searchedArticlesArray = searchedNews?.articles;
  const userArticlesArray = savedUserNews?.userArticles; // pode ser undefined

  // Calcula derivado
  const mergedArticles = useMemo(() => {
    // Verificação de segurança para erro de leitura de searchedNews.articles =
    // null > evita crashes, o retorno precisa ser um array para ser aplicado o .map,
    // precisa ser o tipo esperado
    if (!Array.isArray(searchedArticlesArray)) return [];

    // Usuário DESLOGADO → retorna artigos com isSaved = false para manter o  formato
    // estável, conforme princípio básico de design de dados em React
    if (!loggedIn) {
      return searchedArticlesArray.map((searchedItem) => ({
        ...searchedItem,
        isSaved: false,
      }));
    }

    // Usuário LOGADO → merge com salvos

    const safeUserArticlesArray = userArticlesArray ?? []; // fallback dentro do useMemo
    // não participa do “contrato” das deps

    // Dentro do array searchedNews.articles, existe algum elemento com a propriedade
    // url igual a algum elemento dentro do array savedUserNews.userArticles? Se sim,
    // adiciona flag isSaved como true, se não, como false
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
