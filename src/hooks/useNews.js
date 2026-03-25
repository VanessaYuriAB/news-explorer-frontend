// Hook de consumo – recomendado: evita useContext(NewsContext) espalhado pelo código

import { useContext } from 'react';
import NewsContext from '../contexts/NewsContext';

function useNews() {
  const context = useContext(NewsContext);

  if (!context) {
    throw new Error('useNews deve ser usado dentro de NewsProvider');
  }

  return context;
}

export default useNews;
