import { debounce, each, isString } from 'lodash'
import notate from 'notate'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

// TODO: remove FFRL vars
import FFRL from './_fix-firestore-references-lost'
const ffrl = FFRL()

function defaultState() {
  return {
    companiesAwardedProjects: [],

    // Below vars are temp, meanwhile the  author try to fix the issue
    // https://github.com/vuejs/vuefire/issues/325
    // TODO: remove below vars
    companyId: null,
    context: null
  }
}

const state = defaultState

const getters = {
  companiesAwardedProjects: state => {
    // For reference's treatment is better use debounce because state change many times quickly
    // With debounce the interface doesn't freeze, keep it in mind :)
    // TODO: remove below debounce when the issue is solved
    // https://github.com/vuejs/vuefire/issues/325
    debounce(function () {
      let contractors = []

      // is mandatory use lodash.each() or vanilla for() in order to keep the id
      // https://vuefire.vuejs.org/vuexfire/binding-subscriptions.html#using-the-data-bound-by-vuexfire
      each(state.companiesAwardedProjects || [], main => {
        contractors = contractors.concat(
          main.project ? main.project.contractors : []
        )
      })

      ffrl(contractors, () => {
        state.context.dispatch('bindCompaniesAwardedProjects', {
          companyId: state.companyId
        })
      })
    }, 1000)()

    return state.companiesAwardedProjects
      .filter(item => item.project && !isString(item.project))
      .map(item => ({
        ...item.project,
        id: item.id,
        project_id: item.project.id,
        owner: {
          ...item.project.owner,
          id: (item.project.owner || {}).id
        },
        contractors:
          typeof notate(item, 'project.contractors.0') === 'object'
            ? item.project.contractors.map(contractor => ({
              ...contractor,
              id: (contractor || {}).id
            }))
            : item.project.contractors
      }))
  }
}

const actions = {
  bindCompaniesAwardedProjects: firestoreAction(
    (context, { companyId, maxRefDepth = 2 } = {}) => {
      if (!companyId) return Promise.reject()

      // Below vars are temp, meanwhile the  author try to fix the issue
      // https://github.com/vuejs/vuefire/issues/325
      // TODO: remove below vars. Just keep { bindFirestoreRef }
      context.state.companyId = companyId
      context.state.context = context

      return context.bindFirestoreRef(
        'companiesAwardedProjects',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('awarded_projects'),
        { maxRefDepth }
      )
    }
  ),

  /* eslint-disable-next-line */
  store({ commit }, { companyId, projectId }) {
    if (!companyId || !projectId) return Promise.reject()

    const project = db.collection('companies_projects').doc(`${projectId}`)

    return new Promise(async (resolve, reject) => {
      const projects = await db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('awarded_projects')
        .where('project', '==', project)
        .get()

      if (projects.empty) {
        db.collection('m6companies')
          .doc(`${companyId}`)
          .collection('awarded_projects')
          .add({ project })
          .then(resolve)
          .catch(reject)
      } else {
        resolve()
      }
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id, companyId }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!id || !companyId) return reject('please check the arguments')

        await db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('awarded_projects')
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
  state,
  getters,
  actions
}
