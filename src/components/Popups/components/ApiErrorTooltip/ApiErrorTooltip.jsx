import useUser from '../../../../hooks/useUser';
import './ApiErrorTooltip.css';

// Componente para exibir erros ao salvar e des-salvar artigos, também para setar
// infos do usuário no efeito de montagem e refresh
// Registro e login são exibidos no próprio componente do form

function ApiErrorTooltip({ message }) {
  const { currentUser } = useUser();

  return (
    <div className="popup__error">
      <h2 className="popup__error-user">
        {currentUser.name ? `${currentUser.name},` : 'Algo deu errado:'}
      </h2>
      <p className="popup__error-message">{message}</p>
    </div>
  );
}

export default ApiErrorTooltip;
