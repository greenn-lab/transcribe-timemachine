<script lang="ts" setup>
  import IconMicrophone from '@/assets/icons/IconMicrophone.vue'
  import WaveFormRealtime from '@/components/navigate/WaveFormRealtime.vue'

  import explode from '@/utils/explode'
  import { useAudioStore } from '@/stores/audio'

  const audioStore = useAudioStore()

  const recording = ({ currentTarget: target }: MouseEvent) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async (stream: MediaStream) => {
        await audioStore.streaming(stream)
        // recording(stream)
        // establish()
      })
      .catch(() => {
        explode(target as HTMLElement)
      })
  }
</script>

<template>
  <header>
    <WaveFormRealtime />
    <section>
      <div>
        <button @click="e => recording(e)">
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
