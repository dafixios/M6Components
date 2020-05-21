import axios from 'axios'

const state = {
  certificationTypes: [],
  futureOperatingSystems: [],
  ipAddressTypes: [],
  networkTypes: [],
  operatingSystems: []
}

const actions = {
  fetchCertificationTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'certification_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setCertificationTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchFutureOperatingSystems({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'future_operating'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setFutureOperatingSystems', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchIpAddressTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'ip_address_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setIpAddressTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchNetworkTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'network_zone'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setNetworkTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchOperatingSystems({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'operating_system'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setOperatingSystems', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setCertificationTypes(state, payload) {
    state.certificationTypes = payload
  },
  setFutureOperatingSystems(state, payload) {
    state.futureOperatingSystems = payload
  },
  setIpAddressTypes(state, payload) {
    state.ipAddressTypes = payload
  },
  setNetworkTypes(state, payload) {
    state.networkTypes = payload
  },
  setOperatingSystems(state, payload) {
    state.operatingSystems = payload
  }
}

const getters = {
  getCertificationTypes(state) {
    return state.certificationTypes
  },
  getFutureOperatingSystems(state) {
    return state.futureOperatingSystems
  },
  getIpAddressTypes(state) {
    return state.ipAddressTypes
  },
  getNetworkTypes(state) {
    return state.networkTypes
  },
  getOperatingSystems(state) {
    return state.operatingSystems
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
