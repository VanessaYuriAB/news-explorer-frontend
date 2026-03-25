import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import useUser from '../../../../hooks/useUser';
import newsExplorerBlack from '../../../../assets/news-explorer-logo-black.svg';
import lineHeaderGray from '../../../../assets/line-header-gray.svg';
import btnOut from '../../../../assets/btn-out.svg';
import './ForMobileSavedNewsHeaderAndNav.css';

function ForMobileSavedNewsHeaderAndNav({ setMobile }) {
  const { handleLogout } = useAuth();
  const { currentUser } = useUser();

  // A função getNavLinkClass é nativa do componente <NavLink>
  // Aceita um objeto como um parâmetro, que possui uma propriedade,
  // isActive, que é verdadeira se o link estiver ativo
  const getNewsNavLinkClass = ({ isActive }) => {
    return (
      'header-news-mobile__link' +
      (isActive ? ' header-news-mobile__link_active' : '')
    );
  };

  return (
    <div className="header-news-mobile">
      <div className="header-news-mobile__content">
        <div className="header-news-mobile__box">
          <div className="header-news-mobile__logo-box">
            <Link
              className="header-news-mobile__logo-link"
              to="/"
              aria-label="Logo do site, é um link: navegar para a página inicial."
            >
              <img
                className="header-news-mobile__logo-img"
                src={newsExplorerBlack}
                alt="Logo, escrito NewsExplorer em branco."
              />
            </Link>
            <button
              className="header-news-mobile__logo-menu"
              type="button"
              onClick={() => setMobile(false)}
              aria-label="Ícone com traços, um abaixo do outro, na horizontal: abrir menu"
            ></button>
          </div>
        </div>
        <img
          className="header-news-mobile__line"
          src={lineHeaderGray}
          alt="Linha de divisão do cabeçalho, em branco"
        />

        <nav className="header-news-mobile__nav">
          {/* Se o link estiver ativo, a classe header-news-mobile__link_active será
          adicionada à lista de classes. */}

          <div className="header-news-mobile__links">
            <NavLink className={getNewsNavLinkClass} to="/">
              Início
            </NavLink>
            <NavLink className={getNewsNavLinkClass} to="/saved-news">
              Artigos salvos
            </NavLink>
          </div>
          <button
            className="header-news-mobile__btn"
            type="button"
            onClick={handleLogout}
            aria-label="Deslogar usuário"
          >
            <p className="header-news-mobile__btn-text">{currentUser.name}</p>
            <img
              className="header-news-mobile__btn-out"
              src={btnOut}
              alt="Ícone simbolizando saída/logout."
            />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default ForMobileSavedNewsHeaderAndNav;
