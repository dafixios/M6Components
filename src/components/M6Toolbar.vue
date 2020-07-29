<template>
  <v-toolbar
    class="m6_toolbar"
    dark
    flat
    height="46"
  >
    <!-- Brand image -->
    <slot name="logo">
      <v-img
        contain
        max-width="160"
        src="https://apps.m6connect.com/sites/default/files/m6-home-logo.png"
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
      @click="emitSideIcon"
      class="hidden-md-and-up"
    />
  </v-toolbar>
</template>

<script >

export default {
  name: 'M6Toolbar',
  props: {
    showSideIcon: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  methods:{
    emitSideIcon(){
      this.$emit('sideIcon')
    }
  }
}
</script>

<style lang="scss" scoped>
.m6_toolbar {
  background-color: #0277bd !important;
  .v-image {
    cursor: pointer;
  }
}
</style>
