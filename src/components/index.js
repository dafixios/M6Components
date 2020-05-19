import Vue from 'vue'
import M6Toolbar from './M6Toolbar.vue'

const Components = {
  M6Toolbar
}
Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})

export default Components
