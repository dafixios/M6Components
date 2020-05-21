import { firestoreAction } from 'vuexfire'
import { db } from '@/utils/Firebase'

const state = {
  prospectInfo: {},
  contacts: [],
  activitiesInfo: [],
  prospectId: [],
  contactRoles: [],
  saleStages: [],
  generalSaleStages: [],
  followUpTypes: [],
  activityTypes: [],
  statuses: [],
  sectors: [],
  industries: [],
  naics: [],
  products: [],
  associatedCampaigns: [],
  notAssociatedCampaigns: [],
  opportunities: [],
  prospectOpportunities: [],
  tags: []
}

const getters = {
  getProspectInfo(state) {
    return state.prospectInfo
  },
  getContacts(state) {
    return state.contacts
  },
  getActivitiesInfo(state) {
    return state.activitiesInfo
  },
  getProspectId(state) {
    return state.prospectId
  },
  getContactRoles(state) {
    return state.contactRoles
  },
  getSaleStages(state) {
    return state.saleStages
  },
  getGeneralSaleStages(state) {
    return state.generalSaleStages
  },
  getFollowUpTypes(state) {
    if ((state.followUpTypes || {}).followup_type) {
      return state.followUpTypes.followup_type
    } else {
      return []
    }
  },
  getActivityTypes(state) {
    if ((state.activityTypes || {}).activity_type) {
      return state.activityTypes.activity_type
    } else {
      return []
    }
  },
  getStatus(state) {
    if ((state.statuses || {}).status) {
      return state.statuses.status
    } else {
      return []
    }
  },
  getSectors(state) {
    if ((state.sectors || {}).sectors) {
      return state.sectors.sectors
    } else {
      return []
    }
  },
  getIndustries(state) {
    if ((state.industries || {}).industries) {
      return state.industries.industries
    } else {
      return []
    }
  },
  getNaics(state) {
    if ((state.naics || {}).naics) {
      return state.naics.naics
    } else {
      return []
    }
  },
  getProducts(state) {
    return state.products
  },
  getAssociatedCampaigns(state) {
    return state.associatedCampaigns || []
  },
  getNotAssociatedCampaigns(state) {
    return state.notAssociatedCampaigns || []
  },
  getOpportunities(state) {
    return state.opportunities || []
  },
  getProspectOpportunities(state) {
    return state.prospectOpportunities || []
  },
  getTags(state) {
    return state.tags.tags || []
  }
}

const mutations = {
  setProspectId(state, payload) {
    state.prospectId = payload
  },
  setCampaigns(state, campaigns = []) {
    state.associatedCampaigns = campaigns
  },
  setNotAssociatedCampaigns(state, campaigns = []) {
    state.notAssociatedCampaigns = campaigns
  }
}

const actions = {
  setProspectId({ commit }, payload) {
    commit('setProspectId', payload)
  },
  bindProspectInfo: firestoreAction(({ state, bindFirestoreRef, dispatch }) => bindFirestoreRef(
    'prospectInfo',
    db.collection('prospects').doc(state.prospectId)
  ).then(() => {
    dispatch('fetchCampaigns')
  })),
  bindContacts: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef(
    'contacts',
    db
      .collection('prospects')
      .doc(state.prospectId)
      .collection('contacts')
  ).then(() => {})),
  bindActivitiesInfo: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef(
    'activitiesInfo',
    db.collection('activities').where('prospectId', '==', state.prospectId)
  ).then(() => {})),
  bindContactRoles: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'contactRoles',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('contact_roles')
      .collection('roles')
      .orderBy('name', 'asc')
  )),
  bindSaleStages: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'saleStages',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('sale_stages')
      .collection('stages')
      .orderBy('name', 'asc')
  )),
  bindGeneralSaleStages: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'generalSaleStages',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('general_sale_stages')
      .collection('stages')
      .orderBy('name', 'asc')
  )),
  bindFollowUpTypes: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'followUpTypes',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('sales_and_marketing')
  )),
  bindActivityTypes: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'activityTypes',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('activity_type')
  )),
  bindStatus: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'statuses',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('sales_and_marketing')
  )),
  bindSectors: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'sectors',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('sales_and_marketing')
  )),
  bindIndustries: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'industries',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('opportunities')
  )),
  bindNaics: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'naics',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('opportunities')
  )),
  bindProducts: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'products',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('prospect_products')
      .collection('products')
      .orderBy('name', 'asc')
  )),
  bindOpportunities: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'opportunities',
    db
      .collection('opportunities')
      .where(
        'company_nid',
        '==',
        window.Drupal.settings.m6_platform_header.company_nid
      )
  )),
  bindProspectOpportunities: firestoreAction(({ state, bindFirestoreRef }) => bindFirestoreRef(
    'prospectOpportunities',
    db
      .collection('prospects')
      .doc(state.prospectId)
      .collection('opportunities')
  )),
  bindTags: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef(
    'tags',
    db
      .collection('settings')
      .doc(window.Drupal.settings.m6_platform_header.company_nid)
      .collection('settings')
      .doc('tags')
  )),
  fetchCampaigns({ commit }) {
    const associatedCampaigns = []
    const notAssociatedCampaigns = []

    db.collection('campaigns')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().prospects) {
            const campaignProspects = doc.data().prospects.map(prospect => ({
              id: prospect.id,
              name: prospect.title,
              avatar: prospect.avatar,
              reference: prospect
            }))

            let exist = false
            const size = campaignProspects.length

            for (let i = 0; i < size; i++) {
              if (campaignProspects[i].id === state.prospectId) {
                associatedCampaigns.push({
                  name: doc.data().name,
                  avatar: doc.data().avatar,
                  id: doc.id,
                  prospects: campaignProspects,
                  contacts: doc.data().contacts || []
                })
                exist = true
                break
              }
            }

            if (exist === false) {
              notAssociatedCampaigns.push({
                name: doc.data().name,
                avatar: doc.data().avatar,
                id: doc.id,
                prospects: campaignProspects
              })
            }
          } else {
            notAssociatedCampaigns.push({
              name: doc.data().name,
              avatar: doc.data().avatar,
              id: doc.id,
              prospects: []
            })
          }
        })
        commit('setCampaigns', associatedCampaigns)
        commit('setNotAssociatedCampaigns', notAssociatedCampaigns)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
