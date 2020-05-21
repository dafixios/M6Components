import { debounce, each } from 'lodash'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

// TODO: remove FFRL vars
import FFRL from './_fix-firestore-references-lost'
const ffrl = FFRL()

function defaultState() {
  return {
    campaigns: [],
    campaign: {},
    campaignId: null,
    associatedProspects: [],
    notAssociatedProspects: [],
    allowActions: false,
    context: null
  }
}

const state = defaultState

const getters = {
  getCampaigns(state) {
    return state.campaigns
  },
  getCampaign: state => {
    const data = state.campaign || {}
    // For reference's treatment is better use debounce because state change many times quickly
    // With debounce the interface doesn't freeze, keep it in mind :)
    // TODO: remove below debounce when the issue is solved
    // https://github.com/vuejs/vuefire/issues/325

    return data
  },
  getNotAssociatedProspects(state) {
    return state.notAssociatedProspects
  },
  getAllowActions(state) {
    return state.allowActions
  }
}

const mutations = {
  setNotAssociatedProspects(state, payload = []) {
    state.notAssociatedProspects = payload
  },
  addToNotAssociatedProspects(state, prospect = {}) {
    state.notAssociatedProspects.push(...prospect)
  },
  allowActionsInPanels(state, campaignId) {
    state.allowActions = true
    if (state.campaignId == null) {
      state.campaignId = campaignId
    }
  }
}

const actions = {
  bindCampaigns: firestoreAction(({ state, bindFirestoreRef, commit }) => bindFirestoreRef('campaigns', db.collection('campaigns'))),

  bindCampaign: firestoreAction((context, { id, prospects } = {}) => {
    if (id == null) {
      return Promise.reject()
    }

    context.state.campaignId = id
    context.state = context

    return context
      .bindFirestoreRef('campaign', db.collection('campaigns').doc(`${id}`))
      .then(() => {
        context.commit('setNotAssociatedProspects', prospects)
        context.commit('allowActionsInPanels', id)
      })
  })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
