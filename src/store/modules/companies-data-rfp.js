import { db } from '@/utils/Firebase'
import { dataGet } from '@/utils/helpers'

const state = {
  proposalInvitations: []
}

const getters = {
  getProposalInvitations(state) {
    return state.proposalInvitations
  }
}

const mutations = {
  setProposalInvitations(state, proposalInvitations) {
    state.proposalInvitations = proposalInvitations
  }
}

const actions = {
  fetchProposalInvitations({ commit }, { cid, uid }) {
    if (!uid || !cid) return Promise.resolve([])

    return new Promise((resolve, reject) => {
      db.collection('proposals_invitations')
        .where('status', '==', 'sent')
        .where('invited_company', '==', cid)
        .where('contact.uid', '==', uid)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            resolve(false)
          } else {
            const proposalInvitations = []
            querySnapshot.forEach(doc => {
              const data = doc.data()
              const aux = {
                id: doc.id,
                cover: dataGet(data),
                coverUrl: dataGet(data, 'rfpData.cover.url'),
                contact: dataGet(data, 'contact'),
                invited_company: dataGet(data, 'invited_company'),
                rfpId: dataGet(data, 'rfpId'),
                status: dataGet(data, 'status'),
                managerLabel: dataGet(data, 'rfpData.manager.label', ''),
                projectName: dataGet(data, 'rfpData.projectRef.title', ''),
                rfpName: dataGet(data, 'rfpData.name', ''),
                rfpCost: dataGet(data, 'rfpData.cost', 0)
              }

              const campus = dataGet(data)
              if (campus && campus.length) {
                aux.campus = campus.map(campus => campus.levelName).join(',')
              } else {
                aux.campus = ''
              }

              proposalInvitations.push(aux)
            })
            commit('setProposalInvitations', proposalInvitations)
            resolve(true)
          }
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
