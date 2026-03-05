import { NavLink, useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const location = useLocation();

  return (
    <footer
      /* Se estiver em '/', desloca o Footer 80px para cima; caso contrário, não - devido ao posicionamento do Header sobre SearchMain */
      className={
        location.pathname === '/'
          ? `footer page__footer`
          : `footer page__footer page__footer_saved-news`
      }
    >
      <p className="footer__copyright">
        &copy; 2026 News Explorer, desenvolvido por Vanessa
      </p>

      <div className="footer__navs">
        {/* Navegação principal */}
        <nav className="footer__nav footer__nav_main">
          <ul className="footer__list footer__list_main">
            <li className="footer__item footer__item_home">
              <NavLink
                /* isActive: suporte nativo da NavLink para estado ativo da rota */
                className={({ isActive }) =>
                  `footer__link ${isActive ? 'footer__link_active' : ''}`
                }
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Início
              </NavLink>
            </li>

            <li className="footer__item footer__item_triple">
              <a
                className="footer__link"
                href="https://tripleten.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TripleTen
              </a>
            </li>
          </ul>
        </nav>

        {/* Navegação secundária (github/social) */}
        <nav className="footer__nav footer__nav_social">
          <ul className="footer__list footer__list_social">
            <li className="footer__item footer__item_gh">
              <a
                className="footer__link footer__link_gh"
                href="https://github.com/VanessaYuriAB/new-explorer-frontend/tree/main"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>

            <li className="footer__item footer__item_fb">
              <a
                className="footer__link footer__link_fb"
                href="https://www.facebook.com/vanessayuri.alvesdebrito"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
