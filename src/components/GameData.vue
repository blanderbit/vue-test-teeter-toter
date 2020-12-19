<template>
  <div class="teeter__data">
    <p>
      Extra Momentum: <b>{{ Math.abs(extraMomentum).toFixed(2) }}</b
      >kg*m
    </p>
    <p>
      Active player: <b>{{ activePlayer }}</b>
    </p>
    <p>
      Speed: <b>{{ speed }}</b>
    </p>
    <p>
      Score: <b>{{ score }}</b>
    </p>
    <p>
      Auto mode:
      <input
        type="checkbox"
        name="automode"
        :value="isAutoMode"
        @change="$emit('change-mode', true)"
      />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    extraMomentum: {
      type: Number,
    },
    activePlayer: {
      type: String,
    },
    speed: {
      type: Number,
    },
    score: {
      type: Number,
    },
    isAutoMode: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.teeter {
  &__data {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 28px;
    text-align: left;
    z-index: 5;

    p {
      margin: 10px 0;
    }
  }
}
</style>
