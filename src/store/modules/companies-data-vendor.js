import axios from 'axios'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  vendor: {},
  activityTypes: []
}

const getters = {
  getVendor(state) {
    return state.vendor
  },
  getActivityTypes(state) {
    if ((state.activityTypes || {}).activity_type) {
      return state.activityTypes.activity_type
    } else {
      return []
    }
  }
}

const mutations = {
  setVendor(state, payload) {
    const vendor = {
      id: 0,
      name: '',
      phone_number: '',
      contacts: [],
      roles: [],
      tags: [],
      json_data: {
        company_type: {
          companyTypeText: '',
          companyType: null,
          companyTypeL2: null,
          companyTypeL3: null
        }
      },
      vendor_header: false
    }

    payload.fka = payload.privateInfo.fka
    payload.aka = payload.privateInfo.aka
    payload.company_description = payload.privateInfo.company_description
    payload.company_email = payload.privateInfo.company_email
    payload.name = payload.privateInfo.name
    payload.phone_number = payload.privateInfo.phone_number
    payload.website = payload.privateInfo.website

    state.vendor = { ...vendor, ...payload }
  }
}

const actions = {
  fetchVendor(context, id) {
    if (id == null) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      axios
        .post(`/vendor_profiles/get/${id}`, { type: 'vendor' })
        .then(response => {
          if (((response || {}).data || {}).result) {
            context.commit('setVendor', response.data.result)
            resolve(response.data.result)
          } else {
            reject('response error')
          }
        })
    })
  },

  updateVendor(context, vendor = null) {
    if (vendor == null) return Promise.reject('Vendor is required')

    vendor.globalType = 'vendor'
    vendor.form = 'edit'
    vendor.add_new = 'vendor'
    vendor.json_data.company_type = []

    if (
      ((vendor || {}).status_edit || {}).id &&
      vendor.status_edit.id !== undefined
    ) {
      vendor.status = vendor.status_edit.id
    } else {
      vendor.status = vendor.status_edit
    }

    return new Promise((resolve, reject) => {
      axios
        .post('/vendor_profiles/save', vendor)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  bindActivityTypes: firestoreAction(({ bindFirestoreRef }, id) => {
    if (id == null) {
      return Promise.reject('ID is required')
    }

    return bindFirestoreRef(
      'activityTypes',
      db
        .collection('settings')
        .doc(id)
        .collection('settings')
        .doc('activity_type')
    )
  })
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
