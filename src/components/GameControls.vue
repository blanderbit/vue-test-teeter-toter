<template>
  <div class="controls">
    <button
      v-for="control in controls"
      :key="control"
      @click="handleControlClick(control)"
    >
      {{ control }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    controls: {
      type: Array,
      default: () => [],
    }
  },
  methods: {
    handleControlClick(control) {
      this.$emit('handleControlClick', control)
    }
  }
};
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: center;
  position: relative;
  top: -80px;
}
</style>
