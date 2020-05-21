import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  companiesSettingsDataProjectSizeCapable: []
}

const getters = {
  companiesSettingsDataProjectSizeCapable: state =>
    state.companiesSettingsDataProjectSizeCapable.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  bindCompaniesSettingsDataProjectSizeCapable: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'companiesSettingsDataProjectSizeCapable',
        db
          .collection('settings')
          .doc('global')
          .collection('project_size_capable')
          .where(
            'company',
            '==',
            db.collection('m6companies').doc(`${companyId}`)
          )
          .orderBy('text'),
        { maxRefDepth: 0 }
      )
    }
  ),

  /* eslint-disable-next-line */
  store({ commit }, { companyId, resource = {} }) {
    if (!companyId) return Promise.reject()

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
          .add({
            ...resource,
            company: db.collection('m6companies').doc(`${companyId}`)
          })
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource text already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  update({ commit }, { id, companyId, resource = {} }) {
    if (!id || !companyId) return Promise.reject()

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
          .update({
            ...resource,
            company: db.collection('m6companies').doc(`${companyId}`)
          })
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource text already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id, companyId }) {
    if (!id || !companyId) return Promise.reject()

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
