import NewsCard from './components/NewsCard/NewsCard';
import AuthContext from '../../contexts/AuthContext';
import { useContext, useCallback, useState } from 'react';
import './NewsCardList.css';

function NewsCardList({
  searchedNews,
  handleSaveCard,
  memoizedHandleUnsave,
  savedUserNews,
}) {
  // Contexto de autenticação, extraindo estado de login
  const { loggedIn } = useContext(AuthContext);

  // Variável de estado: controle da qtdd de cards renderizados, iniciando com apenas três
  const [visibleCards, setVisibleCards] = useState(3);

  // Memoriza a função passada ao NewsCard, para não recriar a cada render
  // Em conjunto com React.memo() e useMemo() para os dados
  const memoizedHandleSave = useCallback(
    (card) => handleSaveCard(card),
    [handleSaveCard],
  );

  // Handler: mostrar mais três cartões
  const handleShowMore = () => {
    setVisibleCards((prev) => {
      return prev + 3;
    });
  };

  // Se a resposta de NewsApi for erro, renderiza a msg de erro
  // Se for o obj com artigos, renderiza os cartões

  if (searchedNews.status === 'error') {
    return (
      <section className="searched-news main__searched-news">
        <p className="searched-news__msg-error">
          Desculpe, algo deu errado durante a solicitação. Pode haver um
          problema de conexão ou o servidor pode estar inativo. Por favor, tente
          novamente mais tarde.
        </p>
      </section>
    );
  }

  if (searchedNews.articles.length > 0) {
    return (
      <section className="searched-news main__searched-news">
        <h2 className="searched-news__title">Procurar resultados</h2>
        <div
          /* Adiciona uma classe para remover o padding-bottom da lista de cards quando
          o botão não estiver renderizado */
          className={`searched-news__list ${visibleCards >= 100 ? 'searched-news__list_nobtn' : ''}`}
        >
          {/* Renderiza cards via .map, de acordo com a lista do array do resultado
          da pesquisa */}

          <ul className="searched-news__cards">
            {searchedNews.articles
              .slice(0, visibleCards) // copia uma parte do vetor e retorna como um novo vetor
              .map((searchedNewsCard) => (
                /* Aqui, o return é necessário e está implícito: arrow function com
                parênteses, retornando JSX */
                <NewsCard
                  key={
                    searchedNewsCard.url
                  } /* A API da NewsAPI não fornece _id, então foi aplicado url, por ser
                  algo único */
                  searchedNewsCard={searchedNewsCard}
                  handleSaveCard={memoizedHandleSave} // valor memorizado
                  memoizedHandleUnsave={memoizedHandleUnsave}
                  savedUserNews={savedUserNews}
                />
              ))}
          </ul>
        </div>

        {/* Condição para renderização do botão, apenas quando não houverem mais cartões
        a serem exibidos > Como a conta da NewsApi (gratuita) permite apenas 100 articles,
        a condição está definida desta forma, mas existe a propriedade totalResults para
        renderização do total de artigos pesquisados */}
        {/* {visibleCards < searchedNews.totalResults && ( */}
        {visibleCards < searchedNews.articles.length && (
          <button
            /* Condição para renderização de versões para o botão: logado e deslogado */
            className={`searched-news__btn ${!loggedIn ? 'searched-news__btn_out' : ''} `}
            type="button"
            onClick={handleShowMore}
          >
            Mostrar mais
          </button>
        )}
      </section>
    );
  }
}

export default NewsCardList;
