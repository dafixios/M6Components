import { isObject } from 'lodash'
import { db } from '@/utils/Firebase'

function dataGet(source, path = '', dfl = null) {
  return path
    .split('.')
    .reduce(
      (previous, current) =>
        isObject(previous) ? previous[current] : previous,
      source
    ) || dfl
}

function ffGetRef(...segments) {
  segments = segments.flat()
  
  if (segments.length) {
    let result = db;
    segments.map((segment, index) => {
      result = index % 2 === 0 ? result.collection(segment) : result.doc(segment)
    })
    return result;
  } else {
    return '';
  }
}

const install = Vue => {
  Vue.prototype.$h = {
    dg: dataGet,
    ffGetRef: ffGetRef
  }
}

export { dataGet }

export default install
