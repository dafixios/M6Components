import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

import Common from './_common'

const common = new Common('/m6-platform/api/general')

const state = {
  settingsGlobalRegions: []
}

const getters = {
  settingsGlobalRegions: state =>
    state.settingsGlobalRegions.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  bindSettingsGlobalRegions: firestoreAction(
    ({ bindFirestoreRef }, { maxRefDepth = 0 } = {}) => bindFirestoreRef(
      'settingsGlobalRegions',
      db
        .collection('settings')
        .doc('global')
        .collection('regions')
        .orderBy('text'),
      { maxRefDepth }
    )
  ),

  indexDrupal(_, { tid } = {}) {
    return new Promise(async (resolve, reject) => {
      const data = tid
        ? {
          action: 'get_terms_children',
          tid
        }
        : {
          action: 'get_terms_by_vocabulary',
          name: 'region'
        }

      common
        .store(_, data)
        .then(resolve)
        .catch(reject)
    })
  },

  store(_, { resource = {} }) {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .collection('settings')
        .doc('global')
        .collection('regions')
        .where('text', '==', resource.text)
        .get()

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('regions')
          .add(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource text already exists.')
      }
    })
  },

  update(_, { id, resource = {} }) {
    if (!id) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      const result = await db
        .collection('settings')
        .doc('global')
        .collection('regions')
        .where('text', '==', resource.text)
        .get()

      let third = false

      if (!result.empty) {
        third = result.docs.find(doc => doc.id !== id)
      }

      if (result.empty || !third) {
        db.collection('settings')
          .doc('global')
          .collection('regions')
          .doc(`${id}`)
          .update(resource)
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource text already exists.')
      }
    })
  },

  destroy(_, { id }) {
    if (!id) return Promise.reject()

    return db
      .collection('settings')
      .doc('global')
      .collection('regions')
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
