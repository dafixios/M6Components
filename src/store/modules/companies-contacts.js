import Common from './_common'
import { dataGet } from '@/utils/helpers'

const contactsGet = new Common('/m6-platform/contacts/get')

const actions = {
  index(_, { companyId }) {
    if (!companyId) return Promise.reject()

    return new Promise((resolve, reject) => {
      contactsGet
        .store(_, { company_id: companyId })
        .then(response => resolve(dataGet(response, 'result.contacts', [])))
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions
}
