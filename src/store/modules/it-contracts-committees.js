import axios from 'axios'

const state = {
  committeeOptions: [],
  directors: [],
  isExpandOpen: null
}

const actions = {
  fetchCommitteeOptions({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_committees_options'
      })
        .then(response => {
          const result = response.data.result
          resolve(commit('setCommitteeOptions', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchDirectors({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', { action: 'get_directors' })
        .then(response => {
          const result = response.data.result
          resolve(commit('setDirector', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setCommitteeOptions(state, payload) {
    state.committeeOptions = payload
  },
  setExpandStatus(state, payload) {
    state.isExpandOpen = payload
  },
  setDirector(state, payload) {
    state.directors = payload
  }
}

const getters = {
  getCommitteeOptions(state) {
    // if (typeof state.committeeOptions) {
    //   var optionsFormated = Object.entries(state.committeeOptions).map(([id, name]) => ({id, name}))

    //   return optionsFormated
    // } else {
    //   return state.committeeOptions
    // }

    return state.committeeOptions
  },
  getExpandOpen(state) {
    return state.isExpandOpen
  },
  getDirectors(state) {
    return state.directors
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
