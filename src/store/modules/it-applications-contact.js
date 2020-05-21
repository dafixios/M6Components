import axios from 'axios'
import { db } from '@/utils/Firebase'

const state = {
  tags: []
}

const actions = {
  fetchTags({ commit }) {
    return new Promise((resolve, reject) => {
      let resultTags = []
      db.collection('settings')
        .doc(window.Drupal.settings.m6_platform_header.company_nid)
        .collection('settings')
        .doc('applications')
        .get()
        .then(settings => {
          if (!settings.exists) {
            db.collection('settings')
              .doc(window.Drupal.settings.m6_platform_header.company_nid)
              .collection('settings')
              .doc('applications')
              .set({
                contact_tags: []
              })
            resolve(commit('setTags', resultTags))
          } else {
            const tags = settings.data()
            if (tags && Array.isArray(tags.contact_tags)) {
              resultTags = tags.contact_tags
            }
            resolve(commit('setTags', resultTags))
          }
        }).catch(reject)
    })
  }
}

const mutations = {
  setTags(state, payload) {
    state.tags = payload
  }
}

const getters = {
  getTags(state) {
    return state.tags
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
