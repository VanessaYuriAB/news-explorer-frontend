import {
  baseNewsApiUrl,
  newsApiKey,
  makeApisRequest,
  dataFromSevenDays,
} from './utilsApis';

// Assinatura: fetch(url-to-requested-resource, options-object)
// É um método assíncrono, retorna uma promisse e method padrão: GET

// GET - /everything
const getNews = async (queryString) => {
  const news = await makeApisRequest({
    endpoint: `${baseNewsApiUrl}/everything`,
    reqParams: {
      q: queryString /* vem do componente (input do SearchForm) */,
      from: dataFromSevenDays() /* função para calcular 7 dias atrás */,
      to: new Date().toISOString() /* data atual no formato ISO 8601 completo */,
      pageSize: 100,
      apiKey: newsApiKey,

      // API key enviada via query param porque o proxy do bootcamp estava gerando erro
      // ao enviar via header customizado, x-api-key
    },
    method: 'GET',
    /* headers: {
      'X-Api-Key': `${newsApiKey}`,
    }, */
  });

  return news;

  // Try/catch desnecessário aqui tbm, se a solicitação não for bem-sucedida,
  // repassa o erro adiante > handleGetNews
};

export default getNews;
