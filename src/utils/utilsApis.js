const baseNewsApiUrl = import.meta.env.VITE_BASE_NEWS_API_URL;
const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;

const baseMainApiUrl = import.meta.env.VITE_BASE_MAIN_API_URL;
// baseMainApiUrl === undefined se não existir no .env

// Função genérica para enviar requisições HTTP
const makeApisRequest = async ({
  endpoint,
  reqParams = {}, // para o getNews para a News Api, com valor padrão para evitar erro
  // com o método URLSearchParams, caso o obj não seja passado na chamada da função
  method,
  headers = {}, // valor padrão para evitar erro caso não passe headers na chamada,
  // permite que a função seja usada para requisições sem cabeçalhos (como GET simples)
  reqBody,
}) => {
  // Converte objeto passado como parêmtro em uma query string
  const paramsForQuery = Object.keys(reqParams).length
    ? new URLSearchParams(reqParams).toString()
    : '';

  const url = paramsForQuery ? `${endpoint}?${paramsForQuery}` : endpoint;

  const options = {
    headers,
    method,
    body: reqBody ? JSON.stringify(reqBody) : undefined,
  };

  let response;

  try {
    response = await fetch(url, options);
  } catch {
    // Padroniza erros de servidor caiu, sem internet, DNS... e mostra mensagem amigável
    // quando não é erro HTTP
    // Não lança um erro antes de existir response, evita que o código 'pule' tudo e caia
    // no catch de quem chamou, com um erro “TypeError: Failed to fetch”
    const error = new Error('Falha de rede ou servidor indisponível');
    error.status = 0; // status 0 = erro de rede (convenção)
    error.name = 'NetworkError';
    throw error;
  }

  // O método fetch retorna o objeto de resposta no formato JSON
  // O método res.json() converte o obj para JavaScript
  // res é a resposta em JSON
  // .json() converte res para JS e o return retorna os dados

  // Tenta ler JSON uma vez; se insucesso, cai pra {}
  // `.catch(() => ({}))` evita que o app quebre em algumas respostas (ex: 500 ou 204)
  // que podem vir sem corpo ou com um JSON inválido, impedindo que `res.status` seja
  // verificado - se `res.json()` falhar, em vez de lançar um erro e interromper o fluxo
  // (caindo no catch principal), o código retorna um objeto vazio `{}` e continua
  // normalmente
  const data = await response.json().catch(() => ({}));

  // Verifica se a solicitação foi bem ou mal sucedida
  // Se bem, retorna o obj com dados, convertidos para JS
  // Se mal, configura erro no front e lança-o

  if (!response.ok) {
    const error = new Error(data.message || 'Erro inesperado na solicitação');

    error.status = response.status;
    error.name = data.error || 'RequestError'; // pq o backend não envia o nome do erro,
    // apenas status

    // Repassa obj de erro configurado conforme acima, com as informações originais da
    // API (mensagem do erro e status)
    throw error;
  }

  return data;

  // Se a solicitação não for bem-sucedida, repassa o erro adiante

  // Falhas do fetch (erros de rede, DNS, servidor offline) ou erros inesperados no
  // código e erros HTTP (status não OK) são tratados antes de serem lançados, enviando
  // o objeto de erro com configurações personalizadas e/ou originais da API
};

// Função para data from > reqParams, em getNews
// getDate() → retorna o dia do mês (1 a 31) da data, pega o dia atual
// setDate() → define o dia do mês para a data, permite alterar o dia
const dataFromSevenDays = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7); // subtrai 7 dias
  return date.toISOString(); // formato ISO 8601 completo
};

export {
  baseNewsApiUrl,
  newsApiKey,
  makeApisRequest,
  dataFromSevenDays,
  baseMainApiUrl,
};
