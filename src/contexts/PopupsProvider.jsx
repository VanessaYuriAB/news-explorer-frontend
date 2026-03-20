import { useState, useCallback } from 'react';
import useApiError from '../hooks/useApiError';
import PopupsContext from './PopupsContext';

function PopupsProvider({ children }) {
  /* ---------------------------
              ESTADOS
  ---------------------------- */
  const [popup, setPopup] = useState(null);

  /* ---------- baixo nível ---------- */

  /* ---------------------------
            HANDLERS
  ---------------------------- */
  // Open e Close: genéricos

  // Open, para abrir Popups, que renderiza cinco children diferentes
  // Memoizada para não gerar loop no efeito de montagem e efeito do ProtectedRoute
  // Com verificação de type, tbm para evitar loop, no efeito para proteção de rota
  // Se o tipo de popup for o mesmo do anteriormente aberto, não altera, não re-renderiza
  // Verificação de prev pq state inicializa como null
  // Verificação, tbm, do tipo de tooltip, já que existem três popups deste tipo
  const handleOpenPopup = useCallback((nextPopup) => {
    setPopup((prev) => {
      if (prev?.type === nextPopup.type) {
        if (nextPopup.type === 'tooltip') {
          return prev.tooltipType === nextPopup.tooltipType ? prev : nextPopup;
        }

        return prev;
      }

      return nextPopup;
    });
  }, []);

  // Close
  const handleClosePopup = () => {
    setPopup(null);
  };

  /* ---------- alto nível (API pública) ---------- */

  /* ---------------------------
            HELPER
  ---------------------------- */

  // Função para chamar o hook que renderiza popup de msgs de erros da Api do servidor
  // Chamado ao salvar/des-salvar artigos e em useUserData (montagem/refresh)
  // Foi configurado por uma função externa pq o hook não pode ser chamado dentro de
  // handlers
  const showApiError = useApiError(handleOpenPopup);

  /*
  Hook para abertura (e configuração de objs) de Popups chamado em cada componente, à parte: useOpenedPopups. Exceto ApiErrorTooltip, que é aberto pela showApiError usando o useApiError.
  */

  /* ---------------------------
             PROVIDER
  ---------------------------- */

  return (
    <PopupsContext.Provider
      value={{
        popup,
        showApiError,
        handleOpenPopup,
        handleClosePopup,
      }}
    >
      {children}
    </PopupsContext.Provider>
  );
}

export default PopupsProvider;
