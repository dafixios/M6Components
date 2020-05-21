import axios from 'axios'

const state = {
  costCenterTypes: [],
  pricing: [],
  statusPanel: null
}

const actions = {
  fetchCostCenterTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', { action: 'get_cost_types' })
        .then(response => {
          const result = response.data.result
          commit('setCostCenterTypes', result)
          resolve('result')
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchPricing({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', payload)
        .then(response => {
          const result = response.data.result
          resolve(commit('setPricing', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setCostCenterTypes(state, payload) {
    state.costCenterTypes = payload
  },
  setPricing(state, payload) {
    state.pricing = payload
  },
  openEditPricingModal(state, payload) {
    if (state.statusPanel == null) {
      state.statusPanel = {
        value: true,
        text: payload
      }
    } else {
      state.statusPanel = {
        value: !state.statusPanel.value,
        text: payload
      }
    }
  }
}

const getters = {
  getCostCenterTypes(state) {
    return state.costCenterTypes
  },
  getPricing(state) {
    return state.pricing
  },
  editPricingModalGetter(state) {
    return state.statusPanel
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
