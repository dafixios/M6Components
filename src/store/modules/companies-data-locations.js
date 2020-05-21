import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'
// TODO: remove FFRL vars
import FFRL from './_fix-firestore-references-lost'

const ffrl = FFRL()


function defaultState() {
  return {
    locations: {},

    // Below vars are temp, meanwhile the  author try to fix the issue
    // https://github.com/vuejs/vuefire/issues/325
    // TODO: remove below vars
    companyId: null,
    context: null
  }
}

const state = defaultState

const actions = {
  bindCompaniesDataLocations: firestoreAction(
    (context, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      // Below vars are temp, meanwhile the  author try to fix the issue
      // https://github.com/vuejs/vuefire/issues/325
      // TODO: remove below vars. Just keep { bindFirestoreRef }
      context.state.companyId = companyId
      context.state.contetext = context

      return context.bindFirestoreRef(
        'locations',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('locations')
      )
    }
  ),


  update({ commit }, { companyId, locations = {} }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const locationsRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('locations')

      locationsRef.get()
        .then(function (doc) {
          if (doc.exists) {
            locationsRef.set({ locations: locations })
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          } else {
            locationsRef.set({ locations: locations })
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          }
        })
        .catch(function (error) {
          console.error('Error getting document:', error)
          reject()
        })
    })
  },
  store({ commit }, { companyId, locations = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const locationsRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('locations')

      locationsRef.get()
        .then(function (doc) {
          if (doc.exists) {
            locationsRef.set({ locations: locations })
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          } else {
            // doc.data() will be undefined in this case
            locationsRef.set({ locations: locations })
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          }
        })
        .catch(function (error) {
          console.error('Error getting document:', error)
          reject()
        })
    })
  }
}

const mutations = {}

const getters = {
  locations: state => {
    const data = state.locations && state.locations.locations ? state.locations.locations : {}

    return data
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
