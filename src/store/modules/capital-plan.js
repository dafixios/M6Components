import { db } from '@/utils/Firebase.js'
import { firestoreAction } from 'vuexfire'

const state = {
  capitalId: '',
  capitalPlan: {
    projects: [],
    fiscalYear: {},
    forecasts: {},
    name: ''
  }
}

const getters = {
  projectsCount: state => {
    if (state.capitalPlan && state.capitalPlan.projects) {
      return state.capitalPlan.projects.length
    }
    return 0
  },
  projects: state => {
    if (state.capitalPlan && state.capitalPlan.projects) {
      return state.capitalPlan.projects
    }
    return []
  }

}

const mutations = {
  setCapitalId: (state, payload) => {
    state.capitalId = payload.id
  },
  setCapitalPlan: (state, payload) => {
    state.capitalPlan = payload
  }
}

const actions = {
  setCapitalId: (context, payload) => {
    context.commit('setCapitalId', payload)
  },
  bindCapitalPlanRef: firestoreAction(context => {
    // context contains all original properties like commit, state, etc
    // and adds `bindFirestoreRef` and `unbindFirestoreRef`
    // we return the promise returned by `bindFirestoreRef` that will
    // resolve once data is ready
    const capitalPlanId = context.state.capitalId
    return context.bindFirestoreRef('capitalPlan', db.collection('cpm_capital_plan').doc(capitalPlanId))
  })

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
