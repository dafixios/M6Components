import { firestoreAction } from 'vuexfire'

import { dataGet } from '@/utils/helpers'
import { db } from '@/utils/Firebase'

function defaultState() {
  return {
    companyTypes: {}
  }
}

const state = defaultState

const getters = {
  companyTypes: state => {
    const data = dataGet(state, 'companyTypes.companyTypes', [])

    if (typeof data === 'string') {
      return JSON.parse(data)
    } else {
      return data
    }
  }
}

const actions = {
  bindCompaniesCompanyTypes: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'companyTypes',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('company_types')
      )
    }
  ),
  storeResource(_, { companyId, companyTypes = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const companyTypesRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('company_types')

      companyTypesRef
        .set({ companyTypes: companyTypes })
        .then(resolve)
        .catch(reject)
    })
  },
  updateResource(_, { companyId, companyTypes = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const companyTypesRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('company_types')

      companyTypesRef
        .set({ companyTypes })
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
