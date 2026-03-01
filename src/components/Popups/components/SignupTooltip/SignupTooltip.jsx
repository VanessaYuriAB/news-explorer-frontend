import { useContext } from 'react';
import PopupsContext from '../../../../contexts/PopupsContext';
import useOpenedPopups from '../../../../hooks/useOpenedPopups';
import './SignupTooltip.css';

function SignupTooltip() {
  // Contexto de popups, extraindo handler
  const { handleOpenPopup } = useContext(PopupsContext);

  // Extração de openSignin e openSignupTooltip
  const { openSignin } = useOpenedPopups({
    handleOpenPopup,
  });

  return (
    <div className="popup__tooltip">
      <h2 className="popup__tooltip-title">Cadastro concluído com sucesso!</h2>
      <button
        className="popup__tooltip-link"
        type="button"
        onClick={() => openSignin()}
      >
        Entrar
      </button>

      {/* Signin será renderizado por Popups em App */}
    </div>
  );
}

export default SignupTooltip;
