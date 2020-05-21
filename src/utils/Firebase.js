import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

Vue.use(firestorePlugin)


export let db = {}
export let storage = {}
export const initFirebase = fBase => {
  firebase.initializeApp(fBase.config)
  function init() {
    // Authenticate through token
    firebase
      .auth()
      .signInWithCustomToken(fBase.token)
      .then()
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('Error: ', error)

        setTimeout(init, 500)
      })
    // eslint-disable-next-line no-console
    console.log('Firebase Ready')
  }

  init()
  db = firebase.firestore()
  storage = firebase.storage()
}
