import { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import usePopups from '../hooks/usePopups';
import useSearchedNewsStorage from '../hooks/useSearchedNewsStorage';
import getNews from '../utils/newsApi';
import { saveNews, unsaveNews } from '../utils/mainApi';
import NewsContext from './NewsContext';

function NewsProvider({ children }) {
  /* ---------------------------
             ESTADOS
  ---------------------------- */
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [searchedNews, setSearchedNews] = useState(() => {
    const searched = localStorage.getItem('searchedNewsData');
    return searched
      ? JSON.parse(searched)
      : {
          status: null,
          totalResults: 0,
          articles: [],
          code: null,
          message: null,
        };
  });

  /* ---------------------------
          CONTEXTOS
  ---------------------------- */
  // Consumo de AuthContext
  const { savedUserNews, tokenJwt, setSavedUserNews, loggedIn } = useAuth();

  // Consumo de PopupsContext
  const { showApiError } = usePopups();

  /* ---------------------------
             EFEITOS
  ---------------------------- */

  // Efeito para atualizar o localStorage sempre que o estado para notícias pesquisadas
  // (searchedNews) mudar > pq a pesquisa pode ser feita deslogado, para persistência dos
  // dados ao recarregar a página e pq o backend não tem nada relacionado à pesquisa
  useSearchedNewsStorage(searchedNews);

  // Efeito derivado: para sincronizar estados derivados (merge de searchedNews com
  // savedUserNews) e adicionar a info 'isSaved' aos artigos (para o ícone do botão
  // 'salvar', no NewsCard)
  useEffect(() => {
    if (!loggedIn) return;

    // Verificação de segurança para erro de leitura de searchedNews.articles > null
    // Com o same dentro do setState, o efeito só altera o estado quando os articles
    // realmente mudam
    if (!searchedNews || !Array.isArray(searchedNews.articles)) return;

    function mergeNewsLists() {
      try {
        // Dentro do array searchedNews.articles, existe algum elemento com a propriedade
        // url igual a algum elemento dentro do array savedUserNews.userArticles? Se sim,
        // adiciona flag isSaved como true, se não, como false
        const mergedArticles = searchedNews.articles.map((searchedItem) => {
          const isSaved = savedUserNews.userArticles.some((savedItem) => {
            return searchedItem.url === savedItem.link;
          });

          return { ...searchedItem, isSaved };
        });

        // Merge: atualizando estado
        setSearchedNews((prev) => {
          // Verificação: evita loop

          // E o efeito só altera o estado quando os articles realmente mudam, por causa
          // do searchedNews nas dependências do efeito e não searchedNews.articles que é
          // o que é realmente utilizado no efeito > recomendado pelo React: não coloque
          // dependência profunda em efeitos pq o React avalia a dependência antes do
          // effect e o estado pode estar null em transições

          // Gerada por I.A. (Copilot)
          const same =
            prev.articles.length === mergedArticles.length &&
            prev.articles.every(
              (a, i) =>
                a.url === mergedArticles[i].url &&
                a.isSaved === mergedArticles[i].isSaved,
            );

          if (same) return prev; // evita re-render

          return { ...prev, articles: mergedArticles };
        });
      } catch (error) {
        console.error(
          'Erro no efeito de merge das listas de cards, mergeNewsLists \n',
          error,
        );
      }
    }

    mergeNewsLists();
  }, [loggedIn, searchedNews, savedUserNews]);

  /* ---------------------------
             HANDLERS
  ---------------------------- */

  // Handler para getNews + adicionar queryString para a tag do card
  const handleGetNews = async (queryToSearch) => {
    try {
      // GET para a API externa: News Api
      const responseOfNews = await getNews(queryToSearch);

      // Adiciona uma nova propriedade ('tag') no obj de cada cartão, para implementar na
      // tag, se salvo
      const articlesWithTag = responseOfNews.articles.map((card) => {
        return {
          ...card,
          tag: queryToSearch,
        };
      });

      // Atualizado todo o objeto de resposta, com a atualização da flag 'tag' em cada
      // card, no array para artigos
      const responseOfNewsWithTag = {
        ...responseOfNews,
        articles: articlesWithTag,
      };

      // Define o estado do resultado de pesquisa, com o obj inteiro retornado
      // Para acesso às propriedades do obj em outras funcionalidades
      // Caso o status seja 'ok' ou, tbm, 'error'; condicionando a renderização de
      // componentes
      setSearchedNews(responseOfNewsWithTag); // status 'ok'
    } catch (responseOfError) {
      setSearchedNews({
        status: 'error',
        code: responseOfError.code,
        message: responseOfError.message,
        totalResults: 0,
        articles: [],
      }); // status 'error' > para renderização da msg de erro em NewsCardList
      throw responseOfError; // repassa o erro para o componente SearchForm
    }
  };

  // Salvar e des-salvar artigos: com o backend ativo, sem armazenamento local

  // Handler: salvar cards
  const handleSaveCard = async (searchedNewsCard) => {
    try {
      const normalizeCard = (card) => ({
        tag: card.tag, // propriedade adicionada em handleGetNews
        title: card.title,
        description: card.description,
        publishedAt: card.publishedAt,
        source: card.source?.name || null, // para ajustar formato da
        // propriedade source, como esperado no backend, e não retornar
        // 400, devido validação do celebrate/joi
        url: card.url,
        urlToImage: card.urlToImage,
      });

      const savedCard = await saveNews(
        normalizeCard(searchedNewsCard),
        tokenJwt,
      );

      // Set do estado para cartões salvos do usuário (savedUserNews)
      // Atualiza o array (userArticles) dentro do objeto da variável (savedUserNews),
      // definindo nova lista de objetos de artigos do usuário com a inclusão do novo
      // card no começo do array
      setSavedUserNews((prev) => ({
        userArticles: [savedCard, ...prev.userArticles],
      }));
    } catch (error) {
      // Exibe popup com msg do erro ao usuário
      // Abre o tooltip, renderizado por Popup
      showApiError(error);

      console.error('Erro ao salvar artigo, handleSaveCard \n', error);
    }
  };

  // Handler: des-salvar cards de pesquisa (NewsCard) e remover cards de salvos
  // (SavedNewsCard)
  // useCallback: para memorizar a função e não recriar a cada render > NewsCard
  // e SavedNewsCard
  // Em conjunto com React.memo() e useMemo() para os dados
  const memoizedHandleUnsave = useCallback(
    async (cardId) => {
      try {
        // Passa o _id do card como parâmetro (_id gerado automaticamente pelo Mongo DB ao
        // salvar o artigo na coleção do banco de dados)
        await unsaveNews(cardId, tokenJwt);

        // Set do estado para cartões salvos do usuário (savedUserNews)
        // .filter(): cria um novo vetor baseado no original, filtrando elementos e
        // retornando apenas os que estão de acordo com a verificação fornecida
        // Filtra um novo vetor com apenas os cards que não possuem o msm _id do card a ser
        // deletado
        setSavedUserNews((prev) => {
          return {
            userArticles: prev.userArticles.filter((userCard) => {
              return userCard._id !== cardId;
            }),
          };
        });
      } catch (error) {
        // Exibe popup com msg do erro ao usuário
        // Abre o tooltip, renderizado por Popup
        showApiError(error);

        console.error(
          'Erro ao des-salvar artigo, memoizedHandleUnsave \n',
          error,
        );
      }
    },
    [tokenJwt, setSavedUserNews, showApiError],
  );

  /* ---------------------------
             PROVIDER
  ---------------------------- */

  return (
    <NewsContext.Provider
      value={{
        isSearchLoading,
        setIsSearchLoading,
        searchedNews,
        setSearchedNews,
        handleGetNews,
        handleSaveCard,
        memoizedHandleUnsave,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export default NewsProvider;
