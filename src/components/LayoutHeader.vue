<script lang="ts" setup>
import IconMicrophone from '@/assets/icons/IconMicrophone.vue'

import explode from '@/utils/explode'

const recording = ({ currentTarget: target }) => {
  explode(target)
}
</script>

<template>
  <header>
    <canvas />
    <section>
      <div>
        <button @click="recording($event)">
          <IconMicrophone />
        </button>
      </div>
    </section>
  </header>
</template>

<style lang="scss" scoped>
canvas {
  height: 60px;
  width: 100%;
}
</style>
