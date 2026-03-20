// Hook de consumo – recomendado: evita useContext(PopupsContext) espalhado pelo código

import { useContext } from 'react';
import PopupsContext from '../contexts/PopupsContext';

function usePopups() {
  const context = useContext(PopupsContext);

  if (!context) {
    throw new Error('usePopups deve ser usado dentro de PopupsProvider');
  }

  return context;
}

export default usePopups;
