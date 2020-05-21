import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  settingsGlobalProductsAndServices: []
}

const getters = {
  settingsGlobalProductsAndServices: state =>
    state.settingsGlobalProductsAndServices.map(item => ({
      ...item,
      codeTitle: `${item.code} - ${item.title}`,
      id: item.id
    }))
}

const actions = {
  bindSettingsGlobalProductsAndServices: firestoreAction(
    ({ bindFirestoreRef }, { maxRefDepth = 0 } = {}) => bindFirestoreRef(
      'settingsGlobalProductsAndServices',
      db
        .collection('settings')
        .doc('global')
        .collection('products')
        .orderBy('title'),
      { maxRefDepth }
    )
  ),

  /* eslint-disable-next-line */
  store({ commit }, { resource = {} }) {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .collection('settings')
        .doc('global')
        .collection('products')
        .where('title', '==', resource.text)
        .get()

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('products')
          .add(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource text already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  update({ commit }, { id, resource = {} }) {
    if (!id) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      const result = await db
        .collection('settings')
        .doc('global')
        .collection('products')
        .where('title', '==', resource.text)
        .get()

      let third = false

      if (!result.empty) {
        third = result.docs.find(doc => doc.id !== id)
      }

      if (result.empty || !third) {
        db.collection('settings')
          .doc('global')
          .collection('products')
          .doc(`${id}`)
          .update(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource text already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id }) {
    if (!id) return Promise.reject()

    return db
      .collection('settings')
      .doc('global')
      .collection('products')
      .doc(`${id}`)
      .delete()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
