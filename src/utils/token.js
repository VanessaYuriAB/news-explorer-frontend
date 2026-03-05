// Manipulação da variável de estado e do localStorage para o Token JWT

// Seta
const setAndStorageToken = (token, setJwt) => {
  localStorage.setItem('jwt', token);
  setJwt(token);
};

// Busca
const getToken = () => {
  return localStorage.getItem('jwt');
};

// Deleta
const removeToken = (setJwt) => {
  localStorage.removeItem('jwt');
  setJwt('');
};

export { setAndStorageToken, getToken, removeToken };
