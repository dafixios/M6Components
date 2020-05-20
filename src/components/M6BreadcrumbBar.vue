<template>
  <v-toolbar
    v-resize="onResize"
    class="breadcrumbbar-margin hidden-sm-and-down toolbar-breadcrumb-content"
    color=""
    flat
    :height="height"
  >
    <!-- Breadcrumbs -->
    <v-breadcrumbs
      class="ma-0 pa-0"
      :items="breadcrumbs"
    >
      <!-- slot divider -->
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>

      <template v-slot:item="props">
        <!-- return all menu -->
        <template v-if="props.item.all === true ">
          <v-menu
            max-width="280px"
            offset-y
            open-on-hover
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="blue--text breadcrumb-bar-button"
                flat
                small
                v-on="on"
              >
                {{ props.item.label }}
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <template v-for="(subItemMenu, index) in props.item.menu">
                  <!-- Getting the main -->
                  <v-list-tile :key="index">
                    <v-list-tile-content>
                      <v-list-tile-title
                        :class="getClass(subItemMenu)"
                        :href="subItemMenu.to"
                        v-html="subItemMenu.label"
                      />
                    </v-list-tile-content>
                  </v-list-tile>
                  <!-- Getting sub menu acting as main -->
                  <template v-if="subItemMenu.menu.length > 0">
                    <template v-for="(item, indexSub) in subItemMenu.menu">
                      <v-list-tile :key="`${index}-${indexSub}-sub`">
                        <v-list-tile-content>
                          <v-list-tile-sub-title
                            class="blue--text"
                            :href="item.to"
                            v-html="item.label"
                          />
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </template>
                </template>
              </v-list>
            </v-card>
          </v-menu>
        </template>

        <!-- return the menu in the index -->
        <template v-else-if="props.item.index !== undefined ">
          <v-menu
            offset-y
            open-on-hover
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="blue--text breadcrumb-bar-button toolbar-breadcrumb-content-middle"
                flat
                small
                v-on="on"
              >
                {{ props.item.label }}
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(subMenuItem, index) in props.item.menu"
                :key="index"
              >
                <v-list-tile-title
                  class="blue--text"
                  :href="props.item.to"
                >
                  {{ subMenuItem.label }}
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>

        <!-- no menu to return the breadcrum is just a label -->
        <template v-else>
          <span class="m6-fix-title">{{ props.item.label }}</span>
        </template>
      </template>
    </v-breadcrumbs>

    <v-spacer />
    <portal-target name="destination" />
    <portal-target name="breadcrumb-buttons-company" />
  </v-toolbar>
</template>

<script>

export default {
  name: 'M6BreadcrumbBar',
  props: {
    menuItems: {
      type: Object,
      default: () => ({ breadcrumbs: [], menu: [] })
    },
    sidebar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      breadcrumbs: [],
      height: 0,
      reach: false,
      windowSize: {
        x: 0
      }
    }
  },
  watch: {
    menuItems() {
      this.loadProperties()
    }
  },
  mounted() {
    this.onResize()
  },
  methods: {
    getClass(subItemMenu) {
      return subItemMenu.menu.length > 0 ? '' : 'blue--text'
    },
    getMenu(breadcrumb) {
      // return all menu
      if (breadcrumb.all === true) {
        return this.menuItems.menu
      }
      // return the menu in the index
      if (breadcrumb.index !== undefined) {
        return this.menuItems.menu[breadcrumb.index].menu
      }
      // no menu to return the breadcrum is just a label

      return null
    },
    loadProperties() {
      this.breadcrumbs = this.menuItems.breadcrumbs

      this.breadcrumbs.map(breadcrumb => {
        breadcrumb.menu = this.getMenu(breadcrumb)
      })
    },
    sendEvent() {
      this.sidebarLeft = true
    },
    onResize() {
      this.windowSize = { x: window.innerWidth }
      this.height = 36

      if (this.windowSize.x < 1024) {
        this.height = 48
      }

      if (this.windowSize.x < 374) {
        this.height = 96
      }
    }
  }

}
</script>

<style scoped>
  .breadcrumb-bar-button {
    margin: 0px;
  }

  .m6-fix-title {
    margin-left: 15px;
    color: #808080;
  }

  @media (max-width: 768px) {
    .breadcrumb-bar-button {
      right: 6%;
    }
  }

  .toolbar-breadcrumb-content {
    font-family: 'futura_md_btmedium';
  }

  @media (max-width: 767px) {
    .toolbar-breadcrumb-content {
      padding-left: 32px !important;
    }
  }

  @media (min-width: 425px) and (max-width: 768px) {
    .toolbar-breadcrumb-content-middle {
      padding-left: 20px;
    }

  }

  @media (min-width: 768px) and (max-width: 1023px) {

    .toolbar-breadcrumb-content {
      padding-left: 48px !important;
    }


    .toolbar-breadcrumb-content-middle {
      padding-left: 46px;
    }

  }

  @media (max-width: 320px) {
    .m6-fix-title {
      margin-left: -5px;
    }
  }
</style>
