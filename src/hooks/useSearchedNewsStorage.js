import { useEffect } from 'react';

// Encapsula o efeito de localStorage para searchedNews
// Implementado em NewsProvider

function useSearchedNewsStorage(searchedNews) {
  useEffect(() => {
    if (searchedNews) {
      localStorage.setItem('searchedNewsData', JSON.stringify(searchedNews));
    }
  }, [searchedNews]);
}

export default useSearchedNewsStorage;
