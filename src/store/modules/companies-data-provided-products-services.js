import { firestoreAction } from 'vuexfire'

import { dataGet } from '@/utils/helpers'
import { db } from '@/utils/Firebase'

function defaultState() {
  return {
    providedProductsServices: {}
  }
}

const state = defaultState

const getters = {
  providedProductsServices: state => {
    const data = dataGet(state, 'providedProductsServices.productsServices', [])

    if (typeof data === 'string') {
      return JSON.parse(data)
    } else {
      return data
    }
  }
}

const actions = {
  bindCompaniesProvidedProductsServices: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'providedProductsServices',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('provided_products_services')
      )
    }
  ),
  storeResource(_, { companyId, productsAndServices = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const providedProductsServicesRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('provided_products_services')

      providedProductsServicesRef
        .set({ productsServices: productsAndServices })
        .then(resolve)
        .catch(reject)
    })
  },
  updateResource(_, { companyId, productsAndServices = [] }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const providedProductsServicesRef = db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('provided_products_services')

      providedProductsServicesRef
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
