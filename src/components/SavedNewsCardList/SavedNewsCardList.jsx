import useAuth from '../../hooks/useAuth';
import SavedNewsCard from './components/SavedNewsCard/SavedNewsCard';
import './SavedNewsCardList.css';

function SavedNewsCardList({ memoizedHandleUnsave }) {
  const { currentUser, savedUserNews } = useAuth();

  // Se o array do estado para os cards salvos do usuário estiver vazio, renderiza msg
  if (savedUserNews.userArticles.length === 0) {
    return (
      <section className="saved-news main__saved-news">
        <div className="saved-news__no-saveds">
          Você não tem nenhum cartão de notícia salvo,{' '}
          <span className="saved-news__username">{currentUser.name}</span>.
        </div>
      </section>
    );
  }

  // Se houverem objs de cards salvos, renderiza lista do usuário
  if (savedUserNews.userArticles.length > 0) {
    /* ----------------
      PALAVRAS-CHAVE
    -----------------*/

    // Reduce para contabilizar qtdd de repetições de cada palavra-chave,
    // retorna objeto com pares de propriedade(palavra-chave)/valor(qtdd)
    const contagem = savedUserNews.userArticles.reduce((acc, item) => {
      // Acessa a chave dentro do acumulador (a palavra-chave do item que está sendo
      // percorrido no momento)
      // Se a chave não existe ainda, usa 0 como valor inicial
      acc[item.keyword] = (acc[item.keyword] || 0) + 1;
      // Para cada item do array, devolve o acumulador atualizado - quando o reduce
      // termina, o valor final é acc completo
      return acc;
      /*
      Visualizando o processo inteiro:
      Suponha que o array seja:
      [{ keyword: "natureza" },  { keyword: "viagem" },  { keyword: "natureza" },  { keyword: "animais" }]

      Iterações:
      Iteração 1: item.keyword = "natureza"
                  acc = { natureza: 1 }

      Iteração 2: item.keyword = "viagem"
                  acc = { natureza: 1, viagem: 1 }

      Iteração 3: item.keyword = "natureza"
                  acc = { natureza: 2, viagem: 1 }

      Iteração 4: item.keyword = "animais"
                  acc = { natureza: 2, viagem: 1, animais: 1 }

      Resultado final retornado:
      {natureza: 2,  viagem: 1,  animais: 1}
      */
    }, {});

    // Transforma obj de retorno do reduce em array de entries, com propriedades completas
    // tbm em array, para uso no .sort() para ordenação dos itens
    const contagemEmEntries = Object.entries(contagem);

    // Ordena palavras-chaves por qtdd de repetições, da maior para menor
    // Passa o array com spread para ser criado um novo vetor e não alterar o original
    // Em caso de empate, mantém a ordem original
    const contagemOrdenada = [...contagemEmEntries].sort((a, b) => {
      return b[1] - a[1];
    });

    /* ----------------
          KEYWORDS
    -----------------*/

    // Define a primeira palavra-chave

    // Acessa o primeiro item do array ordenado decrescentemente (que tbm é um array) e,
    // depois, acessa o primeiro item deste array, que é a palavra-chave com maior qtdd
    // de repetições
    const firstKeyword = contagemOrdenada[0][0];

    // Definição para as demais palavras-chave

    const defineKeywords = () => {
      let secondKeyword;
      let thirdKeyword;

      // Se houverem três palavras-chave ou menos, exibe todas as palavras-chave

      if (contagemOrdenada.length > 1 && contagemOrdenada.length <= 3) {
        // Define a segunda palavra-chave
        secondKeyword = contagemOrdenada[1][0];

        // Define a terceira palavra-chave
        // Se não houver a terceira, 'reseta' variável
        contagemOrdenada.length === 3
          ? (thirdKeyword = contagemOrdenada[2][0])
          : '';
      }

      // Se houverem mais do que três palavras-chave, exiba as primeiras duas e o número
      // de palavras-chave restantes

      if (contagemOrdenada.length > 3) {
        // Define a segunda palavra-chave
        secondKeyword = contagemOrdenada[1][0];

        // Define a qtdd de outras no lugar da terceira palavra-chave
        thirdKeyword = ` e ${contagemOrdenada.length - 2} outras`;
      }

      // Configura estrutura do texto para a segunda palavra-chave, de acordo com a qtdd
      // total de palavras-chave
      const secondKey = () => {
        // Se não houver segunda palavra-chave
        if (contagemOrdenada.length < 2) {
          return '';
        }

        // Se houverem apenas duas palavras-chave
        if (contagemOrdenada.length === 2) {
          return ` e ${secondKeyword}`;
        }

        // Se houverem mais do que duas palavras-chave
        if (contagemOrdenada.length > 2) {
          return `, ${secondKeyword}`;
        }
      };

      // Configura estrutura do texto para a terceira palavra-chave, de acordo com a qtdd
      // total de palavras-chave
      const thirdKey = () => {
        // Se houver menos do que três palavras-chave
        if (contagemOrdenada.length < 3) {
          return '';
        }

        // Se houverem três palavras-chave
        if (contagemOrdenada.length === 3) {
          return ` e ${thirdKeyword}`;
        }

        // Se houverem mais do que três
        if (contagemOrdenada.length > 3) {
          return thirdKeyword;
        }
      };

      return { secondKey, thirdKey };
    };

    const { secondKey, thirdKey } = defineKeywords();

    /* ----------------
           JSX
    -----------------*/

    return (
      <section className="saved-news main__saved-news">
        <div className="saved-news__infos">
          <h2 className="saved-news__title">Artigos salvos</h2>
          <p className="saved-news__info">
            <span className="saved-news__username">{currentUser.name}</span>
            {`, você tem ${savedUserNews.userArticles.length} artigo(s) salvo(s)`}
          </p>
          <p className="saved-news__keywords">
            Por palavra(s)-chave:
            {/* Primeira key */}
            <span className="saved-news__keyword">{` ${firstKeyword}`}</span>
            {/* Segunda key */}
            <span className="saved-news__keyword">{`${secondKey()}`}</span>
            {/* Anothers Key */}
            <span className="saved-news__keyword">{`${thirdKey()}`}</span>
          </p>
        </div>
        <div className="saved-news__list">
          {/* Renderiza cards salvos do usuário via .map, de acordo com a lista (array) do
        usuário na API do servidor */}

          <ul className="saved-news__cards">
            {savedUserNews.userArticles.map((savedCard) => {
              // A lista de cards salvos possui a propriedade _id em cada elemento, pois
              // é o servidor do banco de dados (Mongo DB)
              return (
                <SavedNewsCard
                  key={savedCard._id}
                  savedCard={savedCard}
                  memoizedHandleUnsave={memoizedHandleUnsave}
                />
              );
            })}
          </ul>
        </div>
      </section>
    );
  }
}

export default SavedNewsCardList;
