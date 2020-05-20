import Vue from 'vue'
import { isObject } from 'lodash'

function dataGet(source, path = '', dfl = null) {
  return path
    .split('.')
    .reduce(
      (previous, current) => (isObject(previous) ? previous[current] : previous),
      source
    ) || dfl
}

Vue.prototype.$h = {
  dg: dataGet
}
