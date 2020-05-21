import { firestorePlugin } from 'vuefire'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

import EventBus from '../Eventbus'

const fBase = window.Drupal.settings.m6_platform.f_base

firebase.initializeApp(fBase.config)

function init() {
  // Authenticate through token
  firebase
    .auth()
    .signInWithCustomToken(fBase.token)
    .then(() => EventBus.$emit('loaded:firebase'))
    .catch(function (error) {
      // eslint-disable-next-line no-console
      console.log('Error: ', error)

      setTimeout(init, 500)
    })
}

init()

const install = Vue => {
  Vue.use(firestorePlugin)
}

export const db = firebase.firestore()
export const storage = firebase.storage()

export default install

// Install by default if included from script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}
