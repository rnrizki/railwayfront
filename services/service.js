import {createFetchClient} from "../utils/fetchClient";

export default {
  async deleteRequest(api, bearer) {
    let header = {'Authorization': `Bearer ${bearer}`}

    const fetchClient = createFetchClient(header);
    const result = await fetchClient(api, {
      method: 'DELETE'
    });

    if(result?.status === 401){
      return Promise.reject({status: 401, message: ''})
    }

    return result.json()
  },

  async getRequest(api, bearer, lang = null) {
    let header = {'Authorization': `Bearer ${bearer}`}
    if (lang) {
      header = {...header,...{'Language': lang}};
    }
    const fetchClient = await createFetchClient(header);

    const result = await fetchClient(api, {
      method: 'GET'
    });

    if(result?.status === 401){
      return Promise.reject({status: 401, message: ''})
    }

    return result?.json();
  },
  async postRequest(api, params, bearer, lang = null) {

    let header = {'Authorization': `Bearer ${bearer}`}
    if (lang) {
      header = {...header,...{'Language': lang}}
    }

    let convertedParams = null
    let defaultHeaders = null

    if (params instanceof FormData){
      convertedParams = params
      defaultHeaders = {
        Accept: 'application/json',
      }
    } else {
      convertedParams =  JSON.stringify(params)
      defaultHeaders = {
        Accept: 'application/json',
        "Content-type": "application/json; charset=UTF-8"
      }
    }

    const fetchClient = createFetchClient(header, defaultHeaders);
    const result = await fetchClient(api, {
      method: 'POST',
      body: params instanceof FormData ? params : JSON.stringify(params)
    });

    if(result?.status === 401){
      return Promise.reject({status: 401, message: ''})
    }

    return result.json()
  },
  async unAuthPost(api, params, lang = null) {
    let header = {}
    if (lang) {
      header = {...header,...{'Language': lang}}
    }
    const fetchClient = createFetchClient(header);
    const result = await fetchClient(api, {
      method: 'POST',
      body: JSON.stringify(params)
    });

    return result.json()
  },
  async unAuthGet(api, lang = null) {
    let header = {}
    if (lang) {
      header = {...header,...{'Language': lang}}
    }
    const fetchClient = createFetchClient(header);

    const result = await fetchClient(api, {
      method: 'GET'
    });

    return result.json()
  },
}
