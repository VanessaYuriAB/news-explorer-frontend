import { useEffect } from 'react';

// Escuta mudança de `loggedIn` e limpa dados

function useResetUserData({ loggedIn, setCurrentUser, setSavedUserNews }) {
  useEffect(() => {
    if (!loggedIn) {
      setCurrentUser({ email: '', name: '' });
      setSavedUserNews({ userArticles: [] });
    }
  }, [loggedIn, setCurrentUser, setSavedUserNews]);
}

export default useResetUserData;
