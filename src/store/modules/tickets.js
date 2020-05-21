import { db } from '@/utils/Firebase'
import router from '@/router'
import { dataGet } from '@/utils/helpers'

const firebaseCollection = 'cpm_projects'

const state = {
  constructionData: null,
  showTicket: false,
  ticketId: '',
  user: false,
  company: {},
  project: {},
  bussy: false,
  selectedGantt: { name: 'Default', value: 'default' },
  type: 'schedule'
}

const getters = {
  constructionData: state => state.constructionData,
  showTicket: state => state.showTicket,
  ticketId: state => state.ticketId,
  user: state => state.user,
  company: state => state.company,
  project: state => state.project,
  bussy: state => state.bussy,
  selectedGantt: state => state.selectedGantt
}

function opportunitiesPromise() {
  const auxPromise = new Promise((resolve, reject) => {
    try {
      db.collection('settings').doc(window.Drupal.settings.m6_cpm.company_nid).collection('settings').doc('task_status')
        .get()
        .then(doc => {
          const initialStatus = doc.data().status[0]

          resolve(initialStatus)
        })
    } catch (error) {
      reject(error)
    }
  })
  return auxPromise
}

function saveCollection(state, payload, initialStatus, nextNumber) {
  const auxPromise = new Promise((resolve, reject) => {
    try {
      const auxObject = {
        firstTime: true,
        title: dataGet(payload, 'task.name'),
        status: initialStatus,
        start_date: dataGet(payload, 'task.start_date'),
        duration: dataGet(payload, 'task.duration', 0),
        in_schedule: true,
        usersCount: 0,
        attachmentsCount: 0,
        commentCount: 0,
        priority: 'Low',
        archive: false,
        number: nextNumber || 1,
        rank: '',
        projectType: 'Break/Fix',
        author: state.user,
        // company: state.company.ref,
        createdAt: new Date(),
        cid: dataGet(window, 'Drupal.settings.m6_platform_header.company_nid'),
        budget: dataGet(payload, 'task.budget', 0),
        budgetFiscalYear: dataGet(payload, 'task.budgetFiscalYear', {}),
        budgetPercentage: dataGet(payload, 'task.budgetPercentage', 0)
      }

      if (payload.task.parent && payload.task.parentTask) {
        auxObject.parent = payload.task.parent
        auxObject.parentTask = payload.task.parentTask
      }

      // Adding to the object the gantt
      if (state.type === 'schedule') {
        auxObject.gantt = state.selectedGantt.value
      }

      payload.collection.add(auxObject).then(doc => {
        if (dataGet(payload, 'task.showTicket')) {
          state.ticketId = doc.id
          state.showTicket = true
        }


        if (state.type === 'tasks') {
          state.project.nextTaskNumber++
          db.collection(firebaseCollection).doc(state.project.id).update({
            nextTaskNumber: state.project.nextTaskNumber
          }).then(() => {
            const returnPayload = {
              taskId: doc.id,
              taskTitle: payload.task.name
            }
            resolve(returnPayload)
          })
        } else if (state.type === 'schedule') {
          state.project.nextTaskNumber++
          db.collection(firebaseCollection).doc(state.project.id).update({
            nextTaskNumber: state.project.nextTaskNumber
          }).then(() => {
            if (dataGet(payload, 'task.showTicket')) {
              window.scrollTo(0, 380)
            }
            const returnPayload = {
              taskId: doc.id,
              task: doc,
              taskTitle: payload.task.name
            }
            resolve(returnPayload)
          })
        } else if (state.type === 'tickets') {
          state.company.nextTicketNumber++
          db.collection('companies').doc(state.company.id).update({
            nextTicketNumber: state.company.nextTicketNumber
          }).then(() => {
            const returnPayload = {
              ticketId: doc.id
            }
            resolve(returnPayload)
          })
        }
      })
    } catch (error) {
      reject(error)
    }
  })

  return auxPromise
}

function addNewPromise(state, payload) {
  const auxPromise = new Promise(async (resolve, reject) => {
    try {
      let nextNumber = 1
      if (state.type === 'tasks' || state.type === 'schedule') {
        nextNumber = state.project.nextTaskNumber
      } else if (state.type === 'tickets') {
        nextNumber = state.company.nextTicketNumber
      }

      // let initialStatus = 'Backlog'
      const initialStatus = 'In Progress'

      const returnPayload = await saveCollection(state, payload, initialStatus, nextNumber)
      resolve(returnPayload)
    } catch (error) {
      reject(error)
    }
  })
  return auxPromise
}

