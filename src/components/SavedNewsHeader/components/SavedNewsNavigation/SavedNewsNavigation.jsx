import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../../../../contexts/AuthContext';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';
import btnOutBlack from '../../../../assets/btn-out-black.svg';
import './SavedNewsNavigation.css';

function SavedNewsNavigation() {
  const { handleLogout } = useContext(AuthContext);

  const { currentUser } = useContext(CurrentUserContext);

  // A função getNavLinkClass é nativa do componente <NavLink>
  // Aceita um objeto como um parâmetro, que possui uma propriedade,
  // isActive, que é verdadeira se o link estiver ativo
  const getNewsNavLinkClass = ({ isActive }) => {
    return 'header-news__link' + (isActive ? ' header-news__link_active' : '');
  };

  return (
    <nav className="header-news__nav">
      {/* Se o link estiver ativo, a classe header-news__link_active será adicionada à lista
      de classes. */}

      <div className="header-news__links">
        <NavLink className={getNewsNavLinkClass} to="/">
          Início
        </NavLink>
        <NavLink className={getNewsNavLinkClass} to="/saved-news">
          Artigos salvos
        </NavLink>
      </div>
      <button
        className="header-news__btn"
        type="button"
        onClick={handleLogout}
        aria-label="Deslogar usuário"
      >
        <p className="header-news__btn-text">{currentUser.name}</p>
        <img
          className="header-news__btn-out"
          src={btnOutBlack}
          alt="Ícone simbolizando saída/logout."
        />
      </button>
    </nav>
  );
}

export default SavedNewsNavigation;
