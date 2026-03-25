import usePopups from '../../../../hooks/usePopups';
import useOpenedPopups from '../../../../hooks/useOpenedPopups';
import './SignupTooltip.css';

function SignupTooltip() {
  const { handleOpenPopup } = usePopups();

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
