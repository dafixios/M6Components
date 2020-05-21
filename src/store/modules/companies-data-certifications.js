import { debounce, each } from 'lodash'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

// TODO: remove FFRL vars
import FFRL from './_fix-firestore-references-lost'
const ffrl = FFRL()

function defaultState() {
  return {
    certifications: {},

    // Below vars are temp, meanwhile the  author try to fix the issue
    // https://github.com/vuejs/vuefire/issues/325
    // TODO: remove below vars
    companyId: null,
    context: null
  }
}

const state = defaultState

const getters = {
  certifications: state => {
    const data = state.certifications || {}

    // For reference's treatment is better use debounce because state change many times quickly
    // With debounce the interface doesn't freeze, keep it in mind :)
    // TODO: remove below debounce when the issue is solved
    // https://github.com/vuejs/vuefire/issues/325
    debounce(function () {
      // is mandatory use lodash.each() or vanilla for() in order to keep the id
      // https://vuefire.vuejs.org/vuexfire/binding-subscriptions.html#using-the-data-bound-by-vuexfire
      each(state.certifications || {}, main =>
        ffrl(main, () => {
          state.context.dispatch('bindCompaniesDataCertifications', {
            companyId: state.companyId
          })
        })
      )
    }, 1000)()

    debounce(function () {
      Object.keys(data).forEach(key => {
        data[key] = data[key].map(item => ({
          ...item,
          id: item.id
        }))
      })
    }, 1000)()

    return data
  }
}

const actions = {
  addNewCertificationToCompany({ commit }, payload) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },
  bindCompaniesDataCertifications: firestoreAction(
    (context, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      // Below vars are temp, meanwhile the  author try to fix the issue
      // https://github.com/vuejs/vuefire/issues/325
      // TODO: remove below vars. Just keep { bindFirestoreRef }
      context.state.companyId = companyId
      context.state.context = context

      return context.bindFirestoreRef(
        'certifications',
        db
          .collection('m6companies')
          .doc(`${companyId}`)
          .collection('data')
          .doc('certifications')
      )
    }
  ),

  /* eslint-disable-next-line */
  update({ commit }, { companyId, data = {} }) {
    if (!companyId) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      const pending = (data.pending || []).filter(item => item.id)
      const certifications = { pending: [] }

      await Promise.all(
        pending.map(async item =>
          certifications.pending.push(
            db
              .collection('settings')
              .doc('global')
              .collection('certifications')
              .doc(item.id)
          )
        )
      )

      db.collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('certifications')
        .update(certifications)
        .then(resolve)
        .catch(() =>
          // If error, try to create a new document.
          // TODO: validate error, maybe it's something other than document not existing
          db
            .collection('m6companies')
            .doc(`${companyId}`)
            .collection('data')
            .doc('certifications')
            .set(certifications)
            .then(resolve)
            .catch(reject)
        )
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
