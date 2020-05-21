import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

import companies from './companies-projects-companies'

const state = {
  companiesProjects: []
}

const getters = {
  companiesProjects: state =>
    state.companiesProjects.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  bindCompaniesProjects: firestoreAction(
    ({ bindFirestoreRef }, { companyId = 0, maxRefDepth = 0 } = {}) => bindFirestoreRef(
      'companiesProjects',
      db
        .collection('companies_projects')
        .where(
          'owner',
          '==',
          db.collection('m6companies').doc(`${companyId}`)
        )
        .orderBy('name'),
      { maxRefDepth }
    )
  ),

  /* eslint-disable-next-line */
  store({ commit }, { companyId, resource = {} }) {
    if (!companyId) return Promise.reject()

    const newResource = removeUndefinedFields(resource)

    return db.collection('companies_projects').add({
      ...newResource,
      owner: db.collection('m6companies').doc(`${companyId}`)
    })
  },

  /* eslint-disable-next-line */
  update({ commit }, { id, resource = {} }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) return Promise.reject()

        const newResource = removeUndefinedFields(resource)

        await db
          .collection('companies_projects')
          .doc(`${id}`)
          .update({
            ...newResource,
          })
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  },

  destroy({ commit }, id = '') {
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) return reject('Please send all of the required arguments')

        await db
          .collection('companies_projects')
          .doc(id)
          .delete()
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }
}

const removeUndefinedFields = obj => {
  const newObj = {}

  Object.keys(obj).forEach(key => {
    if (obj[key]) newObj[key] = obj[key]
  })

  return newObj
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  modules: {
    companies
  }
}