const mutations = {
  setBussy: (state, payload) => {
    state.bussy = payload
  },
  setUser: (state, payload) => {
    state.user = payload
  },
  setCompany: (state, payload) => {
    state.company = payload
  },
  setProject: (state, payload) => {
    state.project = payload
  },
  showTicket: (state, payload) => {
    state.ticketId = payload
    state.showTicket = true
  },
  closeModal: (state, payload) => {
    state.showTicket = false
    state.ticketId = ''
  },
  setGantt: (state, payload) => {
    state.selectedGantt = payload
  },
  setConstructionData: (state, payload) => {
    state.constructionData = payload
  }
}

const actions = {
  setUser(context, payload) {
    context.commit('setUser', payload)
  },
  setCompany(context, payload) {
    context.commit('setCompany', payload)
  },
  setProject(context, payload) {
    context.commit('setProject', payload)
  },
  addNew(context, payload) {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        // Adding default values here instead of firebase functions
        // because triggers for data change are taking too long
        // due to firestore being in beta according to docs
        let collection = {}
        if (!payload) {
          payload = {
            name: '',
            duration: 1,
            start_date: '',
            showTicket: true,
            budget: 0
          }
        }


        if (state.type === 'tasks' || state.type === 'schedule') {
          collection = db.collection(firebaseCollection).doc(router.currentRoute.params.id).collection('tasks')
        } else if (state.type === 'tickets') {
          collection = db.collection('tickets')
        }

        // context.commit('addNew', {collection, task: payload})
        addNewPromise(state, {
          collection,
          task: payload
        }).then(returnPayload => {
          resolve(returnPayload)
        })
      } catch (error) {
        reject(error)
      }
    })
    return auxPromise
  },
  showTicket(context, payload) {
    context.commit('showTicket', payload)
  },
  closeModal(context, payload) {
    context.commit('closeModal')
  },
  setRank(context, payload) {
    context.commit('setBussy', true)
    payload.ticket.get().then(ticketInit => {
      const dataTicket = ticketInit.data()
      let rank = 1
      let enter = false
      db.collection('tickets').where('assignee', '==', payload.user).where('archive', '==', false).where('cid', '==', parseInt(dataTicket.cid))
        .orderBy('rank')
        .get()
        .then(tickets => {
          if (tickets.docs.length === 1) {
            ticketInit.ref.update({ rank: 1 })
            return
          }
          tickets.docs.forEach(ticket => {
            const ticketList = ticket.data()
            if (enter) {
              if (ticket.id !== ticketInit.id) {
                ticket.ref.update({ rank })
              } else {
                rank--
              }
            } else if (ticket.id !== ticketInit.id) {
              if (dataTicket.priority === ticketList.priority) {
                ticketInit.ref.update({ rank })
              } else if (dataTicket.priority.toLowerCase() === 'critical') {
                ticketInit.ref.update({ rank })
                rank++

                ticket.ref.update({ rank })
                enter = true
              } else if (dataTicket.priority.toLowerCase() === 'high') {
                if (ticketList.priority.toLowerCase() === 'normal' || ticketList.priority.toLowerCase() === 'low') {
                  ticketInit.ref.update({ rank })
                  rank++

                  ticket.ref.update({ rank })
                  enter = true
                }
              } else if (dataTicket.priority.toLowerCase() === 'normal') {
                if (ticketList.priority.toLowerCase() === 'low') {
                  ticketInit.ref.update({ rank })
                  rank++

                  ticket.ref.update({ rank })
                  enter = true
                }
              }
            } else {
              ticketInit.ref.update({ rank })
              enter = true
            }
            rank++
          })
        })
      context.commit('setBussy', false)
    })
  },
  setGantt(context, payload) {
    context.commit('setGantt', payload)
  },
  fetchConstructionData({ commit, getters }, { projectId }) {
    if (!projectId) return Promise.reject('Missing data to fetch Construction Data')

    const selectedGanttValue = dataGet(getters, 'selectedGantt.value')
    if (!selectedGanttValue) return Promise.reject()

    return new Promise((resolve, reject) => {
      db
        .collection('cpm_projects')
        .doc(projectId)
        .collection('tasks')
        .where('gantt', '==', selectedGanttValue)
        .where('title', 'in', [
          'Construction',
          'construction'
        ])
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data()
            commit('setConstructionData', data)
          } else {
            commit('setConstructionData', {})
            resolve()
          }
        })
        .catch(() => {
          reject()
        })
    })
  },
  fetchGantt({ commit }, { projectId }) {
    if (!projectId) return Promise.reject('Missing data to fetch Construction Data')

    return new Promise((resolve, reject) => {
      db
        .collection('cpm_projects')
        .doc(projectId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data()
            const gantt = dataGet(data, 'selectedGantt')

            if (gantt) {
              commit('setGantt', gantt)
            }
            resolve()
          } else {
            resolve()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
