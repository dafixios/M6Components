import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

function defaultState() {
  return {
    settings: {
      // General
      projectSize: false,
      annualRevenue: false,
      NAICS: false,
      region: false,

      // Financing
      financial: false,

      // Main
      title: false,
      description: false,
      certs: false,
      website: false,
      phone: false,
      address: false,
      mail: false,

      // Projects
      projects: false,
      diversity: false,

      // Panel
      locationPanel: false,
      productServicePanel: false,
      certificationPanel: false,
      contractorDataPanel: false,
      vendorInformationPanel: false,
      vendorActivitiesPanel: false,
      vendorAddressPanel: false,
      customerInformationPanel: false,
      customerAddressPanel: false,
      customerActivitiesPanel: false
    },
    editingVisibility: false
  }
}

const state = defaultState

const getters = {
  settings: state => state.settings || defaultState().settings,
  editingVisibility: state =>
    state.editingVisibility || defaultState().editingVisibility,
  switchStyle: state => {
    if (state.editingVisibility === true) {
      return {
        'z-index': 100
      }
    } else {
      return false
    }
  }
}

const actions = {
  bindCompaniesSettingsProfile: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'settings',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('settings')
          .doc('profile')
      )
    }
  ),

  /* eslint-disable-next-line */
  update({ commit }, { companyId, data = {} }) {
    if (!companyId) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      db.collection('m6companies')
        .doc(`${companyId}`)
        .collection('settings')
        .doc('profile')
        .set(data, { merge: true })
        .then(resolve)
        .catch(() =>
          // If error, try to create a new document.
          // TODO: validate error, maybe it's something other than document not existing
          db
            .collection('m6companies')
            .doc(`${companyId}`)
            .collection('settings')
            .doc('profile')
            .set(data)
            .then(resolve)
            .catch(reject)
        )
    })
  }
}

const mutations = {
  toggleVisibility(state, data) {
    if (data === false) {
      state.editingVisibility = false
      return
    } else {
      state.editingVisibility = !state.editingVisibility
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {}
}
