import Common from './_common'
import generals from './it-contracts-generals'
import pricing from './it-contracts-pricing'
import committes from './it-contracts-committees'
import { db } from '@/utils/Firebase'
import axios from 'axios'

const common = new Common('/m6-platform/api/contracts')

const state = {
  contactTags: [],
  companyVendorUsers: [],
  documentTypes: [],
  categoryTypes: [],
  contractTypes: [],
  costCenter: [],
  contactComittee: [],
  contactTags: [],
  contractList: [],
  currentContract: null,
  internalOversightLeader: [],
  renewalNoticePeriod: [],
  resolutionEffort: [],
  service: [],
  supportModel: [],
  contactType: [],
  effort: [],
  locations: [],
  proFormaTimePeriod: [],
  recurringType: [],
  status: [],
  productStatus: [],
  serviceLevel: [],
  terms: [],
  termsAudience: [],
  authorizerRole: [],
  showEditContractModal: null,
  statusPanel: null,
  criticalDecisionPanel: null,
  termDatePanel: null,
  notificationTemplates: [],
  defaultNotificationTemplates: []
}

const mutations = {
  setContactTags(state, payload) {
    state.contactTags = payload
  },
  setCompanyVendorUsers(state, payload) {
    state.companyVendorUsers = payload
  },
  setDocumentTypes(state, payload) {
    state.documentTypes = payload.map(i => ({ id: i.value, name: i.text }))
  },
  setCategoryTypes(state, payload) {
    state.categoryTypes = payload.map(i => ({ id: i.value, name: i.text }))
  },
  setContractTypes(state, payload) {
    state.contractTypes = payload.map(i => ({
      id: i.id.toString(),
      name: i.label
    }))
  },
  setCostCenter(state, payload) {
    state.costCenter = payload
  },
  setContactComittee(state, payload) {
    state.contactComittee = payload
  },
  setCurrentContract(state, payload) {
    state.currentContract = payload
  },
  setInternalOversightLeader(state, payload) {
    state.internalOversightLeader = payload
  },
  setRenewalNoticePeriod(state, payload) {
    state.renewalNoticePeriod = payload
  },
  setResolutionEffort(state, payload) {
    state.resolutionEffort = payload
  },
  setService(state, payload) {
    state.service = payload
  },
  setSupportModel(state, payload) {
    state.supportModel = payload
  },
  setContactType(state, payload) {
    state.contactType = payload
  },
  setEffort(state, payload) {
    state.effort = payload
  },
  setLocations(state, payload) {
    state.locations = payload.map(i => ({ id: i.value, name: i.text }))
  },
  setProFormaTimePeriod(state, payload) {
    state.proFormaTimePeriod = payload
  },
  setRecurringType(state, payload) {
    state.recurringType = payload
  },
  setContractList(state, payload) {
    state.contractList = payload
  },
  setStatus(state, payload) {
    state.status = payload
  },
  setProductStatus(state, payload) {
    state.productStatus = payload
  },
  setServiceLevel(state, payload) {
    state.serviceLevel = payload
  },
  setTerms(state, payload) {
    state.terms = payload
  },
  setTermsAudience(state, payload) {
    state.termsAudience = payload.map(i => ({ id: i.value, name: i.text }))
  },
  setAuthorizerRole(state, payload) {
    state.authorizerRole = payload
  },
  addUserTocompanyVendorUsers(state, payload) {
    state.companyVendorUsers.indexOf(payload) === -1 ? state.companyVendorUsers.push(payload) : ''
  },
  openEditContractModal(state, payload) {
    if (!state.showEditContractModal) {
      state.showEditContractModal = {
        value: true,
        text: payload
      }
    } else {
      state.showEditContractModal = {
        value: !state.showEditContractModal.value,
        text: payload
      }
    }
  },
  updateStatusPanel(state, payload) {
    state.statusPanel = payload
  },
  updateCriticalDecisionPanel(state, payload) {
    state.criticalDecisionPanel = payload
  },
  updateTermDatePanel(state, payload) {
    state.termDatePanel = payload
  },
  setNotificationTemplate(state, payload) {
    state.notificationTemplates = payload
  },
  setDefaultNotificationTemplates(state, payload) {
    state.defaultNotificationTemplates = payload
  }
}

