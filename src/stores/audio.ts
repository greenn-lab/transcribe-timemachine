import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useEngineStore } from '@/stores/engine'

const SAMPLE_RATE = Math.pow(2, 14)

export interface AudioKit {
  context: AudioContext
  source?: MediaStreamAudioSourceNode
  processor?: ScriptProcessorNode
  recorder?: MediaRecorder
}

const context = new AudioContext({
  sampleRate: SAMPLE_RATE,
  latencyHint: 'balanced'
})

await context.suspend()

export const useAudioStore = defineStore('audio-store', () => {
  const audio = reactive<AudioKit>({
    context,
    source: undefined,
    recorder: undefined
  })

  const engineStore = useEngineStore()

  const blobs = ref<Blob[]>([])

  const record = (stream: MediaStream) => {
    audio.context.suspend().then(() => {
      audio.recorder?.stop()
      audio.processor?.disconnect()
      audio.source?.disconnect()
    })

    audio.context.resume().then(() => {
      console.log('audio resumed', Date.now(), audio.context.currentTime)

      audio.processor = audio.context.createScriptProcessor(4096, 1, 1)
      audio.processor.connect(audio.context.destination)
      audio.processor.addEventListener('audioprocess', ({ inputBuffer }) => {
        engineStore.proceed(inputBuffer)
      })

      audio.source = audio.context.createMediaStreamSource(stream)
      audio.source.connect(audio.processor)

      audio.recorder = new MediaRecorder(stream)
      audio.recorder.addEventListener('dataavailable', (event: BlobEvent) => {
        console.log('recorded blob', event, Date.now())
        blobs.value.push(event.data)
      })
      audio.recorder.start()
      console.info('record started', Date.now())

      engineStore.start(audio)
    })
  }

  return {
    audio,
    blobs,
    record
  }
})
