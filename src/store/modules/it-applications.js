import Common from './_common'
import axios from 'axios'
import Vue from 'vue'
import { db } from '@/utils/Firebase'

const common = new Common('/m6-platform/api/applications')

import additionalInformation from './it-applications-additional-information'
import dependencies from './it-applications-dependencies'
import information from './it-applications-information'
import instalationInformation from './it-applications-installation-information'
import license from './it-applications-license'
import contact from './it-applications-contact'
import rationalization from './it-applications-rationalization'
import settings from './it-applications-settings'

const state = {
  application: null,
  applicationManagementTypes: [],
  capabilities: [],
  contactTags: [],
  facingTypes: [],
  firstContactGroups: [],
  linkedContracts: [],
  mainCategories: [],
  status: [],
  subCategories: [],
  SSN: [],
  subCategoryTypes: [],
  usersByCompany: [],
  vendors: [],
  categoryID: null,
  compare: false,
  compareApps: {}
}

const actions = {
  index: (...args) => common.store(...args),
  show: (...args) => common.store(...args),
  fetchCapabilities({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'capabilities'
      })
        .then(response => {
          resolve(commit('setCapabilities', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchContactTags({ commit }) {
    return new Promise((resolve, reject) => {
      const itContactTags = axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'it_contact_tag'
      })
      const applicationTags = db.collection('settings')
        .doc(window.Drupal.settings.m6_platform_header.company_nid)
        .collection('settings')
        .doc('applications')
        .get()

      Promise.all([
        itContactTags,
        applicationTags
      ]).then(([itTags, appTags]) => {
        appTags = this.$h.dg(appTags.data(), 'contact_tags', []).map(c => ({
          text: c.name,
          value: c.value
        })) || []
        const resultTags = [
          ...this.$h.dg(itTags, 'data.result.settings'),
          ...appTags
        ]
        resolve(commit('setTags', resultTags))
      }).catch(reject)
    })
  },
  fetchApplicationManagementTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'app_management'
      })
        .then(response => {
          resolve(commit('setApplicationManagementTypes', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchApplication({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/applications', {
        action: 'get_application',
        nid: payload
      })
        .then(response => {
          resolve(commit('setApplication', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchFacingTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'facing_type'
      })
        .then(response => {
          resolve(commit('setFacingTypes', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchFirstContactGroups({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'firstcontact_group'
      })
        .then(response => {
          resolve(commit('setfirstContactGroups', response.data.result.settings))
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
        type: 'status'
      })
        .then(response => {
          resolve(commit('setStatus', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchLinkedContracts({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_assoc_contracts'
      })
        .then(response => {
          resolve(commit('setLinkedContracts', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchMainCategories({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'main_category'
      })
        .then(response => {
          resolve(commit('setMainCategories', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchSubCategoryTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'category_type'
      })
        .then(response => {
          resolve(commit('setSubCategoryTypes', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchSSN({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'ssn'
      })
        .then(response => {
          resolve(commit('setSSN', response.data.result.settings))
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
          resolve(commit('setSubCategories', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchUsersByCompany({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_users_by_company'
      })
        .then(response => {
          resolve(commit('setUsersByCompany', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchVendors({ commit }, payload) {
    let search = payload
    let type = ''
    if (typeof (payload) === 'object') {
      search = payload.search
      type = payload.type
    }

    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/companies', {
        action: 'get_all_companies',
        search: search,
        type: type
      })
        .then(response => {
          resolve(commit('setVendors', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  setCategoryID(state, payload) {
    state.categoryID = payload
  },
  setApplication(state, payload) {
    state.application = payload
  },
  setApplicationManagementTypes(state, payload) {
    state.applicationManagementTypes = payload
  },
  setCapabilities(state, payload) {
    state.capabilities = payload
  },
  setContactTags(state, payload) {
    state.contactTags = payload
  },
  setFacingTypes(state, payload) {
    state.facingTypes = payload
  },
  setfirstContactGroups(state, payload) {
    state.firstContactGroups = payload
  },
  setLinkedContracts(state, payload) {
    state.linkedContracts = payload
  },
  setMainCategories(state, payload) {
    state.mainCategories = payload
  },
  setUsersByCompany(state, payload) {
    if (state.usersByCompany.length === 0) {
      state.usersByCompany = payload
    } else {
      state.usersByCompany = state.usersByCompany.concat(payload)
    }
  },
  addUserToUsersByCompany(state, payload) {
    state.usersByCompany.indexOf(payload) === -1 ? state.usersByCompany.push(payload) : ''
    // state.usersByCompany.push(payload)
  },
  setStatus(state, payload) {
    state.status = payload
  },
  setSSN(state, payload) {
    state.SSN = payload
  },
  setSubCategories(state, payload) {
    state.subCategories = payload
  },
  setSubCategoryTypes(state, payload) {
    state.subCategoryTypes = payload
  },
  setVendors(state, payload) {
    state.vendors = payload.companies
  },
  setCompare(state, payload) {
    state.compare = payload
  },
  addCompare(state, payload) {
    if (!state.compareApps[payload]) {
      axios.post('/m6-platform/api/applications', {
        action: 'get_application',
        nid: payload,
        compare: true
      })
        .then(response => {
          response.data.result.rationalization = {}
          response.data.result.licensing = {}
          response.data.result.fte = {}
          response.data.gobernances = {}
          Vue.set(state.compareApps, payload, response.data.result)

          axios.post('/rationalization/get/rationalizations', {
            node_id: payload
          })
            .then(response => {
              state.compareApps[payload].rationalization = response.data.result[0] && response.data.result[0].ratio_of_user_cost ? response.data.result[0] : {}
            })

          axios.post('/m6-platform/api/applications', {
            action: 'get_licenses_old',
            nid: payload
          })
            .then(response => {
              state.compareApps[payload].licensing = response.data.result[0] ? response.data.result[0] : {}
            })

          axios.post('/rationalization/get/fte', { node_id: payload })
            .then(response => {
              state.compareApps[payload].fte = response.data ? response.data : {}
            })

          axios.post('/rationalization/get/governances', { node_id: payload })
            .then(response => {
              state.compareApps[payload].gobernances = response.data ? response.data : {}
            })
        })
    } else {
      Vue.delete(state.compareApps, payload)
    }
  }
}

const getters = {
  getApplication(state) {
    return state.application
  },
  getApplicationManagementTypes(state) {
    return state.applicationManagementTypes
  },
  getCapabilities(state) {
    return state.capabilities
  },
  getContactTags(state) {
    return state.contactTags
  },
  getFacingTypes(state) {
    return state.facingTypes
  },
  getfirstContactGroups(state) {
    return state.firstContactGroups
  },
  getLinkedContracts(state) {
    return state.linkedContracts
  },
  getMainCategories(state) {
    return state.mainCategories
  },
  usersByCompany(state) {
    return state.usersByCompany
  },
  getSSN(state) {
    return state.SSN
  },
  getStatus(state) {
    return state.status
  },
  getSubCategories(state) {
    return state.subCategories
  },
  getSubCategoriesByID(state) {
    if (state.categoryID) {
      let subcategoriesFiltered = null
      subcategoriesFiltered = state.subCategories.filter(ele => ele.parent === state.categoryID)

      if (subcategoriesFiltered.length > 0) {
        return subcategoriesFiltered
      } else {
        return []
      }
    } else {
      return []
    }
  },
  getSubCategoryTypes(state) {
    return state.subCategoryTypes
  },
  getVendors(state) {
    return state.vendors
  },
  getVendorsIT() {
    return state.vendors.filter(row => row.field_show_in_cpm_value !== '1')
  },
  getCompare(state) {
    return state.compare
  },
  getCompareApps(state) {
    return state.compareApps
  }
}


export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters,
  modules: {
    additionalInformation,
    contact,
    dependencies,
    information,
    instalationInformation,
    license,
    rationalization,
    settings
  }
}
