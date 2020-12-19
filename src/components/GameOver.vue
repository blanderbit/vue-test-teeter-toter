<template>
  <div class="teeter__game-over">
    <div>
      <h3>Game Over!</h3>
      <button @click="startNewGame">Start new game</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startNewGame: {
      type: Function,
    },
  },
};
</script>

<style lang="scss" scoped>
.teeter__game-over {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 84px;
  font-weight: bold;
  z-index: 10;
  color: rgb(160, 35, 35);
}
</style>