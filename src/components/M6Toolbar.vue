<template>
  <v-toolbar
    class="m6-connect-toolbar"
    dark
    flat
    height="46"
  >
    <!-- Brand image -->
    <slot name="logo">
      <v-img
        contain
        max-width="160"
        src="https://www.m6connect.com/sites/default/files/m6-home-logo.png"
      />
    </slot>

    <v-divider
      class="mx-3"
      inset
      vertical
    />

    <slot name="buttons">
    </slot>

    <v-spacer />

    <v-toolbar-items class="hidden-sm-and-down">
      <slot name="toolbarItems"></slot>
    </v-toolbar-items>

    <v-toolbar-side-icon
      v-if="showSideIcon"
      class="hidden-md-and-up"
    />
  </v-toolbar>
</template>

<script lang="ts">
import {
  Component, Prop, Vue
} from 'vue-property-decorator'

@Component({})
// eslint-disable-next-line vue/require-direct-export
export default class M6Toolbar extends Vue {
  @Prop({
    type: Boolean,
    required: true,
    default: false
  }) readonly showSideIcon!: boolean
}
</script>
