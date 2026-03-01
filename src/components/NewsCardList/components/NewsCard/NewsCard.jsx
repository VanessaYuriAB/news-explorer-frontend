import React, { useContext } from 'react';
import AuthContext from '../../../../contexts/AuthContext';
import PopupsContext from '../../../../contexts/PopupsContext';
import useOpenedPopups from '../../../../hooks/useOpenedPopups';
import useFormattedDateBR from '../../../../hooks/useformattedDateBR';
import imgIndisponivel from '../../../../assets/img-indisponivel.jpg';
import './NewsCard.css';

function NewsCard({
  searchedNewsCard,
  handleSaveCard,
  memoizedHandleUnsave,
  savedUserNews,
}) {
  // Desestruturação de propriedades do obj para cada notícia, dentro do array de
  // artigos da resposta bem-sucedida da NewsApi
  // Os nomes das propriedades são definidas pela News Api
  const { source, title, description, url, urlToImage, publishedAt, isSaved } =
    searchedNewsCard;

  // Contexto de autenticação, extraindo estado de login
  const { loggedIn } = useContext(AuthContext);

  // Contexto de popups, extraindo handler
  const { handleOpenPopup } = useContext(PopupsContext);

  // Hook de abertura de popups: extração de openSignup
  const { openSignup } = useOpenedPopups({
    handleOpenPopup,
  });

  // Verificação para classe do botão 'salvar': a classe 'new-card__btn_active'
  // será aplicada para mostrar que o botão está no status "salvo"
  const getCardBtnClassName = `new-card__btn ${isSaved === true ? 'new-card__btn_active' : ''}`;

  // Reformatação da data (publishedAt) com hook personalizado
  const formattedDateBR = useFormattedDateBR(publishedAt);

  return (
    <li className="new-card">
      <article className="new-card__article">
        <figure className="new-card__figure">
          <img
            className="new-card__img"
            src={urlToImage ? urlToImage : imgIndisponivel}
            alt={`Imagem do artigo: ${title ? title : 'descrição indisponível'}`}
          />
        </figure>

        {/* Tooltip de aviso do botão implementado via CSS, com :hover::before (usando
            regra 'content') */}

        {/* Condição para renderização de versões para o tooltip do botão: versão logada e
        versão deslogada */}

        {loggedIn ? (
          /* Logado */
          <>
            <button
              className={getCardBtnClassName}
              type="button"
              aria-label={
                isSaved === true ? 'Remover dos salvos' : 'Salvar notícia'
              }
              onClick={() => {
                // Condiciona salvar e des-salvar
                // Salva passando o obj completo do artigo
                // Des-salva passando apenas o ID
                if (isSaved === false) {
                  handleSaveCard(searchedNewsCard);
                } else {
                  // Busca o card em questão pelo link da url
                  // .link na coleção do banco de dados e .url na lista vinda da NewsApi
                  const cardToUnsave = savedUserNews.userArticles.filter(
                    (card) => {
                      return card.link === searchedNewsCard.url;
                    },
                  );
                  // Busca o _id do card a ser deletado
                  // Pq o obj vindo da NewsApi não possui a propriedade
                  // Apenas o salvo no Mongo DB
                  // cardToUnsave é um array com um objeto
                  const cardId = cardToUnsave[0]._id;
                  // Passa o ID do card a ser removido
                  memoizedHandleUnsave(cardId);
                }
              }}
            ></button>
          </>
        ) : (
          /* Deslogado */
          <>
            <button
              className="new-card__btn new-card__btn_out"
              type="button"
              aria-label="Logar para poder salvar"
              onClick={() => {
                openSignup();
              }}
            ></button>
          </>
        )}

        <div className="new-card__infos">
          <time className="new-card__date" dateTime={publishedAt}>
            {`${formattedDateBR}`}
          </time>

          {/* Tag __title-link apenas para envolver o títutlo com link e redirecionar
          para a página da notícia */}

          <a
            className="new-card__title-link"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="new-card__title">{`${title ? title : 'Título indisponível'}`}</h3>
          </a>

          <p className="new-card__text">{`${description ? description : 'Descrição indisponível'}`}</p>
          <cite className="new-card__source">{`${source.name ? source.name : 'Fonte indisponível'}`}</cite>
        </div>
      </article>
    </li>
  );
}

// Exporta envolto em memo
// Evita renderizações desnecessárias de componentes funcionais, memoriza o resultado da
// renderização e só re-renderiza se as props mudarem
// Os cartões que não tiveram suas props alteradas não serão re-renderizados, apenas os
// novos a serem mostrados
export default React.memo(NewsCard);
