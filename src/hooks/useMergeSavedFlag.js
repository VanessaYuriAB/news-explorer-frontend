import { useMemo } from 'react';

// Encapsula derivado para 'merge' das listas de artigos (busca na NewsApi e salvos pelo
// usuário)
// Implementado em NewsProvider

function useMergeSavedFlag({ loggedIn, searchedNews, savedUserNews }) {
  // Calcula derivado
  const mergedArticles = useMemo(() => {
    // Verificação de segurança para login e erro de leitura de searchedNews.articles =
    // null > retorna o valor calculado de uma lista vazia e segura > para evitar crashes,
    // o retorno precisa ser um array para ser aplicado o .map, precisa ser o tipo esperado

    if (!loggedIn || !searchedNews || !Array.isArray(searchedNews.articles))
      return searchedNews?.articles ?? [];

    // Dentro do array searchedNews.articles, existe algum elemento com a propriedade
    // url igual a algum elemento dentro do array savedUserNews.userArticles? Se sim,
    // adiciona flag isSaved como true, se não, como false

    return searchedNews.articles.map((searchedItem) => {
      const isSaved = savedUserNews.userArticles.some((savedItem) => {
        return savedItem.link === searchedItem.url;
      });

      return { ...searchedItem, isSaved };
    });
  }, [loggedIn, searchedNews, savedUserNews.userArticles]);

  return mergedArticles;
}

export default useMergeSavedFlag;
