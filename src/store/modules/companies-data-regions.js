import { firestoreAction } from 'vuexfire'

import { dataGet } from '@/utils/helpers'
import { db } from '@/utils/Firebase'

function defaultState() {
  return {
    regions: {}
  }
}

const state = defaultState

const getters = {
  regions: state => {
    const data = dataGet(state, 'regions.regions', [])

    if (typeof data === 'string') {
      return JSON.parse(data)
    } else {
      return data
    }
  }
}

const actions = {
  bindCompaniesRegions: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'regions',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('regions')
      )
    }
  ),
  storeResource(_, { companyId, regions = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const regionsRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('regions')

      regionsRef
        .set({ regions: regions })
        .then(resolve)
        .catch(reject)
    })
  },
  updateResource(_, { companyId, regions = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const regionsRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('regions')

      regionsRef
        .set({ regions })
        .then(resolve)
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
