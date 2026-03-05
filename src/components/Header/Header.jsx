import { Link } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import lineHeader from '../../assets/line-header.svg';
import ForMobileHeaderAndNav from './components/ForMobileHeaderAndNav/ForMobileHeaderAndNav';
import newsExplorer from '../../assets/news-explorer-logo.svg';
import './Header.css';

function Header({ mobile, setMobile }) {
  return (
    <header className="header page__header">
      <div className="header__box">
        {/* __logo-box adicionado para configuração do layout de menu para mobile */}
        <div className="header__logo-box">
          <Link
            className="header__logo-link"
            to="/"
            aria-label="Logo do site, é um link: navegar para a página inicial."
          >
            <img
              className="header__logo-img"
              src={newsExplorer}
              alt="Logo, escrito NewsExplorer em branco."
            />
          </Link>
          <button
            className="header__logo-menu"
            type="button"
            onClick={() => setMobile(true)}
            aria-label="Ícone com traços, um abaixo do outro, na horizontal: abrir menu"
          ></button>
        </div>
        <Navigation />
      </div>
      <img
        className="header__line"
        src={lineHeader}
        alt="Linha de divisão do cabeçalho, em branco"
      />

      {mobile && <ForMobileHeaderAndNav setMobile={setMobile} />}
    </header>
  );
}

export default Header;
