import axios from 'axios'

const state = {
  purchaseTypes: [],
  types: []
}

const actions = {
  fetchPurchaseTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'purchase_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setPurchaseTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'license_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setPurchaseTypes(state, payload) {
    state.purchaseTypes = payload
  },
  setTypes(state, payload) {
    state.types = payload
  }
}

const getters = {
  getPurchaseTypes(state) {
    return state.purchaseTypes
  },
  getTypes(state) {
    return state.types
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
