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
        explaintext: true,
        titles: title,
        pithumbsize: 400,
        redirects: 1,
        exsectionformat: 'wiki',
        exlimit: 1,
        exintro: true,
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
      },
    });
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