import { useContext, useState, useEffect } from 'react';
import { useFormAndValidationWithReset } from '../../../../hooks/useFormAndValidationWithReset';
import AuthContext from '../../../../contexts/AuthContext';
import PopupsContext from '../../../../contexts/PopupsContext';
import useFormSubmit from '../../../../hooks/useFormSubmit';
import useOpenedPopups from '../../../../hooks/useOpenedPopups';
import './Signin.css';

function Signin() {
  // Desestruturação para extração do retorno do hook para controle do formulário com
  // validação e reset da validação
  const { values, handleChange, errors, isFormValid, resetForm } =
    useFormAndValidationWithReset();

  // Variável de estado: controle do span para msg de erro de login
  const [serverError, setServerError] = useState('');

  // Efeito para reset do span de erro de login, usando a função de limpeza (ao
  // desmontar componente)
  // React recomenda evitar efeitos de inicialização que apenas setam estado, ao invés
  // disso, usar o cleanup para resetar
  // Isso é aceito sem warnings porque: não dispara renderização no mount, só acontece
  // no unmount e é o padrão recomendado para limpar estados em componentes de formulário
  // exibidos dentro de modais/popups
  useEffect(() => {
    return () => {
      setServerError('');
    };
  }, []);

  // Contexto de popups, extraindo handlers
  const { handleOpenPopup, handleClosePopup } = useContext(PopupsContext);

  // Extração de openSignin e openSignupTooltip
  const { openSignup } = useOpenedPopups({
    handleOpenPopup,
  });

  // Contexto de autenticação, extraindo set do estado de login
  const { handleLogin } = useContext(AuthContext);

  // Envio do formulário com hook personalizado (inclui preventDefault,
  // loading, onSubmit, onSuccess e onError)
  const { handleSubmit, isLoading } = useFormSubmit(
    // onSubmit
    () => {
      // Envia dados de login e retorna a Promisse
      return handleLogin({ email: values.email, password: values.password });
    },
    // onSuccess
    () => {
      // Limpa inputs (campos), erros e status da validação
      resetForm();
      // Fecha o popup
      handleClosePopup();
    },
    (error) => {
      console.error(
        'Erro ao enviar formulário de login (handleLogin) \n',
        error,
      );
      // Renderiza a msg de erro de login no popup, no span acima do botão
      // Erro de autorização (401 Unauthorized), erro de Rate Limit (429)
      // ou erro interno no servidor (500 Internal Server) - tds retornados
      // pela Api do backend
      setServerError(error.message);
    },
  );

  return (
    <form className="popup__signin" onSubmit={handleSubmit} noValidate>
      <h2 className="popup__signin-title">Entrar</h2>
      <label className="popup__signin-label" htmlFor="email">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className={`popup__signin-input ${errors.email ? 'popup__signin-input_type_error' : ''}`}
        placeholder="Insira e-mail"
        pattern="^[a-zA-Z0-9_.\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        title="E-mail válido: contento apenas letras, números, sublinhados, pontos ou hífens."
        value={values.email}
        onChange={handleChange}
        aria-label="Inserir e-mail cadastrado"
        required
      ></input>
      <span className="popup__signin-span email-span">{errors.email}</span>
      <label className="popup__signin-label" htmlFor="password">
        Senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className={`popup__signin-input ${errors.password ? 'popup__signin-input_type_error' : ''}`}
        placeholder="Insira a senha"
        pattern="^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$"
        title="Senha: mínimo 8 caracteres - pelo menos, uma letra minúscula e um número (maiúsculas tbm são permitidas)."
        value={values.password}
        onChange={handleChange}
        aria-label="Inserir senha cadastrada"
        required
      ></input>
      <span className="popup__signin-span password-span">
        {errors.password}
      </span>
      <span
        className={`popup__signin-span ${serverError ? 'popup__signin-span_active' : ''}`}
        role="alert" /* atributo de acessibilidade (ARIA) usado para avisar tecnologias
        assistivas — como leitores de tela — que um conteúdo importante mudou na página
        e precisa ser anunciado imediatamente: leitores de tela interrompem o que estavam
        falando e anunciam a nova mensagem imediatamente, sem que o usuário precise focar
        ou navegar até o elemento; essencial para usuários com deficiência visual ou pessoas
        que utilizam navegação assistida */
      >
        {serverError}
      </span>
      <button
        className={`popup__signin-btn ${isFormValid ? '' : 'popup__signin-btn_disabled'}`}
        type="submit"
        disabled={!isFormValid}
        /* Se o formulário não estiver válido (false), botão desativo */
        /* Se o formulário estiver válido (true), botão ativado */
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
      <p className="popup__signin-plink">
        {/* O espaço depois do texto é proposital para o espaçamento da frase inteira */}
        ou {/* Uso da tag button, e não Link, pq o clique não muda de rota */}
        <button
          className="popup__signin-link"
          type="button"
          onClick={() => openSignup()}
        >
          Inscreva-se
        </button>
      </p>

      {/* Signup será renderizado por Popups em App */}
    </form>
  );
}

export default Signin;
