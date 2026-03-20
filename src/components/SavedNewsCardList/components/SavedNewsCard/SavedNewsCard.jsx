import React from 'react';
import useNews from '../../../../hooks/useNews';
import useFormattedDateBR from '../../../../hooks/useFormattedDateBR';
import imgIndisponivel from '../../../../assets/img-indisponivel.jpg';
import './SavedNewsCard.css';

function SavedNewsCard({ savedCard }) {
  // Desestruturação das propriedades de cada card salvo no banco de dados (com backend
  // ativo) > o nome das propriedades é definido no schema do modelo no backend
  const { source, title, text, link, image, date, keyword } = savedCard;

  const { name } = source;

  // Consumo de NewsContext
  const { memoizedHandleUnsave } = useNews();

  // Reformatação da data (vem de publishedAt, com o formato da News Api) com hook
  // personalizado
  const formattedDateBR = useFormattedDateBR(date);

  // Apenas a primeira palavra da tag
  const firstTag = keyword.split(' ')[0];

  return (
    <li className="saved-card">
      <article className="saved-card__article">
        <figure className="saved-card__figure">
          <img
            className="saved-card__img"
            src={image ? image : imgIndisponivel}
            alt={`Imagem do artigo: ${title ? title : 'descrição indisponível'}`}
          />
          <figcaption className="saved-card__tag">{`${firstTag}`}</figcaption>
        </figure>

        {/* Tooltip de aviso da lixeira implementado via CSS, com :hover::before (usando
        regra 'content') */}

        <button
          type="button"
          className="saved-card__btn"
          onClick={() => memoizedHandleUnsave(savedCard._id)}
          aria-label="Remover dos salvos"
        ></button>

        <div className="saved-card__infos">
          <time className="saved-card__date" dateTime={date}>
            {`${formattedDateBR}`}
          </time>

          {/* Tag __title-link apenas para envolver o títutlo com link e redirecionar
          para a página da notícia */}

          <a
            className="saved-card__title-link"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="saved-card__title">
              {`${title ? title : 'Título indisponível'}`}
            </h3>
          </a>

          <p className="saved-card__text">
            {`${text ? text : 'Descrição indisponível'}`}
          </p>
          <cite className="saved-card__source">{`${name ? name : 'Fonte indisponível'}`}</cite>
        </div>
      </article>
    </li>
  );
}

// Exporta envolto em memo
export default React.memo(SavedNewsCard);
