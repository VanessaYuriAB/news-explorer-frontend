import { useState } from 'react';

/*
 Hook personalizado para gerenciar o envio de formulários com controle de
 estado e callbacks.

 onSubmit - Função principal de envio (requisição à API).

 onSuccess - Função opcional executada após o envio bem-sucedido.
 Exemplo: fechar popup, limpar campos, exibir tooltip de sucesso.

 onError - Função opcional executada em caso de erro no envio.
 Exemplo: exibir tooltip de falha ou mensagem de erro.

 Retorna um objeto com:
 - {Function} handleSubmit → manipulador de envio de formulário.
 - {boolean} isLoading → estado que indica se o envio está em andamento.

 Exemplo de uso:
 const { handleSubmit, isLoading } = useFormSubmit(
  () => api.registerUser(data),
  () => setTooltipSuccess(true),
  (error) => setTooltipError(true)
 );

 <form onSubmit={handleSubmit}>
   <button disabled={isLoading}>Enviar</button>
 </form>
*/

function useFormSubmit(onSubmit, onSuccess, onError) {
  // Variável de estado: controle do andamento da solicitação
  const [isLoading, setIsLoading] = useState(false);

  // Função principal de envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // ativa o estado de carregamento

    try {
      await onSubmit();

      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        // Caso não exista callback de erro, registra no console
        console.error(
          'Erro no useFormSubmit e o componente não possui callback onError \n',
          error,
        );
      }
    } finally {
      // Finaliza o estado de carregamento, independente do resultado
      setIsLoading(false);
    }
  };

  // Retorna o manipulador de envio e o estado de carregamento, para ser implementado
  // no componente
  return { handleSubmit, isLoading };
}

export default useFormSubmit;
