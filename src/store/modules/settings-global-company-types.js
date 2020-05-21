import Common from './_common'

const common = new Common('/m6-platform/api/general')

const actions = {
  indexDrupal(_) {
    return new Promise(async (resolve, reject) => {
      common
        .store(_, {
          action: 'get_terms_by_vocabulary',
          name: 'facilities_construction'
        })
        .then(resolve)
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions
}
