// This file is temp, meanwhile the  author try to fix the issue
// https://github.com/vuejs/vuefire/issues/325
// TODO: remove this file and its functions from any file that use them
import { debounce } from 'lodash'

export default () =>
  debounce(function (referencesArray, callbackReferenceLost) {
    let stop = false

    ;
    (referencesArray || []).forEach(item => {
      if (stop) return

      if (typeof item === 'string') {
        stop = true

        // This console.log also works as alert; if you see many of it means that somethings was wrong :(
        // eslint-disable-next-line no-console
        console.log('Loading references lost. :)')
        callbackReferenceLost()
      }
    })
  }, 2000)
