import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  companiesFinancing: []
}

const getters = {
  companiesFinancing: state => state.companiesFinancing.map(item => ({
    ...item,
    id: item.id,
    company: {
      ...item.company,
      // TODO: remove this legacy support for companies as string
      id: item.company.id || item.company
    }
  }))
}

const actions = {
  bindCompaniesFinancing: firestoreAction(
    ({ bindFirestoreRef }, { companyId, maxRefDepth = 1 } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'companiesFinancing',
        db
          .collection('m6companies')
          .doc(companyId)
          .collection('financing'),
        { maxRefDepth }
      )
    }
  ),

  /* eslint-disable-next-line */
  store({ commit }, { companyId, resource = {} }) {
    if (!companyId || !resource.company) return Promise.reject()

    const company = isNaN(resource.company)
      ? resource.company.id
      : resource.company

    return db
      .collection('m6companies')
      .doc(companyId)
      .collection('financing')
      .add({
        ...resource,
        company: db.collection('m6companies').doc(`${company}`)
      })
  },

  /* eslint-disable-next-line */
  update({ commit }, { id, companyId, currentProfile, resource = {} }) {
    return new Promise((resolve, reject) => {
      if (!id || !companyId || !resource.company) return reject('Please send the mandatory data')

      const company = isNaN(resource.company)
        ? companyId
        : resource.company

      const payload = {
        ...resource,
        company: db.collection('m6companies').doc(company)
      }

      db
        .collection('m6companies')
        .doc(currentProfile)
        .collection('financing')
        .doc(id)
        .set(payload, { merge: true })
        .then(resolve)
        .catch(reject)
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id, companyId }) {
    if (!id || !companyId) return Promise.reject()

    return db
      .collection('m6companies')
      .doc(companyId)
      .collection('financing')
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
