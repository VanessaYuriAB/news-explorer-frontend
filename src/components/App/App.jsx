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
import Popups from '../Popups/Popups';
import useAuth from '../../hooks/useAuth';
import usePopups from '../../hooks/usePopups';
import useNews from '../../hooks/useNews';
import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';

function App() {
  // Hook de Router
  const location = useLocation();

  // Estado
  const [mobile, setMobile] = useState(false);

  // Consumo de AuthContext
  const { checkingAuth, loggedIn } = useAuth();

  // Consumo de PopupsContext
  const { popup } = usePopups();

  // Consumo de NewsProvider
  const { isSearchLoading, searchedNews } = useNews();

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
                <SearchMain />

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
                    searchedNews.status === 'error') && <NewsCardList />}

                <About />
              </>
            }
          />

          <Route
            path="/saved-news"
            element={
              <ProtectedRoute>
                <SavedNewsCardList />
              </ProtectedRoute>
            }
          />

          {/* Para qlqr outra rota que não exista no app, redireciona para página
              principal */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Se o popup não for nulo, algum dos componentes será renderizado na tela: Signup,
      Signin, SignupTooltip, SearchTooltip ou ApiErrorTooltip */}

      {popup && <Popups>{popup.children}</Popups>}
    </div>
  );
}

export default App;
