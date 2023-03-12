<script lang="ts" setup>
  import { ref, watchEffect } from 'vue'
  import { useAudioStore } from '@/stores/audio'

  const canvas = ref<HTMLCanvasElement>()
  const audioStore = useAudioStore()

  watchEffect(() => {
    if (!canvas.value) return

    const audioContext: AudioContext = audioStore.audio.context
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048

    const source = audioStore.audio.source as MediaStreamAudioSourceNode
    source?.connect(analyser)

    const length = analyser.frequencyBinCount
    const dataArray = new Uint8Array(length)
    const context = canvas.value.getContext('2d')

    draw()

    function draw() {
      if (!context || !canvas.value) return
      requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray)

      const width = canvas.value.width
      const height = canvas.value.height

      context.clearRect(0, 0, width, height)
      context.lineWidth = 3
      context.strokeStyle = 'rgba(255, 255, 255, .7)'
      context.beginPath()

      const sliceWidth = width / length
      let x = 0
      for (let i = 0; i < length; i++) {
        let v = dataArray[i] / 128.0
        let y = (v * height) / 2

        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }

        x += sliceWidth
      }

      context.lineTo(width, height / 2)
      context.stroke()
    }
  })
</script>

<template>
  <canvas ref="canvas" />
</template>

<style lang="scss" scoped>
  canvas {
    height: 60px;
    width: 100%;
  }
</style>
