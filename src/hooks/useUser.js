// Hook de consumo – recomendado: evita useContext(UserContext) espalhado pelo código

import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }

  return context;
}

export default useUser;
