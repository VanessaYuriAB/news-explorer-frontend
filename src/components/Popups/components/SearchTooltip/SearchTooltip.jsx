import { useContext } from 'react';
import AuthContext from '../../../../contexts/AuthContext';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';
import './SearchTooltip.css';

function SearchTooltip() {
  const { loggedIn } = useContext(AuthContext);
  const { currentUser } = useContext(CurrentUserContext);

  // Em React, o padrão é retornar null (ou nem renderizar) > verificação com &&
  // para renderizar apenas caso true > e não com ?

  return (
    <div className="search__tooltip">
      {loggedIn && (
        <h2 className="search__tooltip-title">{currentUser.name},</h2>
      )}
      <p className="search__tooltip-text">
        Por favor, insira uma palavra-chave.
      </p>
    </div>
  );
}

export default SearchTooltip;
