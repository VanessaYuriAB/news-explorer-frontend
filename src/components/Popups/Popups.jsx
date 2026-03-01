import { useEffect, useRef, useContext } from 'react';
import PopupsContext from '../../contexts/PopupsContext';
import './Popups.css';

function Popups(props) {
  // Desestruturação do objeto passado como props, onde children é o conteúdo de popup
  // que pode ser Signin ou Signup, configurado no componente de abertura
  const { popup, children, type } = props;

  // Contexto de popups, extraindo handler
  const { handleClosePopup } = useContext(PopupsContext);

  // Ref para encapsulamento de children: para fechamento do popup por clique fora da
  // caixa
  const childrenPopupRef = useRef(null);

  // Fechamento do popup pela tecla 'Esc', ativado sempre que o popup for aberto
  useEffect(() => {
    const handleEscClose = (evt) => {
      // Só renderiza <Popups /> qdo popup && (...), então não é preciso verificar popup
      // Se o popup estiver aberto e a tecla pressionada for a esc, o popup fecha
      // escape: esc

      if (evt.code === 'Escape') handleClosePopup();
    };

    document.addEventListener('keydown', handleEscClose); // adiciona o evento em document >
    // escuta globalmente → essencial para capturar a tecla Esc mesmo sem foco

    // Wipe function: função de limpeza
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      // remove o listener ao desmontar ou ao mudar dependências → evita múltiplas inscrições
      // ou vazamentos
    };
  }, [popup, handleClosePopup]); // aciona sempre que o popup for aberto e limpa sempre que fechar

  // Handler: fechamento por clique fora
  const handleClickClose = (evt) => {
    const childrenContent = childrenPopupRef.current;
    const clickOutside =
      childrenContent && !childrenContent.contains(evt.target);

    if (clickOutside) handleClosePopup(); // se children estiver aberto e o click não for em
    // children, fecha o popup
  };

  return (
    /* Modificadores, para ajuste da margem superior para cada tipo de janela modal */
    <div
      className={`popup ${type === 'signin' ? 'popup_signin' : ''} ${type === 'signup' ? 'popup_signup' : ''} ${type === 'tooltip' ? 'popup_tooltip' : ''}`}
      onClick={handleClickClose}
    >
      {/* Para configuração do fechamento dos popups por clique na tela */}
      <div className="popup__content " ref={childrenPopupRef}>
        {/* Para posicionamento do botão fechar */}
        <div className="popup__position-btn">
          {children}
          {/* Para a faixa do botão fechar em telas mobile */}
          <div className="popup_ribbon-btn">
            <button
              className="popup__close-btn"
              type="button"
              onClick={handleClosePopup}
              aria-label='Ícone "X" para fechar'
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popups;
