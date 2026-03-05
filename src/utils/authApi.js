import { baseMainApiUrl, makeApisRequest } from './utilsApis';

// Assinatura: fetch(url-to-requested-resource, options-object)
// É um método assíncrono, retorna uma promisse e method padrão: GET

// POST - /signup
const register = async (userData) => {
  const newUser = await makeApisRequest({
    endpoint: `${baseMainApiUrl}/signup`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    reqBody: userData, // um obj simples pq a conversão para JSON é aplicada no
    // makeApisRequest
  });

  return newUser;

  // Se a solicitação não for bem-sucedida, repassa o erro adiante > handleRegistration
  // Try/catch é desnecessário aqui
};

// POST - /signin
const login = async (userData) => {
  const tokenUser = await makeApisRequest({
    endpoint: `${baseMainApiUrl}/signin`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    reqBody: userData, // um obj simples pq a conversão para JSON é aplicada no
    // makeApisRequest
  });

  return tokenUser; // retorna o token JWT

  // Se a solicitação não for bem-sucedida, repassa o erro adiante > handleLogin
  // Try/catch é desnecessário aqui
};

export { register, login };
