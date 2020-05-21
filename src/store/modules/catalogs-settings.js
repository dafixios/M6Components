import { firestoreAction } from 'vuexfire'
import { db } from '@/utils/Firebase'

const state = {
  categories: []
}

const getters = {
  getCategories(state) {
    return state.categories
  }
}

const mutations = {}

const actions = {
  bindProductCategories: firestoreAction(({ state, bindFirestoreRef, commit }) => bindFirestoreRef('categories',
    db
      .collection('settings')
      .doc(Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('catalog_products')
      .collection('categories')
      .orderBy('name', 'asc')))
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
