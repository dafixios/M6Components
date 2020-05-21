import { firestoreAction } from 'vuexfire'
import { dataGet } from '@/utils/helpers'

import { db } from '@/utils/Firebase'

function defaultState() {
  return {
    neededProductsServices: {}
  }
}

const state = defaultState

const getters = {
  neededProductsServices: state => {
    const data = dataGet(state, 'neededProductsServices.productsServices', [])

    if (typeof data === 'string') {
      return JSON.parse(data)
    } else {
      return data
    }
  }
}

const actions = {
  bindCompaniesNeededProductsServices: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'neededProductsServices',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('needed_products_services')
      )
    }
  ),

  storeResource(_, { companyId, productsAndServices = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const neededProductsServicesRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('needed_products_services')

      neededProductsServicesRef
        .set({ productsServices: productsAndServices })
        .then(resolve)
        .catch(reject)
    })
  },

  updateResource(_, { companyId, productsAndServices = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const neededProductsServicesRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('needed_products_services')

      neededProductsServicesRef
        .set({ productsServices: productsAndServices })
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
