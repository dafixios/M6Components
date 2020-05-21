import { firestoreAction } from 'vuexfire'
import { db } from '@/utils/Firebase'
import settings from './catalogs-settings'

const state = {
  products: [],
  product: {},
  estimations: [],
  associatedEstimations: []
}

const getters = {
  getProducts(state) {
    return state.products
  },
  getProduct(state) {
    return state.product
  },
  getEstimations(state) {
    return state.estimations
  },
  getAssociatedEstimations(state) {
    return state.associatedEstimations
  }
}

const mutations = {
  setAssociatedEstimations(state, associatedEstimations) {
    state.associatedEstimations = associatedEstimations
  }
}

const actions = {
  bindProducts: firestoreAction(({ state, bindFirestoreRef, commit }) => bindFirestoreRef('products', db.collection('catalog').doc('products').collection('products').where('company_nid', '==', Drupal.settings.m6_platform_header.company_nid))),

  bindProduct: firestoreAction(({ bindFirestoreRef }, { id } = null) => {
    if (id == null) {
      return Promise.reject()
    }

    return bindFirestoreRef('product',
      db.collection('catalog').doc('products').collection('products').doc(id)
    )
  }),

  fetchAssociatedEstimations({ commit }, id = null) {
    if (id == null) {
      return Promise.reject('Product ID is required')
    }

    const productRef = db.collection('catalog').doc('products').collection('products').doc(id)

    const estimations = []

    db.collection('project_estimations')
      .where('productsId', 'array-contains', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          estimations.push({ ...doc.data(), id: doc.id })
        })
        console.log(estimations)
        commit('setAssociatedEstimations', estimations)
      })
      .catch(error => {})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    settings
  }
}
