import { useMemo } from 'react';

// Implementado em NewsProvider

function useMergeSavedFlag({ loggedIn, searchedNews, savedUserNews }) {
  const searchedArticlesArray = searchedNews?.articles;
  const userArticlesArray = savedUserNews?.userArticles; // pode ser undefined

  // Set memoizado, criado a partir dos artigos salvos
  // O(m) uma vez por mudança de userArticlesArray
  const savedUrlsSet = useMemo(() => {
    const safeUserArticlesArray = userArticlesArray ?? []; // fallback dentro do useMemo
    // não participa do “contrato” das deps

    return new Set(safeUserArticlesArray.map((savedItem) => savedItem.link));
  }, [userArticlesArray]);

  // Calcula derivado: merge usando lookup O(1) (consulta / verificação de existência)
  // com Set.has()
  // O(1) = tempo constante: não cresce com o tamanho da coleção porque o Set usa hashing
  // em vez de varredura sequencial
  const mergedArticles = useMemo(() => {
    // Verificação de segurança: garante retorno como array para uso no .map(), evitando
    // crashes caso searchedNews?.articles seja null
    if (!Array.isArray(searchedArticlesArray)) return [];

    // Usuário DESLOGADO → retorna artigos com isSaved = false para manter o formato
    // estável, conforme princípio básico de design de dados em React
    if (!loggedIn) {
      return searchedArticlesArray.map((searchedItem) => ({
        ...searchedItem,
        isSaved: false,
      }));
    }

    // Usuário LOGADO → merge com lookup O(1): pesquisados + salvos: O(n + m) total

    // Dentro do array searchedNews.articles, existe algum elemento com a propriedade
    // url igual a algum elemento dentro do Set savedLinksSet? Se sim, adiciona flag
    // isSaved como true, se não, como false
    return searchedArticlesArray.map((searchedItem) => {
      const isSaved = savedUrlsSet.has(searchedItem.url);

      return { ...searchedItem, isSaved };
    });
  }, [loggedIn, searchedArticlesArray, savedUrlsSet]);

  return mergedArticles;
}

export default useMergeSavedFlag;
