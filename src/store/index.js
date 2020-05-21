import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/utils/Firebase'
import { vuexfireMutations } from 'vuexfire'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import { parse, stringify } from 'flatted/esm'

import axiosConfig from '@/config/axios'
import {
  navigationModule
} from '../components/header_sidebar/AuxFiles/navigationModule'


import companies from './modules/companies'
import companiesProjects from './modules/companies-projects'
import itApplications from './modules/it-applications'
import itContracts from './modules/it-contracts'
import settings from './modules/settings'
import prospects from './modules/prospects'
import tickets from './modules/tickets'
import gantt from './modules/gantt'
import campaigns from './modules/campaigns'
import catalogs from './modules/catalogs'
import estimations from './modules/estimations'
import capitalPlan from './modules/capital-plan'
import shoppingCart from './modules/shopping-cart'
import ganttSettings from './modules/gantt-settings'
import hideCpmPanels from './modules/hide-cpm-panels'
import findPeople from './modules/find-people'

Vue.use(Vuex)

const appLabel = {
  singular: 'Project',
  plural: 'Projects',
  firebaseCollection: 'cpm_projects',
  settingsCollection: 'projects',
  scheduleCollection: 'default_schedule',
  milestonesCollection: 'milestones',
  usersCollection: 'users',
  rolesCollection: 'roles',
  profile: {
    campus: 'Campus',
    category: 'Category',
    risk: 'Risk',
    startDate: 'Start Date',
    endDate: 'End Date',
    phase: 'Phase',
    phaseTargetDate: 'Phase Target Date',
    projectManagerUpdate: 'Project Manager Update'
  }
}

const state = {
  axiosSettings: {
    baseUrl: axiosConfig.firestoreApiUrl,
    config: axiosConfig.config
  },
  sections: {
    cpm: { empty: false },
    rfp: { empty: false }
  },
  messages: null,
  notifications: [],
  profile: null,
  scorecardRequest: window.Drupal.settings.m6_platform_header.scorecard_request,
  contacts: [],
  appLabel,
  cpmProjects: [],
  companyJoinDialog: false
}

const getters = {
  appLabel: state => state.appLabel,
  axiosSettings: state => state.axiosSettings,
  sections: state => state.sections,
  scorecardRequest: state => state.scorecardRequest,
  contacts: state => state.contacts,
  cpmProjects: state => state.cpmProjects,
  companyJoinDialog: state => state.companyJoinDialog,
  getProfile: state => state.profile,
  getMessages: state => state.messages,
  getNotifications: state => state.notifications
}

const mutations = {
  ...vuexfireMutations,

  setSections: (state, payload) => {
    state.sections = payload
  },

  setContacts: (state, payload) => {
    state.contacts = payload
  },

  setCpmProjects: (state, payload) => {
    state.cpmProjects = payload
  },

  setCompanyJoinDialog: (state, payload) => {
    state.companyJoinDialog = payload
  },

  setNotifications: (state, payload) => {
    state.notifications = payload
  },

  setProfile: (state, payload) => {
    state.profile = payload
  },

  setMessages: (state, payload) => {
    state.messages = payload
  }
}

const actions = {
  setSections(context, payload) {
    context.commit('setSections', payload)
  },

  bindCPMProjects(context, payload) {
    return new Promise(((resolve, reject) => {
      db.collection('cpm_projects')
        .where(
          'company_nid',
          '==',
          window.Drupal.settings.m6_platform.company_nid
        )
        .where('forecasted', '==', payload)
        .orderBy('number')
        .get()
        .then(snapshot => {
          const projects = []

          snapshot.forEach(snap => {
            const data = snap.data()
            data.id = snap.id
            projects.push(data)
          })
          context.commit('setCpmProjects', projects)
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    }))
  },

  clearCPMProjects(context) {
    return new Promise((resolve => {
      context.commit('setCpmProjects', [])
      resolve(true)
    }))
  },

  /* eslint-disable-next-line */
  getContacts({ commit }, { self, data }) {
    return new Promise((resolve, reject) => {
      axios
        .post('m6-platform/api/applications', data)
        .then(response => {
          // commit('setContacts', response.data.result)
          self.setContacts(response.data.result)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  setCompanyJoinDialog(context, payload) {
    context.commit('setCompanyJoinDialog', payload)
  },

  fetchGeneralSettings({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .post('/m6-platform/api/general', { action: 'init_profile' })
        .then(({ data }) => {
          commit('setNotifications', data.result.general_notifications.items)
          commit('setProfile', data.result.profile)
          commit(
            'setMessages',
            data.result.messenger_notifications.notification
          )
        })
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    companiesProjects,
    companies,
    itApplications,
    itContracts,
    navigationModule,
    settings,
    gantt,
    tickets,
    prospects,
    campaigns,
    capitalPlan,
    catalogs,
    estimations,
    shoppingCart,
    ganttSettings,
    hideCpmPanels,
    findPeople
  }
})
