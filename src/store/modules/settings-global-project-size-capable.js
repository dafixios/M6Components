import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  settingsGlobalProjectSizeCapable: []
}

const getters = {
  settingsGlobalProjectSizeCapable: state =>
    state.settingsGlobalProjectSizeCapable.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  bindSettingsGlobalProjectSizeCapable: firestoreAction(
    ({ bindFirestoreRef }, { maxRefDepth = 0 } = {}) => bindFirestoreRef(
      'settingsGlobalProjectSizeCapable',
      db
        .collection('settings')
        .doc('global')
        .collection('project_size_capable')
        .orderBy('text'),
      { maxRefDepth }
    )
  ),

  /* eslint-disable-next-line */
  store({ commit }, { resource = {} }) {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .collection('settings')
        .doc('global')
        .collection('project_size_capable')
        .where('text', '==', resource.text)
        .get()

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('project_size_capable')
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
        .collection('project_size_capable')
        .where('text', '==', resource.text)
        .get()

      let third = false

      if (!result.empty) {
        third = result.docs.find(doc => doc.id !== id)
      }

      if (result.empty || !third) {
        db.collection('settings')
          .doc('global')
          .collection('project_size_capable')
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
      .collection('project_size_capable')
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
