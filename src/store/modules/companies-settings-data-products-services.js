import axios from 'axios'
const state = {
  productsAndServices: null
}

const getters = {
  productsAndServices(state) {
    return state.productsAndServices
  }
}

const actions = {
  fetchProductsAndServices({ commit }, payload) {
    axios.post('m6-platform/api/companies', {
      action: 'get_products_and_services'
    })
      .then(response => {
        const result = response.data.result
        commit.setProductsAndServices = result
      })
      .catch(error => {
        console.error(error)
      })
  }
}

const mutations = {
  setProductsAndServices(state, payload) {
    state.productsAndServices = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
