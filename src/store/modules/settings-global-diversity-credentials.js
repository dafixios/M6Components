import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  settingsGlobalDiversity: []
}

const getters = {
  settingsGlobalDiversity: state =>
    state.settingsGlobalDiversity.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  bindSettingsGlobalDiversity: firestoreAction(
    ({ bindFirestoreRef }, { maxRefDepth = 0 } = {}) =>
      bindFirestoreRef(
        'settingsGlobalDiversity',
        db
          .collection('settings')
          .doc('global')
          .collection('diversity')
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
        .collection('diversity')
        .where('title', '==', resource.title)
        .get()

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('diversity')
          .add(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource title already exists.')
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
        .collection('diversity')
        .where('title', '==', resource.title)
        .get()

      let third = false

      if (!result.empty) {
        third = result.docs.find(doc => doc.id !== id)
      }

      if (result.empty || !third) {
        db.collection('settings')
          .doc('global')
          .collection('diversity')
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
      .collection('diversity')
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
