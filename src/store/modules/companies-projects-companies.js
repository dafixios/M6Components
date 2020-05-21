import { db } from '@/utils/Firebase'

const actions = {
  /* eslint-disable-next-line */
  store({ commit }, { companyId, projectId }) {
    if (!companyId || !projectId) return Promise.reject()

    const company = db.collection('companies_projects').doc(`${companyId}`)

    return new Promise(async (resolve, reject) => {
      const companies = await db
        .collection('companies_projects')
        .doc(`${projectId}`)
        .collection('companies')
        .where('company', '==', company)
        .get()

      if (companies.empty) {
        db.collection('companies_projects')
          .doc(`${projectId}`)
          .collection('companies')
          .doc(`${companyId}`)
          .set({ company })
          .then(resolve)
          .catch(reject)
      } else {
        resolve()
      }
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id, projectId }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!id || !projectId) return reject('Check the arguments')

        await db
          .collection('companies_projects')
          .doc(`${projectId}`)
          .collection('companies')
          .doc(`${id}`)
          .delete()

        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default {
  namespaced: true,
  actions
}
