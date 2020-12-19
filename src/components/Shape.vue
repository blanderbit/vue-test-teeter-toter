<template>
  <div
    class="shape"
    :style="{
      right: !isComputerShape ? shape.distance + 'px' : '',
      left: isComputerShape ? shape.distance + 'px' : '',
      bottom: shapeBottom + '%',
      transform: `translateX(${
        isComputerShape ? '-50%' : '50%'
      }) translateY(${getTranslateY(shape.distance)}px)`,
      borderWidth: getBorderWidth(shape.weight, shape.type),
    }"
    :class="`shape--${shape.type} ${isNewShape ? 'shape-new' : ''}`"
  >
    <span>{{ shape.weight }}kg</span>
  </div>
</template>

<script>
export default {
  props: {
    shape: {
      type: Object,
      default: () => {},
    },
    shapeBottom: {
      type: Number,
      default: 0,
    },
    barAngle: {
      type: Number,
      default: 0,
    },
    isNewShape: {
      type: Boolean,
      default: false,
    },
    isComputerShape: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getBorderWidth(weight, type) {
      const sizes = {
        triangle: `0px ${30 + weight * 5}px ${60 + weight * 8}px`,
        circle: `${30 + weight * 5}px`,
        rectangle: `${30 + weight * 5}px ${20 + weight * 5}px`,
      };
      return sizes[type];
    },
    getTranslateY(distance) {
      if (!this.isNewShape) {
        return 0;
      }
      const translateY = -distance * Math.tan((Math.PI * this.barAngle) / 180);
      return translateY;
    },
  },
};
</script>

<style lang="scss" scoped>
.shape {
  width: 1px;
  height: 1px;
  border-style: solid;
  border-width: 50px;
  position: absolute;
  transition-duration: 300ms;

  &--circle {
    border-radius: 50%;
    border-color: #faa;
    background-color: #faa;
    box-shadow: 0px 0 6px #f00;

    span {
      transform: translate(-50%, -50%);
    }
  }

  &--triangle {
    border-color: transparent;
    border-bottom-color: #afa;
    border-bottom-width: 100px;

    span {
      transform: translate(-50%, 150%);
    }
  }

  &--rectangle {
    border-left-width: 30px;
    border-right-width: 30px;
    background-color: #aaf;
    border-color: #aaf;
    box-shadow: 0px 0 6px #00f;

    span {
      transform: translate(-50%, -50%);
    }
  }

  &-new {
    z-index: 5;
  }

  span {
    color: #555;
    position: absolute;
    font-size: 24px;
  }
}
</style>