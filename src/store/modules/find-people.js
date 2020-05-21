import axios from 'axios'

const actions = {
    index({ commit }, 
      {
        search = '' ,
        sort,
        sortBy,
        perPage = 8,
        page = 1,
        companyFilter
      }
      ) {
      return new Promise((resolve, reject) => { 
        
        const postData = {
            action: 'get_people',
            page: page,
            perPage: perPage,
            search: search,
            sort: sort,
            sortBy: sortBy,
            companyFilter: companyFilter
        };
        
        axios.post('/m6-platform/api/user_profile', postData)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error)
        })
        
      });
    }
}

export default {
  namespaced: true,
  actions,
}
