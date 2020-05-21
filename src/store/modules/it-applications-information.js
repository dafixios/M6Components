import axios from 'axios'

const state = {
  categories: [],
  subCategories: [],
  applicationInformation: []
}

const actions = {
  fetchCategories({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'category_type'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setCategories', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchSubCategories({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'sub_category'
      })
        .then(response => {
          const result = response.data.result.settings
          resolve(commit('setSubcategories', result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setApplicationInformation(state, payload) {
    state.applicationInformation = payload
  },
  setCategories(state, payload) {
    state.categories = payload
  },
  setSubcategories(state, payload) {
    state.subCategories = payload
  }
}

const getters = {
  getGeneralApplicationInformation(state) {
    if (state.applicationInformation.general) {
      return state.applicationInformation.general
    } else {
      return ''
    }
  },
  getCategories(state) {
    return state.categories
  },
  getSubCategories(state) {
    return state.subCategories
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
