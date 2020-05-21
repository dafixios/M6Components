import axios from 'axios'

const state = {
  installInformation: {},
  deliveryMethods: [],
  installTypes: [],
  priorities: [],
  windowPassedDctType: []
}

const actions = {
  fetchInstallationInformation({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/applications', payload)
        .then(response => {
          const result = response.data.result
          resolve(commit('setInstallInformation', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchDeliveryMethods({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'delivery_method'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setDeliveryMethos', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchinstallTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'install_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setInstallTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchPriorities({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'priority'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setPriorities', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchWindowPassedTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'window_passed_dct_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setWindowPassedTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setInstallInformation(state, payload) {
    state.installInformation = payload
  },
  setDeliveryMethos(state, payload) {
    state.deliveryMethods = payload
  },
  setInstallTypes(state, payload) {
    state.installTypes = payload
  },
  setPriorities(state, payload) {
    state.priorities = payload
  },
  setWindowPassedTypes(state, payload) {
    state.windowPassedDctType = payload
  }
}

const getters = {
  getInstallInformation(state) {
    return state.installInformation
  },
  getDeliveryMethods(state) {
    return state.deliveryMethods
  },
  getInstallTypes(state) {
    return state.installTypes
  },
  getPriorities(state) {
    return state.priorities
  },
  getWindowPassedTypes(state) {
    return state.windowPassedDctType
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
