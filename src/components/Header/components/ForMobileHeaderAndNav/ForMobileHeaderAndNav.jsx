import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../../../../contexts/AuthContext';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';
import PopupsContext from '../../../../contexts/PopupsContext';
import useOpenedPopups from '../../../../hooks/useOpenedPopups';
import newsExplorer from '../../../../assets/news-explorer-logo.svg';
import lineHeader from '../../../../assets/line-header.svg';
import btnOut from '../../../../assets/btn-out.svg';
import './ForMobileHeaderAndNav.css';

function ForMobileHeaderAndNav({ setMobile }) {
  // Contexto de autenticação, extraindo estado de login e handle para logout
  const { loggedIn, handleLogout } = useContext(AuthContext);

  // Contexto do usuário atual: assina o contexto CurrentUserContext
  const { currentUser } = useContext(CurrentUserContext);

  // Contexto de popups, extaindo handler
  const { handleOpenPopup } = useContext(PopupsContext);

  // Hook de abertura de popups, extraindo openSignin
  const { openSignin } = useOpenedPopups({ handleOpenPopup });

  // As funções getNavLinkClass e getNavLinkClassOut são nativas do componente <NavLink>
  // Aceitam um objeto como parâmetro, que possui uma propriedade, isActive, que é
  // verdadeira se o link estiver ativo
  const getNavLinkClass = ({ isActive }) => {
    return (
      'header-mobile__link' + (isActive ? ' header-mobile__link_active' : '')
    );
  };

  const getNavLinkClassOut = ({ isActive }) => {
    return (
      'header-mobile__link header-mobile__link_out' +
      (isActive ? ' header-mobile__link_out_active' : '')
    );
  };

  return (
    <div className="header-mobile">
      <div className="header-mobile__content">
        <div className="header-mobile__box">
          <div className="header-mobile__logo-box">
            <Link
              className="header-mobile__logo-link"
              to="/"
              aria-label="Logo do site, é um link: navegar para a página inicial."
            >
              <img
                className="header-mobile__logo-img"
                src={newsExplorer}
                alt="Logo, escrito NewsExplorer em branco."
              />
            </Link>
            <button
              className="header-mobile__logo-menu"
              type="button"
              onClick={() => setMobile(false)}
              aria-label="Ícone com traços, um abaixo do outro, na horizontal: abrir menu"
            ></button>
          </div>
        </div>
        <img
          className="header-mobile__line"
          src={lineHeader}
          alt="Linha de divisão do cabeçalho, em branco"
        />

        <nav className="header-mobile__nav">
          {/* Se o link estiver ativo, as classes header-mobile__link_active e header-mobile__link_out_active
          serão adicionadas às listas de classes correspondentes */}

          {/* Se estiver logado, renderiza Navigation; se não, renderiza Navigation-mobile _out */}

          {loggedIn ? (
            <>
              <div className="header-mobile__links">
                <NavLink className={getNavLinkClass} to="/">
                  Início
                </NavLink>
                <NavLink className={getNavLinkClass} to="/saved-news">
                  Artigos salvos
                </NavLink>
              </div>
              <button
                className="header-mobile__btn"
                type="button"
                onClick={handleLogout}
                aria-label="Deslogar usuário"
              >
                <p className="header-mobile__btn-text">{currentUser.name}</p>
                <img
                  className="header-mobile__btn-out"
                  src={btnOut}
                  alt="Ícone simbolizando saída/logout."
                />
              </button>
            </>
          ) : (
            <>
              <div className="header-mobile__links header-mobile__links_out">
                <NavLink className={getNavLinkClassOut} to="/">
                  Início
                </NavLink>
              </div>
              <button
                className="header-mobile__btn header-mobile__btn_out"
                type="button"
                onClick={() => openSignin()}
                aria-label="Logar usuário"
              >
                <p className="header-mobile__btn-text header-mobile__btn-text_out">
                  Entrar
                </p>
              </button>
            </>
          )}

          {/* Signin será renderizado por Popups em App */}
        </nav>
      </div>
    </div>
  );
}

export default ForMobileHeaderAndNav;
