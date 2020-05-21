import axios from 'axios'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'

const state = {
  customer: {},
  activityTypes: []
}

const getters = {
  getCustomer(state) {
    return state.customer
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
  setCustomer(state, payload) {
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

    state.customer = { ...vendor, ...payload }
  }
}

const actions = {
  fetchCustomer({ commit }, id) {
    if (id == null) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      axios
        .post(`/vendor_profiles/get/${id}`, { type: 'customer' })
        .then(response => {
          if (((response || {}).data || {}).result) {
            commit('setCustomer', response.data.result)
            resolve(response.data.result)
          } else {
            reject('response error')
          }
        })
    })
  },
  updateCustomer(context, customer = null) {
    if (customer == null) return Promise.reject('Customer is required')

    customer.globalType = 'customer'
    customer.form = 'edit'
    customer.add_new = 'customer'
    customer.json_data.company_type = []

    if (
      ((customer || {}).status_edit || {}).id &&
      customer.status_edit.id !== undefined
    ) {
      customer.status = customer.status_edit.id
    } else {
      customer.status = customer.status_edit
    }

    return new Promise((resolve, reject) => {
      axios
        .post('/vendor_profiles/save', customer)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  bindActivityTypes: firestoreAction(
    ({ bindFirestoreRef }, id) => {
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
    }
  )
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
