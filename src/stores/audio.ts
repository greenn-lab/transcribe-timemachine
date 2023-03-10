import { ref } from 'vue'
import { defineStore } from 'pinia'

const SAMPLE_RATE = Math.pow(2, 14)

export const useAudioStore = defineStore('audio-store', () => {
  const context = ref<AudioContext>(
    new AudioContext({
      sampleRate: SAMPLE_RATE,
      latencyHint: 'balanced'
    })
  )
  const source = ref<MediaStreamAudioSourceNode>()

  const streaming = async (stream: MediaStream) => {
    await context.value.resume()

    source.value = context.value.createMediaStreamSource(stream)
    const processor = context.value.createScriptProcessor(4096, 1, 1)
    source.value.connect(processor)
    processor.connect(context.value.destination)
    processor.addEventListener('audioprocess', ({ inputBuffer }) => {
      console.log('inputBuffer', inputBuffer)
      /*
            if (webSocket?.readyState === 1) {
              const data = inputBuffer.getChannelData(0)
              webSocket.send(float32ToInt16(data))
            }
      */
    })
  }

  const blobs = ref<Blob[]>([])
  const add = (blob: Blob) => {
    blobs.value.push(blob)
  }

  const download = (name: string = 'untitled') => {
    const a = document.createElement('a')
    a.download = `${name}.wav`
    a.href = URL.createObjectURL(new Blob(blobs.value))
    a.click()

    setTimeout(() => a.remove(), 1000)
  }

  return {
    context,
    source,
    streaming,
    blobs,
    add,
    download
  }
})
