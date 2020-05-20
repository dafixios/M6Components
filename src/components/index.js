import Vue from 'vue'
import M6Toolbar from './M6Toolbar.vue'
import M6Profile from './M6Profile.vue'
import M6BreadcrumbBar from './M6BreadcrumbBar.vue'

const Components = {
  M6Toolbar,
  M6Profile,
  M6BreadcrumbBar
}
Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name])
})

export default Components
