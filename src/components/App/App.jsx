import Header from '../Header/Header';
import SearchMain from '../SearchMain/SearchMain';
import NewsCardList from '../NewsCardList/NewsCardList';
import SavedNewsHeader from '../SavedNewsHeader/SavedNewsHeader';
import SavedNewsCardList from '../SavedNewsCardList/SavedNewsCardList';
import Preloader from '../Preloader/Preloader';
import NothingFound from '../NothingFound/NothingFound';
import About from '../About/About';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Footer from '../Footer/Footer';
import Signin from '../Popups/components/Signin/Signin';
import Signup from '../Popups/components/Signup/Signup';
import Popups from '../Popups/Popups';
import AuthContext from '../../contexts/AuthContext';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import PopupsContext from '../../contexts/PopupsContext';
import getNews from '../../utils/newsApi';
import { register, login } from '../../utils/authApi';
import { setAndStorageToken, getToken, removeToken } from '../../utils/token';
import {
  saveNews,
  unsaveNews,
  getUserNews,
  getCurrentUser,
} from '../../utils/mainApi';
import useApiError from '../../hooks/useApiError';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import './App.css';

function App() {
  /* ------------------------------
          HOOKS DE ROUTER
  ------------------------------- */

  // Hook de localização para saber a rota atual
  const location = useLocation();

  // Hook de navegação para redirecionamento de rota
  const navigate = useNavigate();

  /* ------------------------------
              ESTADOS
  ------------------------------- */

  // Variável de estado: status de login
  const [loggedIn, setLoggedIn] = useState(false);

  // Variável de estado: controle do Preloader
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Variável de estado: controle do resultado de notícias pesquisadas
  // Inicia com os dados do localStorage, se houver
  // Definição do obj para evitar verificações e erros, não podendo ser null, articles
  // é um array e pode ser iterado sem erros
  // Propriedades do obj de retorno de erro da Api inclusas no mesmo objeto definido
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

  // Variável de estado: token JWT
  const [tokenJwt, setTokenJwt] = useState(() => {
    const jwt = getToken();
    return jwt ? jwt : '';
  });

  // Variável de estado: dados do usuário atualmente logado
  const [currentUser, setCurrentUser] = useState({
    email: '',
    name: '',
  });

  // Variável de estado: controle da lista de cartões salvos do usuário atual
  // Definição de vetor vazio para evitar verificações e erros, não podendo ser null,
  // savedUserNews.userArticles é um array de objs e pode ser iterado sem erros
  const [savedUserNews, setSavedUserNews] = useState({ userArticles: [] });

  // Variável de estado: controle dos popups (Signin, Signup e Tooltip)
  const [popup, setPopup] = useState(null);

  // Variável de estado: controle do header e nav para mobile
  const [mobile, setMobile] = useState(false);

  // Variável de estado para verificar autenticação ao montar o app
  // Está verificando ou não está verificando?
  const [checkingAuth, setCheckingAuth] = useState(true);

  /* ------------------------------
                REF
  ------------------------------- */

  // Ref para indicar sucesso ou falha na montagem do app
  // Para efeito não rodar em loop
  const bootstrapFailedRef = useRef(false);

  /* ------------------------------
           HANDLERS POPUP
  ------------------------------- */

  // Open e Close: genéricos
  // Para abrir Popups, que renderiza cinco children diferentes

  // Handler: abre Popups
  // Memoizada para não gerar loop no efeito de montagem e efeito do ProtectedRoute
  // Com verificação de type, tbm para evitar loop, no efeito para proteção de rota
  // Se o tipo de popup for o mesmo do anteriormente aberto, não altera, não re-renderiza
  // Verificação de prev pq state inicializa como null
  // Verificação, tbm, do tipo de tooltip, já que existem três popups deste tipo
  const handleOpenPopup = useCallback((nextPopup) => {
    setPopup((prev) => {
      if (prev?.type === nextPopup.type) {
        if (nextPopup.type === 'tooltip') {
          return prev.tooltipType === nextPopup.tooltipType ? prev : nextPopup;
        }

        return prev;
      }

      return nextPopup;
    });
  }, []);

  // Handler: fecha Popups
  const handleClosePopup = () => {
    setPopup(null);
  };

  /* ------------------------------
            HOOK DERIVADO
  ------------------------------- */

  // Função para chamar o hook que renderiza popup de msgs de erros da Api do servidor
  // Chamado ao salvar/des-salvar artigos e no efeito de montagem e refresh, após get para
  // dados do usuário logado
  // É configurado por uma função externa pq o hook não pode ser chamada dentro dos
  // handlers
  const showApiError = useApiError(handleOpenPopup);

  /* ------------------------------
              LOGOUT
  ------------------------------- */

  // Manipulador para deslogar: configurado antes do efeito de montagem e memorizado em
  // useCallback para estabilizar e não causar re-render
  const handleLogout = useCallback(() => {
    // Limpa estados: perfil + artigos
    setCurrentUser({ email: '', name: '' });
    setSavedUserNews({ userArticles: [] });

    // Limpa infos do token com função utilitária (armazenamento local + variável de
    // estado)
    removeToken(setTokenJwt);

    // Desabilita o login
    setLoggedIn(false);

    // Redireciona para página de início
    navigate('/', { replace: true });
  }, [navigate]);

  /* ------------------------------
              EFEITOS
  ------------------------------- */

  // Efeito para atualizar o localStorage sempre que o estado para notícias pesquisadas
  // (searchedNews) mudar > pq a pesquisa pode ser feita deslogado, para persistência dos
  // dados ao recarregar a página e pq o backend não tem nada relacionado à pesquisa
  useEffect(() => {
    if (searchedNews) {
      localStorage.setItem('searchedNewsData', JSON.stringify(searchedNews));
    }
  }, [searchedNews]);

  // Efeito 'de montagem' e refresh: ciclo de autenticação + carregamento: autenticação,
  // fetch de dados do usuário, navegação e set dos estados globais
  // Só roda se estiver com backend ativo (com o token do usuário)
  useEffect(() => {
    // Para efeito não rodar em loop (em efeitos de bootstrap, erro ≠ sucesso parcial)
    // Impede o retry automático
    if (bootstrapFailedRef.current) return;

    // Flag para verificar se o componente está montado:
    // evita setState após desmontar
    let isMounted = true;

    // Verifica se há um JWT no armazenamento local, pela variável state
    // Se não houver, sai da função do efeito
    if (!tokenJwt) {
      setCheckingAuth(false); // sem token, login falso

      // Cleanup
      return () => {
        isMounted = false;
      };
    }

    // Fetch e set do dados + navegação
    // Define e executa função assíncrona
    (async () => {
      try {
        // Busca infos de perfil do usuário atual
        const userInfos = await getCurrentUser(tokenJwt);

        // Busca cards do usuário atual, na Api do banco de dados
        const userSavedCards = await getUserNews(tokenJwt);

        // Verifica se o componente ainda está montado
        if (!isMounted) return;

        // Permite login para o usuário
        setLoggedIn(true);

        // Seta variável de estado com dados do backend (user)
        setCurrentUser({
          email: userInfos.user.email,
          name: userInfos.user.name,
        });

        // Seta a variável de estado com dados do backend (articles)
        setSavedUserNews(userSavedCards);
      } catch (error) {
        console.error(
          `Erro no efeito 'de montagem', busca e set dos dados do usuário logado \n`,
          error,
        );

        if (!isMounted) return;

        // Se ocorrer erro de autorização (token inválido), desloga o usuário
        if (error.status === 401) {
          handleLogout();
          return;
        }

        // Para 429, 500, etc: mostra msg de erro em popup tooltip
        // Usa o mesmo hook implementado nos handlers para salvar e des-salvar artigos
        showApiError(error);
        // Evita loop de montagem, travando a ref ao defini-la como true para indicar
        // falha no bootstrap - impede tds as próximas tentativas, controla o ciclo de
        // vida da aplicação, quebrando definitivamente o loop
        // Se usado apenas o return: interrompe apenas a tentativa atual, permitindo o loop
        // O return controla uma execução e o bootstrapFailedRef controla o comportamento
        // futuro do app
        bootstrapFailedRef.current = true;
      } finally {
        // Se componente estiver montado, finaliza a verificação de autenticação
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    })();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [tokenJwt, handleLogout, showApiError]);

  // Efeito derivado, reagindo apenas aos estados relevantes: para sincronizar estados
  // derivados (merge de searchedNews com savedUserNews) e adicionar a info 'isSaved' aos
  // artigos (para o ícone do botão 'salvar', no NewsCard)
  useEffect(() => {
    // Se não estiver logado, não executa
    if (!loggedIn) return;

    // Verificação de segurança para erro de leitura de searchedNews.articles > null
    // Com o same dentro do setState, o efeito só altera o estado quando os articles
    // realmente mudam
    if (!searchedNews || !Array.isArray(searchedNews.articles)) return;

    function mergeNewsLists() {
      // Lista de notícias da pesquisa > searchedNews.articles
      // Lista de notícias salvas do usuário atual > savedUserNews.userArticles

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

  /* ------------------------------
              HANDLERS
  ------------------------------- */

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

  // Signup e signin sem try/catch para lançar erro, já será lançado naturalmente pela
  // função chamada em cada um (register() ou login()), subindo para o useFormSubmit
  // do seu componente, essencial para o funcionamento de onSuccess e onError

  // Handler: signup
  const handleRegistration = async (newUserData) => {
    await register(newUserData);
  };

  // Handler: signin
  const handleLogin = async (userData) => {
    const loggedUser = await login(userData);

    if (loggedUser.token) {
      // Antes de logar, limpa dados anteriores de perfil de usuário
      // Para reforço, pq a limpeza tbm é aplicada no logout
      setCurrentUser({
        email: '',
        name: '',
      });
      setSavedUserNews({ userArticles: [] });

      // Seta token: variável de estado + armazenamento local
      setAndStorageToken(loggedUser.token, setTokenJwt);
    }

    // Login apenas ajusta token, focado na autenticação
    // Dados de perfil apenas no efeito de montagem
    // A lógica de carregamento de perfil pode ser aplicada tanto no login quanto no
    // refresh da página
  };

  // Salvar e des-salvar artigos: com o backend ativo, sem armazenamento local
  // Os cards são salvos todos na Api, de onde vêm os dados para cada usuário

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

      // POST para o banco de dados
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
        // DELETE para o banco de dados
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
    [showApiError, tokenJwt],
  );

  /* ------------------------------
                JSX
  ------------------------------- */

  // Enquanto estiver verificando o login, não renderiza o app,
  // renderiza uma tela de carregamento
  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <p className="loading-text">Carregando...</p>
      </div>
    );
  }

  // Depois que verificar, renderiza o app normalmente
  return (
    // Provedores de contexto: compartilham infos de login, infos do usuário atual e
    // infos de popups
    <AuthContext.Provider
      value={{
        loggedIn, // booleano de estado: status de login
        handleRegistration,
        handleLogin,
        handleLogout,
      }}
    >
      <CurrentUserContext.Provider
        value={{ currentUser }} // obj de estado: dados do usuário atual
      >
        <PopupsContext.Provider
          value={{ handleOpenPopup, handleClosePopup }} // handlers de abertura e fechamento
        >
          <div className="page">
            {/* O Header é renderizado estando deslogado ou logado, em '/' */}

            {/* O SavedNewsHeader precisa ser renderizado caso o usuário esteja logado e
          acesse '/saved-news' */}

            {loggedIn && location.pathname === '/saved-news' ? (
              <SavedNewsHeader mobile={mobile} setMobile={setMobile} />
            ) : (
              <Header mobile={mobile} setMobile={setMobile} />
            )}

            <main className="main page__main">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <SearchMain
                        setIsSearchLoading={setIsSearchLoading}
                        handleGetNews={handleGetNews}
                        setSearchedNews={setSearchedNews}
                      />

                      {/* Enquanto a solicitação de pesquisa estiver em loading, renderiza
                    o Preloader */}

                      {isSearchLoading && <Preloader />}

                      {/* Se não estiver em loading e não houver resultados para a pesquisa
                    realizada, renderiza o NothingFound */}

                      {!isSearchLoading &&
                        searchedNews.status === 'ok' &&
                        searchedNews.articles.length === 0 && <NothingFound />}

                      {/* Se não estiver em loading e houver resultados ou se não estiver em
                    loading e o status for 'error', renderiza o NewsCardList com o devido
                    conteúdo */}

                      {!isSearchLoading &&
                        (searchedNews.articles.length > 0 ||
                          searchedNews.status === 'error') && (
                          <NewsCardList
                            searchedNews={searchedNews}
                            handleSaveCard={handleSaveCard}
                            memoizedHandleUnsave={memoizedHandleUnsave}
                            savedUserNews={savedUserNews}
                          />
                        )}

                      <About />
                    </>
                  }
                />

                <Route
                  path="/saved-news"
                  element={
                    <ProtectedRoute>
                      <SavedNewsCardList
                        savedUserNews={savedUserNews}
                        memoizedHandleUnsave={memoizedHandleUnsave}
                      />
                    </ProtectedRoute>
                  }
                />

                {/* Para qlqr outra rota que não exista no app, redireciona para página principal */}

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {/* Se o popup não for nulo, algum dos componentes será renderizado na tela:
          Signup, Signin, SignupTooltip, SearchTooltip ou ApiErrorTooltip */}

            {popup && (
              <Popups popup={popup} type={popup.type}>
                {popup.children}
              </Popups>
            )}
          </div>
        </PopupsContext.Provider>
      </CurrentUserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
