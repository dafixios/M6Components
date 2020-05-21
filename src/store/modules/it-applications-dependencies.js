import axios from 'axios'

const state = {
  appBuild: [],
  appCompliant: [],
  DCTStatus: [],
  dependencies: [],
  EDAPackage: [],
  execPath: [],
  status: [],
  types: [],
  updatedInstallNotes: [],
  ldapOptions: []
}

const actions = {
  fetchAppBuild({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'app_build'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setAppBuild', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchAppCompliant({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'app_compliant'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setAppCompliant', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchDCTStatus({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'dct_status'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setDCTStatus', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchEDAPackage({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'eda_package'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setEDAPackage', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchExecPath({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'exec_path'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setExecPath', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchStatus({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'dependency_status'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setStatus', result))
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
        type: 'dependency_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setTypes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchUpdatedInstallNotes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'updated_install_notes'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setUpdatedInstallNotes', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchLDAPOptions({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'ldap_ad_authentication'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setLDAPOptions', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setAppBuild(state, payload) {
    state.appBuild = payload
  },
  setAppCompliant(state, payload) {
    state.appCompliant = payload
  },
  setDCTStatus(state, payload) {
    state.DCTStatus = payload
  },
  setDependencies(state, payload) {
    state.dependencies = payload
  },
  setEDAPackage(state, payload) {
    state.EDAPackage = payload
  },
  setExecPath(state, payload) {
    state.execPath = payload
  },
  setStatus(state, payload) {
    state.status = payload
  },
  setTypes(state, payload) {
    state.types = payload
  },
  setUpdatedInstallNotes(state, payload) {
    state.updatedInstallNotes = payload
  },
  setLDAPOptions(state, payload) {
    state.ldapOptions = payload
  }
}

const getters = {
  getAppBuild(state) {
    return state.appBuild
  },
  getAppCompliant(state) {
    return state.appCompliant
  },
  getDCTStatus(state) {
    return state.DCTStatus
  },
  getDependencies(state) {
    return state.dependencies
  },
  getEDAPackage(state) {
    return state.EDAPackage
  },
  getExecPath(state) {
    return state.execPath
  },
  getStatus(state) {
    return state.status
  },
  getTypes(state) {
    return state.types
  },
  getUpdatedInstallNotes(state) {
    return state.updatedInstallNotes
  },
  getLDAPOptions(state) {
    return state.ldapOptions
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
}
