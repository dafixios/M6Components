import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  companiesSettingsDataCertifications: []
}

const getters = {
  companiesSettingsDataCertifications: state =>
    state.companiesSettingsDataCertifications.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  bindCompaniesSettingsDataCertifications: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'companiesSettingsDataCertifications',
        db
          .collection('settings')
          .doc('global')
          .collection('certifications')
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
        .collection('certifications')
        .where('text', '==', resource.text)
        .get()

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('certifications')
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
        .collection('certifications')
        .where('text', '==', resource.text)
        .get()

      let third = false

      if (!result.empty) {
        third = result.docs.find(doc => doc.id !== id)
      }

      if (result.empty || !third) {
        db.collection('settings')
          .doc('global')
          .collection('certifications')
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
      .collection('certifications')
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
