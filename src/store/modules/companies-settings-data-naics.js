import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  companiesSettingsDataNaics: []
}

const getters = {
  companiesSettingsDataNaics: state =>
    state.companiesSettingsDataNaics.map(item => ({
      ...item,
      id: item.id,
      codeTitle: `${item.code} - ${item.title}`
    }))
}

const actions = {
  bindCompaniesSettingsDataNaics: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'companiesSettingsDataNaics',
        db
          .collection('settings')
          .doc('global')
          .collection('naics')
          .orderBy('title'),
        { maxRefDepth: 0 }
      )

      // TO DO - Check if where condition is necessary

      // return bindFirestoreRef(
      //   'companiesSettingsDataNaics',
      //   db
      //     .collection('settings')
      //     .doc('global')
      //     .collection('naics')
      //     .where(
      //       'company',
      //       '==',
      //       db.collection('m6companies').doc(`${companyId}`)
      //     )
      //     .orderBy('title'),
      //   { maxRefDepth: 0 }
      // )
    }
  ),

  /* eslint-disable-next-line */
  store({ commit }, { companyId, resource = {} }) {
    if (!companyId) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      let result = await db
        .collection('settings')
        .doc('global')
        .collection('naics')
        .where('title', '==', resource.title)
        .get()

      if (result.empty) {
        result = await db
          .collection('settings')
          .doc('global')
          .collection('naics')
          .where('code', '==', resource.code)
          .get()
      }

      if (result.empty) {
        db.collection('settings')
          .doc('global')
          .collection('naics')
          .add({
            ...resource,
            company: db.collection('m6companies').doc(`${companyId}`)
          })
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource title or code already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  update({ commit }, { id, companyId, resource = {} }) {
    if (!id || !companyId) return Promise.reject()

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
          .update({
            ...resource,
            company: db.collection('m6companies').doc(`${companyId}`)
          })
          .then(resolve)
          .catch(reject)
      } else {
        reject('Resource title or code already exists.')
      }
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id, companyId }) {
    if (!id || !companyId) return Promise.reject()

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
