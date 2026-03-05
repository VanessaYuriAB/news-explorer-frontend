import { useCallback } from 'react';
import ApiErrorTooltip from '../components/Popups/components/ApiErrorTooltip/ApiErrorTooltip';

// Para as funções de salvar e des-salvar artigos, tbm para set dos dados do usuário no
// efeito de montagem e refresh
// Registro e login são configurados no estado para o span de msg de erro de requisição,
// no próprio componente do form

// Com useCallback, showApiError fica estável enquanto handleOpenPopup for estável,
// evitando erros por ter showApiError nas dependências do useEffect de montagem

function useApiError(handleOpen) {
  return useCallback(
    (error) => {
      // Define mensagem de erro conforme status
      const message =
        error.status === 429 ? (
          <>
            Foram feitas muitas solicitações para o servidor da página em pouco
            tempo e o acesso foi bloqueado temporariamente.
            <br />
            <br />
            Você pode continuar a pesquisar notícias em alguns minutos.
          </>
        ) : (
          `Não foi possível carregar seus dados agora, por algum erro no servidor.
          Tente recarregar a página ou acessar novamente mais tarde.`
        );

      // Objeto para configurar children de Popups: abertura do popup para msg de erro da
      // Api do backend (servidor), passando msg como props
      // tooltipType para verificação no handleOpenPopup
      const apiErrorTooltip = {
        children: <ApiErrorTooltip message={message} />,
        type: 'tooltip',
        tooltipType: 'apiError',
      };

      // Chama o handle de abertura de Popups
      handleOpen(apiErrorTooltip);
    },
    [handleOpen],
  );
}

export default useApiError;
