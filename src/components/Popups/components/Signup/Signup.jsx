import { useContext, useState, useEffect } from 'react';
import { useFormAndValidationWithReset } from '../../../../hooks/useFormAndValidationWithReset';
import AuthContext from '../../../../contexts/AuthContext';
import PopupsContext from '../../../../contexts/PopupsContext';
import useFormSubmit from '../../../../hooks/useFormSubmit';
import useOpenedPopups from '../../../../hooks/useOpenedPopups';
import './Signup.css';

function Signup() {
  // Hook para controle do formulário com validação e reset da validação
  const { values, handleChange, errors, isFormValid, resetForm } =
    useFormAndValidationWithReset();

  // Variável de estado: controle do span para msg de erro de inscrição
  const [serverError, setServerError] = useState('');

  // Efeito para reset do span de erro de incrição, usando a função de limpeza (ao
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

  const { handleOpenPopup } = useContext(PopupsContext);

  const { openSignin, openSignupTooltip } = useOpenedPopups({
    handleOpenPopup,
  });

  const { handleRegistration } = useContext(AuthContext);

  // Hook de envio de formulário (inclui preventDefault,loading, onSubmit, onSuccess e
  // onError)
  const { handleSubmit, isLoading } = useFormSubmit(
    // onSubmit
    () => {
      return handleRegistration({
        email: values.email,
        password: values.password,
        name: values.name,
      });
    },
    // onSuccess
    () => {
      // Limpa inputs (campos), erros e status da validação
      resetForm();
      // Abre o tooltip para msg de sucesso
      openSignupTooltip();
    },
    // onError
    (error) => {
      console.error(
        'Erro ao enviar formulário de inscrição do usuário (handleRegistration) \n',
        error,
      );
      // Renderiza a msg de erro de inscrição no popup, no span acima do botão
      // Erro de usuário já cadastrado (409 Conflict), erro de Rate Limit (429)
      // ou erro interno no servidor (500 Internal Server) - tds retornados pela
      // Api do backend
      setServerError(error.message);
    },
  );

  return (
    <form className="popup__signup" onSubmit={handleSubmit} noValidate>
      <h2 className="popup__signup-title">Inscrever-se</h2>
      <label className="popup__signup-label" htmlFor="email">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className={`popup__signup-input ${errors.email ? 'popup__signup-input_type_error' : ''}`}
        placeholder="Insira e-mail"
        pattern="^[a-zA-Z0-9_.\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        title="E-mail válido: contento apenas letras, números, sublinhados, pontos ou hífens."
        value={values.email}
        onChange={handleChange}
        aria-label="Inserir e-mail para cadastro"
        required
      ></input>
      <span className="popup__signup-span email-span">{errors.email}</span>
      <label className="popup__signup-label" htmlFor="password">
        Senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className={`popup__signup-input ${errors.password ? 'popup__signup-input_type_error' : ''}`}
        placeholder="Insira a senha"
        pattern="^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$"
        title="Senha: mínimo 8 caracteres - pelo menos, uma letra minúscula e um número (maiúsculas tbm são permitidas)."
        value={values.password}
        onChange={handleChange}
        aria-label="Inserir senha para cadastro"
        required
      ></input>
      <span className="popup__signup-span password-span">
        {errors.password}
      </span>
      <label className="popup__signup-label" htmlFor="name">
        Nome de usuário
      </label>
      <input
        id="name"
        name="name"
        type="text"
        className={`popup__signup-input ${errors.name ? 'popup__signup-input_type_error' : ''}`}
        placeholder="Insira seu nome de usuário"
        pattern="^[^<>]+$" /* bloqueia os caracteres < e > para evitar inserção de tags
        HTML diretamente: barreira simples contra injeção de HTML no campo */
        title="Nome: não são permitidos '<' e '>', por questão de segurança."
        value={values.name}
        onChange={handleChange}
        aria-label="Inserir seu nome de usuário"
        required
      ></input>
      <span className="popup__signup-span name-span">{errors.name}</span>
      <span
        className={`popup__signup-span ${serverError ? 'popup__signup-span_active' : ''}`}
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
        className={`popup__signup-btn ${isFormValid ? '' : 'popup__signup-btn_disabled'}`}
        type="submit"
        disabled={!isFormValid}
        /* Se o formulário não estiver válido (false), botão desativo */
        /* Se o formulário estiver válido (true), botão ativado */
      >
        {isLoading ? 'Inscrevendo-se...' : 'Inscrever-se'}
      </button>
      <p className="popup__signup-plink">
        {/* O espaço depois do texto é proposital para o espaçamento da frase inteira */}
        ou {/* Uso da tag button, e não Link, pq o clique não muda de rota */}
        <button
          className="popup__signup-link"
          type="button"
          onClick={() => openSignin()}
        >
          Entre
        </button>
      </p>

      {/* Signin ou SignupTooltip serão renderizados por Popups em App */}
    </form>
  );
}

export default Signup;
