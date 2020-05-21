import axios from 'axios'

const state = {
  updateAttributes: false,
  totalCost: 0,
  totalLicesingCost: 0,
  totalFTECost: 0
}

const actions = {
  updateAttributes({ commit }, payload) {
    commit('updateAttributes', payload)
  }
}

const mutations = {
  updateAttributes(state, payload) {
    state.updateAttributes = !state.updateAttributes
  },
  setTotalCost(state, payload) {
    if (!isNaN(payload)) {
      state.totalCost = payload
    }
  },
  setTotalLicesingCost(state, payload) {
    if (!isNaN(payload)) {
      state.totalLicesingCost = payload
    }
  },
  setTotalFTECost(state, payload) {
    if (!isNaN(payload)) {
      state.totalFTECost = payload
    }
  }
}

const getters = {
  updateAttributes(state) {
    return state.updateAttributes
  },
  getTotalAnnualCost(state) {
    return state.totalCost + state.totalFTECost + state.totalLicesingCost
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
