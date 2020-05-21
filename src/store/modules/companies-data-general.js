import {
  debounce,
  each,
  isArray,
  isString
} from 'lodash'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

// TODO: remove FFRL vars
import FFRL from './_fix-firestore-references-lost'
const ffrl = FFRL()

function defaultState() {
  return {
    general: {
      projectSize: '',
      annualRevenue: '',
      NAICS: [],
      region: ''
    },

    // Below vars are temp, meanwhile the  author try to fix the issue
    // https://github.com/vuejs/vuefire/issues/325
    // TODO: remove below vars
    companyId: null,
    context: null
  }
}

const state = defaultState

const getters = {
  general: state => {
    const data = state.general || defaultState().general

    // For reference's treatment is better use debounce because state change many times quickly
    // With debounce the interface doesn't freeze, keep it in mind :)
    // TODO: remove below debounce when the issue is solved
    // https://github.com/vuejs/vuefire/issues/325
    debounce(function () {
      // is mandatory use lodash.each() or vanilla for() in order to keep the id
      // https://vuefire.vuejs.org/vuexfire/binding-subscriptions.html#using-the-data-bound-by-vuexfire
      each(data.NAICS || [], NAICS => {
        if (isArray(NAICS)) {
          ffrl(NAICS.filter(item => isString(item)), () => {
            state.context.dispatch('bindCompaniesDataGeneral', {
              companyId: state.companyId
            })
          })
        }
      })
    }, 1000)()

    debounce(function () {
      Object.keys(data).forEach(key => {
        if (key === 'NAICS') {
          data.NAICS = data.NAICS.filter(item => item && !isString(item)).map(
            item =>
              item
                ? // TODO: remove this validation for legacy strings values
                isString(item)
                  ? { title: item, codeTitle: item }
                  : {
                    ...item,
                    id: item.id,
                    codeTitle: `${item.code} - ${item.title}`
                  }
                : {}
          )
        } else {
          data[key] = data[key]
            ? // TODO: remove this validation for legacy strings values
            isString(data[key])
              ? { text: data[key] }
              : {
                ...data[key],
                id: data[key].id
              }
            : {}
        }
      })
    }, 1000)()

    return data
  }
}

const actions = {
  bindCompaniesDataGeneral: firestoreAction((context, { companyId } = {}) => {
    if (!companyId) return Promise.reject()

    // Below vars are temp, meanwhile the  author try to fix the issue
    // https://github.com/vuejs/vuefire/issues/325
    // TODO: remove below vars. Just keep { bindFirestoreRef }
    context.state.companyId = companyId
    context.state.context = context

    return context.bindFirestoreRef(
      'general',
      db
        .collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('general')
    )
  }),

  /* eslint-disable-next-line */
  update({ commit }, { companyId, data = {} }) {
    if (!companyId) return Promise.reject()
    return new Promise(async (resolve, reject) => {
      const NAICS = (data.NAICS || []).filter(item => item.id)
      const general = { ...data, NAICS: [] }

      await Promise.all(
        NAICS.map(async item =>
          general.NAICS.push(
            db
              .collection('settings')
              .doc('global')
              .collection('naics')
              .doc(item.id)
          )
        )
      )
      if (((data || {}).annualRevenue || {}).id != null) {
        general.annualRevenue = db
          .collection('settings')
          .doc('global')
          .collection('annual_revenue')
          .doc(data.annualRevenue.id)
      } else {
        delete general.annualRevenue
      }

      if (((data || {}).projectSize || {}).id != null) {
        general.projectSize = db
          .collection('settings')
          .doc('global')
          .collection('project_size_capable')
          .doc(data.projectSize.id)
      } else {
        delete general.projectSize
      }

      if (((data || {}).region || {}).id != null) {
        general.region = db
          .collection('settings')
          .doc('global')
          .collection('regions')
          .doc(data.region.id)
      } else {
        delete general.region
      }

      db.collection('m6companies')
        .doc(`${companyId}`)
        .collection('data')
        .doc('general')
        .update(general)
        .then(resolve)
        .catch(() =>
          // If error, try to create a new document.
          // TODO: validate error, maybe it's something other than document not existing
          db
            .collection('m6companies')
            .doc(`${companyId}`)
            .collection('data')
            .doc('general')
            .set(general)
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
