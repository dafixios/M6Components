import { db } from '@/utils/Firebase'

const state = {
}

const actions = {
  updateWelcomeMessage({ commit }, payload) {
    const {
      message,
      isVisible,
      whiteBackgroud
    } = payload

    return new Promise((resolve, reject) => {
      db.collection('m6companies')
        .doc(Drupal.settings.m6_platform_header.company_nid)
        .collection('settings')
        .doc('applications').update(
          {
            welcome_message: {
              message: message,
              is_visible: isVisible,
              white_background: whiteBackgroud
            }
          }
        )
        .then(resolve)
        .catch(reject)
    })
  }
}

const mutations = {
}

const getters = {
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
