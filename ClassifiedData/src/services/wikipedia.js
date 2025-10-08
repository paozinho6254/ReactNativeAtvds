import axios from 'axios';

const WIKIPEDIA_API_URL = 'https://pt.wikipedia.org/w/api.php';

const api = axios.create({
  baseURL: WIKIPEDIA_API_URL,
  headers: {
    'User-Agent': 'ClassifiedData/1.0 (https://github.com/paozinho6254/ReactNativeAtvds/ClassifiedData; antonirochadasilvaa@gmail.com)',
    'Accept': 'application/json',
  },
});


export const getColdWarTanks = async () => {
  try {
    const response = await api.get('', {
      params: {
        action: 'query',
        format: 'json',
        list: 'categorymembers',
        cmtitle: 'Category:Principais_tanques_de_batalha_da_Guerra_Fria',
        cmlimit: 'max',
      },
    });
    return response.data.query.categorymembers;
  } catch (error) {
    console.error('Erro ao buscar tanques da Wikipedia:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    return [];
  }
};

export const getTankDetails = async (title) => {
  try {
    const response = await api.get('', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts|pageimages',
        explaintext: true, // Já está true, o que é bom
        titles: title,
        pithumbsize: 400,
        redirects: 1,
        // *** Novas opções para tentar limpar o extract ***
        exsectionformat: 'wiki', // Mantém títulos como ==Título== para ajudar no parsing manual
        exlimit: 1, // Limita o extract a uma seção ou um número de parágrafos. Experimente.
        exintro: true, // Retorna apenas a introdução (antes do primeiro título de seção)
        // ou
        // exchars: 1000, // Limita o número de caracteres do extract
        // excontinue: true // Para obter mais de uma seção se exlimit for maior que 1
        // Você pode ter que experimentar com 'exintro' e 'exlimit' para ver qual funciona melhor.
      },
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId];
  } catch (error) {
    console.error(`Erro ao buscar detalhes do tanque "${title}":`, error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    return null;
  }
};

export const getTankHtml = async (title) => {
  try {
    const response = await api.get('', {
      params: {
        action: 'parse',
        format: 'json',
        page: title,
        prop: 'text',
        // Pode precisar de 'disablelimitreport', 'disabletoc' etc.
        // Para obter apenas o HTML do conteúdo principal
        // rw: '1' para remover avisos de edição, etc.
      },
    });
    // A resposta terá o HTML dentro de response.data.parse.text['*']
    return response.data.parse.text['*'];
  } catch (error) {
    console.error(`Erro ao buscar HTML para "${title}":`, error);
    return null;
  }
};

export const getTankImageUrl = async (title) => {
  try {
    const response = await api.get('', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'pageimages',
        titles: title,
        pithumbsize: 200,
      },
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pages[pageId] && pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
      console.log(`IMAGEM ENCONTRADA para "${title}":`, pages[pageId].thumbnail.source);
      return pages[pageId].thumbnail.source;
    } else {
      console.log(`IMAGEM NÃO ENCONTRADA (pageimages) para "${title}". Resposta da API:`, pages[pageId]);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar imagem para "${title}":`, error);
    return null;
  }
};