import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  settingsGlobalNaics: []
}

const getters = {
  settingsGlobalNaics: state =>
    state.settingsGlobalNaics.map(item => ({
      ...item,
      id: item.id,
      codeTitle: `${item.code} - ${item.title}`
    }))
}

const actions = {
  bindSettingsGlobalNaics: firestoreAction(
    ({ bindFirestoreRef }, { maxRefDepth = 0 } = {}) => bindFirestoreRef(
      'settingsGlobalNaics',
      db
        .collection('settings')
        .doc('global')
        .collection('naics')
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
        .collection('naics')
        .where('title', '==', resource.title)
        .get()

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('naics')
          .add(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource title or code already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  update({ commit }, { id, resource = {} }) {
    if (!id) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      let result = await db
        .collection('settings')
        .doc('global')
        .collection('naics')
        .where('title', '==', resource.title)
        .get()

      let third = false

      if (!result.empty) {
        third = result.docs.find(doc => doc.id !== id)
      }

      if (!third) {
        result = await db
          .collection('settings')
          .doc('global')
          .collection('naics')
          .where('code', '==', resource.code)
          .get()

        if (!result.empty) {
          third = result.docs.find(doc => doc.id !== id)
        }
      }

      if (result.empty || !third) {
        db.collection('settings')
          .doc('global')
          .collection('naics')
          .doc(`${id}`)
          .update(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource title or code already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id }) {
    if (!id) return Promise.reject()

    return db
      .collection('settings')
      .doc('global')
      .collection('naics')
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
