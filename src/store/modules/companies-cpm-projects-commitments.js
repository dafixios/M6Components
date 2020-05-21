import * as gqlBuilder from 'gql-query-builder'
import gql from 'graphql-tag'

import graphqlClient from '@/utils/graphql'
import axiosConfig from '@/config/axios'

import Common from './_common'

const getTotals = new Common('/api/project', {
  host: axiosConfig.firestoreApiUrl
})

const actions = {
  index: (
    _,
    {
      projectId,
      search = '',
      filter,
      limit = 8,
      page = 1,
      sort = 'ASC',
      sortBy
    } = {}
  ) => {
    if (!projectId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const { query, variables } = gqlBuilder.query({
        operation: 'cpmProjectCommitments',
        fields: [
          {
            meta: ['total', 'lastPage']
          },
          {
            data: [
              'id',
              'amount',
              'budgetCategory',
              'completionDate',
              'notes',
              'number',
              'openAmount',
              'vendor',
              'spendingAmount'
            ]
          }
        ],
        variables: {
          projectId: { value: projectId, type: 'ID', required: true },
          search: { value: search, type: 'String' },
          filter: {
            value: filter ? JSON.stringify(filter) : '',
            type: 'JSON'
          },
          limit: { value: limit, type: 'Int' },
          page: { value: page, type: 'Int' },
          sort: { value: sort, type: 'Sort' },
          sortBy: { value: sortBy || 'number', type: 'String' }
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

          return resolve(response.data.cpmProjectCommitments)
        })
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions
}
