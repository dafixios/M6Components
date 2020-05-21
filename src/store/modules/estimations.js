import { firestoreAction } from 'vuexfire'
import { db } from '@/utils/Firebase'

const state = {
  estimations: [],
  lastEstimation: null,
  estimation: {},
  notAssociatedProducts: [],
  associatedProducts: [],
  projects: []
}

const getters = {
  getEstimations(state) {
    return state.estimations
  },
  getEstimation(state) {
    return state.estimation
  },
  getNotAssociatedProducts(state) {
    return state.notAssociatedProducts
  },
  getProjects(state) {
    return state.projects
  }
}

const mutations = {
  setAsssociatedProducts(state, allProducts) {
    let associatedProductsId = []
    if (((state || {}).estimation || {}).products) {
      associatedProductsId = state.estimation.products.map(product => product.id)
    }

    const notAssociatedProducts = allProducts.filter(product => {
      if (!associatedProductsId.includes(product.id)) {
        return true
      }
    })

    state.notAssociatedProducts = notAssociatedProducts.map(product => ({
      id: product.id,
      product: product
    }))
  },

  setNotAssociatedProducts(state, payload) {
    state.notAssociatedProducts = payload
  },

  setProjects(state, projects) {
    state.projects = projects
  }
}

const actions = {
  bindEstimations: firestoreAction(({ state, bindFirestoreRef, commit }) => bindFirestoreRef('estimations', db.collection('project_estimations').where('company_nid', '==', Drupal.settings.m6_platform_header.company_nid))
    .then(() => {})),

  bindEstimation: firestoreAction(({ bindFirestoreRef }, { id } = null) => {
    if (id == null) {
      return Promise.reject()
    }

    return bindFirestoreRef('estimation',
      db.collection('project_estimations').doc(id)
    ).then(() => {})
  }),

  fetchAssociatedProducts({ commit }, { estimationId } = {}) {
    if (estimationId === null) {
      return Promise.reject('Estimation ID is required')
    }

    const products = []

    db.collection('catalog')
      .doc('products').collection('products')
      .where('company_nid', '==', Drupal.settings.m6_platform_header.company_nid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const product = {
            id: doc.id,
            name: doc.data().name,
            avatar: doc.data().avatar || ''
          }

          products.push(product)
        })

        commit('setAsssociatedProducts', products)
      })
      .catch(error => {})
  },
  fetchProjects({ commit }) {
    return new Promise((resolve, reject) => {
      const projects = []
      db.collection('cpm_projects')
        .where('company_nid', '==', Drupal.settings.m6_platform.company_nid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const project = {
              id: doc.id,
              title: doc.data().title
            }
            projects.push(project)
          })
          commit('setProjects', projects)
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
  mutations,
  actions
}
