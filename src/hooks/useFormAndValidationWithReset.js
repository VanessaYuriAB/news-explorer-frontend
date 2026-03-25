import { useState, useCallback } from 'react';

// Hook para controle de formulários + validação e reset da validação
// Mantém tudo controlado pelo React (sem DOM imperativo)
// Para os fomulários Signup e Signin
function useFormAndValidationWithReset() {
  // Variáveis de estado: controle dos inputs dos formulários
  const [values, setValues] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Variáveis de estado: controle dos spans para msg de erros dos inputs
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Variáveis de estado: controle do status de validação dos inputs, para o controle do
  // status do botão do formulário
  const [isFormValid, setIsFormValid] = useState(false);

  // Handler de mudança de input: para controlar a renderização do texto digitado pelo
  // usuário, setar erro e validação
  // Usa a Constraint Validation API direto no React
  // O React e a Constraint Validation API usam name como: chave lógica do campo,
  // identificação de qual valor deve ser atualizado e identificação de qual erro
  // pertence ao campo - esse é o padrão de formulários HTML desde sempre
  // (não usa id)
  const handleChange = (event) => {
    const target = event.target; // elemento atual
    const name = target.name; // 'name' do elemento (input)
    const value = target.value; // valor (texto) do elemento

    // Seta inputs
    setValues({ ...values, [name]: value });

    // Seta erros
    // Para gerar mensagens de erro personalizadas, conforme atributos 'title' e 'pattern'
    if (target.validity.patternMismatch && target.title) {
      setErrors({ ...errors, [name]: target.title });
    } else {
      // Se os atributos não existirem, usa a msg padrão de validação
      setErrors({ ...errors, [name]: target.validationMessage });
    }

    // Seta status da validação do formulário todo
    setIsFormValid(target.closest('form').checkValidity());
  };

  // Reset do formulário
  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsFormValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsFormValid(newIsFormValid);
    },
    [setValues, setErrors, setIsFormValid],
  );

  // Retorna variáveis e funções para aplicação no componente do formulário
  return { values, handleChange, errors, isFormValid, resetForm };
}

export default useFormAndValidationWithReset;
