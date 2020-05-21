import { debounce, each } from 'lodash'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

// TODO: remove FFRL vars
import FFRL from './_fix-firestore-references-lost'
const ffrl = FFRL()

function defaultState() {
  return {
    naics: {},

    // Below vars are temp, meanwhile the  author try to fix the issue
    // https://github.com/vuejs/vuefire/issues/325
    // TODO: remove below vars
    companyId: null,
    context: null
  }
}

const state = defaultState

const getters = {
  naics: state => {
    if (state.naics) {
      if (state.naics.naics) {
        return state.naics.naics
      }
    } else {
      return []
    }
  }
}

const actions = {
  bindCompaniesDataNaics: firestoreAction(
    (context, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      // Below vars are temp, meanwhile the  author try to fix the issue
      // https://github.com/vuejs/vuefire/issues/325
      // TODO: remove below vars. Just keep { bindFirestoreRef }
      context.state.companyId = companyId
      context.state.context = context

      return context.bindFirestoreRef(
        'naics',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('naics')
      )
    }
  ),
  storeResource({ commit }, { companyId, naics = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const naicsRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('naics')

      naicsRef.set({ naics: naics })
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  updateResource({ commit }, { companyId, naics = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const naicsRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('naics')

      naicsRef.set({ naics: naics })
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