const actions = {
  index: (...args) => common.store(...args),
  show: (...args) => common.store(...args),
  fetchContactTags({ commit }) {
    return new Promise((resolve, reject) => {
      const itContactTags = axios.post('/m6-platform/api/general', {
        action: 'get_settings',
        type: 'it_contact_tag'
      })

      const contractTags = axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'contact_tags'
      })

      Promise.all([itContactTags, contractTags]).then(([itTags, cTags]) => {
        const resultTags = [
          ...this.$h.dg(itTags, 'data.result.settings'),
          ...this.$h.dg(cTags, 'data.result.settings')
        ]
        resolve(commit('setContactTags', resultTags))
      }).catch(reject)
    })
  },
  fetchCompanyVendorUsers({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', { action: 'get_vendors_list' })
        .then(response => {
          resolve(commit('setCompanyVendorUsers', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchNotificationTemplates({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_notification_templates'
      })
        .then(response => {
          resolve(commit('setNotificationTemplate', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchDefaultNotificationTemplates({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_template_default'
      })
        .then(response => {
          resolve(commit('setDefaultNotificationTemplates', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchDocumentTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'document_type'
      })
        .then(response => {
          resolve(commit('setDocumentTypes', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchCategoryTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'category'
      })
        .then(response => {
          resolve(commit('setCategoryTypes', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchContractList({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_contracts_list'
      })
        .then(response => {
          resolve(commit('setContractList', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchContractTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_contract_type_options'
      })
        .then(response => {
          resolve(commit('setContractTypes', response.data.result))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchCostCenter({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'cost_center'
      })
        .then(response => {
          resolve(commit('setCostCenter', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchContactComitte({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'contact_committee'
      })
        .then(response => {
          resolve(commit('setContactComittee', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchInternalOversightLeader({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'internal_oversight_leader'
      })
        .then(response => {
          resolve(commit('setInternalOversightLeader', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchRenewalNoticePeriod({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'renewal_notice_period'
      })
        .then(response => {
          resolve(commit('setRenewalNoticePeriod', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchResolutionEffort({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'resolution_effort'
      })
        .then(response => {
          resolve(commit('setResolutionEffort', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchService({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'service'
      })
        .then(response => {
          resolve(commit('setService', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchSupportModel({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'support_model'
      })
        .then(response => {
          resolve(commit('setSupportModel', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchContactType({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'contact_type'
      })
        .then(response => {
          resolve(commit('setSupportModel', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchEffort({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'effort'
      })
        .then(response => {
          resolve(commit('setEffort', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchLocations({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'locations'
      })
        .then(response => {
          resolve(commit('setLocations', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchProFormaTimePeriod({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'pro_forma_time_period'
      })
        .then(response => {
          resolve(commit('setProFormaTimePeriod', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchRecurringType({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'recurring_type'
      })
        .then(response => {
          resolve(commit('setRecurringType', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchStatus({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
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

  fetchProductStatus({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'product_status'
      })
        .then(response => {
          resolve(commit('setProductStatus', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchServiceLevel({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'service_level'
      })
        .then(response => {
          resolve(commit('setServiceLevel', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchTerms({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'terms'
      })
        .then(response => {
          resolve(commit('setTerms', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  fetchTermsAudience({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'terms_audience'
      })
        .then(response => {
          resolve(commit('setTermsAudience', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },


  fetchAuthorizerRole({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/general', {
        action: 'get_contracts_settings',
        type: 'authorizer_role'
      })
        .then(response => {
          resolve(commit('setAuthorizerRole', response.data.result.settings))
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  updateWelcomeMessage({ commit }, payload) {
    const {
      message,
      isVisible,
      whiteBackgroud
    } = payload

    return new Promise((resolve, reject) => {
      db.collection('m6companies')
        .doc(window.Drupal.settings.m6_platform_header.company_nid)
        .collection('settings')
        .doc('contracts').set(
          {
            welcome_message: {
              message: message,
              is_visible: isVisible,
              white_background: whiteBackgroud
            }
          },
          { merge: true }
        )
        .then(resolve)
        .catch(reject)
    })
  }

}

const getters = {
  getContactTags(state) {
    return state.contactTags
  },
  getCompanyVendorUsers(state) {
    return state.companyVendorUsers
  },
  getDocumentTypes(state) {
    return state.documentTypes
  },
  getCategoryTypes(state) {
    return state.categoryTypes
  },
  getContractList(state) {
    return state.contractList
  },
  getContractTypes(state) {
    return state.contractTypes
  },
  getCostCenter(state) {
    return state.costCenter
  },
  getContactComittee(state) {
    return state.contactComittee
  },
  getCurrentContract(state) {
    return state.currentContract
  },
  getInternalOversightLeader(state) {
    return state.internalOversightLeader
  },
  getRenewalNoticePeriod(state) {
    return state.renewalNoticePeriod
  },
  getResolutionEffort(state) {
    return state.resolutionEffort
  },
  getService(state) {
    return state.service
  },
  getSupportModel(state) {
    return state.supportModel
  },
  getContactType(state) {
    return state.contactType
  },
  getEffort(state) {
    return state.effort
  },
  getLocations(state) {
    return state.locations
  },
  getProFormaTimePeriod(state) {
    return state.proFormaTimePeriod
  },
  getRecurringType(state) {
    return state.recurringType
  },
  getStatus(state) {
    return state.status
  },
  getProductStatus(state) {
    return state.productStatus
  },
  getServiceLevel(state) {
    return state.serviceLevel
  },
  getTerms(state) {
    return state.terms
  },
  getTermsAudience(state) {
    return state.termsAudience
  },
  getAuthorizerRole(state) {
    return state.authorizerRole
  },
  getShowEditContractModal(state) {
    return state.showEditContractModal
  },
  updateStatusPanelGetter(state) {
    return state.statusPanel
  },
  updateCriticalDecisionPanelGetter(state) {
    return state.criticalDecisionPanel
  },
  updateTermDatePanelGetter(state) {
    return state.termDatePanel
  },
  getNotificationTemplates(state) {
    return state.notificationTemplates
  },
  getDefaultNotificationTemplates(state) {
    let data = []
    if ((state.defaultNotificationTemplates || {}).default) {
      data = Object.entries(state.defaultNotificationTemplates.default)
    }

    return data
  },
  getDefaultNotificationTemplateOptions(state) {
    let data = []
    if ((state.defaultNotificationTemplates || {}).options) {
      data = state.defaultNotificationTemplates.options
    }

    return data
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters,
  modules: {
    generals,
    pricing,
    committes
  }
}

