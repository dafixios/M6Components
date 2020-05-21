import gql from 'graphql-tag'
import * as gqlBuilder from 'gql-query-builder'
import { firestoreAction } from 'vuexfire'

import { db } from '@/utils/Firebase'
import graphqlClient from '@/utils/graphql'

import budgets from './companies-cpm-projects-budgets'
import commitments from './companies-cpm-projects-commitments'
import costSummary from './companies-cpm-projects-cost-summary'
import spendings from './companies-cpm-projects-spendings'

function defaultState() {
  return {
    companiesCpmProjects: []
  }
}

const state = defaultState

const getters = {
  companiesCpmProjects: state =>
    state.companiesCpmProjects.map(item => ({
      ...item,
      id: item.id
    }))
}

const actions = {
  index(
    /* eslint-disable-next-line */
    { commit },
    {
      companyId,
      userId,
      search = '',
      filter,
      limit = 8,
      page = 1,
      sort = 'ASC',
      sortBy
    }
  ) {
    if (!companyId || !userId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const { query, variables } = gqlBuilder.query({
        operation: 'cpmProjects',
        fields: [
          {
            meta: ['total', 'lastPage']
          },
          {
            data: [
              'id',
              'startDate',
              'status',
              'title',
              'projectImage',
              'number',
              'description',
              'projectType',
              'budget',
              'projectFinalCost',
              { manager: ['label', 'value'] },
              { campus: ['name'] },
              'budgetsByFiscalYear'
            ]
          }
        ],
        variables: {
          companyId: { value: companyId, type: 'ID', required: true },
          userId: { value: userId, type: 'ID', required: true },
          search: { value: search, type: 'String' },
          filter: {
            value: filter ? JSON.stringify(filter) : '',
            type: 'JSON'
          },
          limit: { value: limit, type: 'Int' },
          page: { value: page, type: 'Int' },
          sort: { value: sort, type: 'Sort' },
          sortBy: { value: sortBy || 'title', type: 'String' }
        }
      })

      graphqlClient
        .query({
          query: gql(query),
          variables
        })
        .then(response => {
          if (response.errors || response.error) {
            return reject(response.errors || response.error)
          }

          return resolve(response.data.cpmProjects)
        })
        .catch(reject)
    })
  },

  /* eslint-disable-next-line */
  destroy({ commit }, { id }) {
    if (!id) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(id)
        .update({ soft_delete: 1 })
        .then(resolve)
        .catch(reject)
    })
  },

  bindCompaniesCpmProjects: firestoreAction(
    ({ bindFirestoreRef }, { companyId } = {}) => {
      if (!companyId) return Promise.reject()

      return bindFirestoreRef(
        'companiesCpmProjects',
        db.collection('cpm_projects').where('company_nid', '==', companyId),
        { maxRefDepth: 0 }
      )
    }
  )
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  modules: {
    budgets,
    commitments,
    costSummary,
    spendings
  }
}
