import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Segment } from '@/types/Segment'
import type { AudioKit } from '@/stores/audio'

interface Response {
  segment: number
  result: {
    final: boolean
    hypotheses: [{ transcript: string }]
  }
}

const ENGINE_URL = 'wss://ailab.sorizava.co.kr:40002/client/ws/speech'
const ENGINE_PARAMS = [
  'model=KOREAN_ONLINE_16K',
  'project=2e77c961-f709-400a-8c3e-0eeb73604698',
  'content-type=audio%2Fx-raw%2C+layout%3D%28string%29interleaved%2C+rate%3D%28int%2916000%2C+format%3D%28string%29S16LE%2C+channels%3D%28int%291',
  'access-token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmV0RHQiOjE2NzI4MTM4MjYxNTQsImNyZXRyIjoiYWRtaW4iLCJjaGdEdCI6MTY3NzQ2NDk2NTg2NCwiY2hnciI6ImFkbWluIiwibWVtTm8iOjgsIm1lbUlkIjoidGVzdDEiLCJwYXNzd2QiOiIyMzEyNTJhZjIxN2I2NTZhNGQ4OGYwYzJkMmE5ZTc3MzE2M2QxN2MxYmJjMDIxMWI1NTJiYzc4OTg4M2RmMWU1ZjFlMTg5NTRmYTMwZTZkNGM2OWQyNmU0Nzc1MTUzNjE5YzdkOGIyN2U4ZjZiNjJhYTAyNmFkYzYwZDczNjZhYiIsIm1lbU5tIjoi7YWM7Iqk7Yq4IiwidXNlWW4iOiJZIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiYXV0aE5vIjoxMSwiZGVwdE5vIjoxLCJqaWt3aUNkIjoiQ0QwNSIsImR1dHlDZCI6IkNEMDEiLCJqb2IiOiIiLCJ0ZWwiOiIiLCJsb2dpbkZhaWwiOjAsIm5vd0R0IjoxNjc3OTQyNzA5OTE1LCJleHBEdCI6MTY3ODAyOTEwOTkxNSwiZXhwU2VjIjo4NjQwMCwiZXhwIjoxNjc4MDI5MTA5fQ.8HBt9oKvMAQdMkS6WpCdxN5txXoWmDcAOWVAj3W11jw'
].join('&')

const float32ToInt16 = (buffer: Float32Array) => {
  let len = buffer.length
  const buf = new Int16Array(len)

  while (len--) {
    buf[len] = Math.min(1, buffer[len]) * 0x7fff
  }

  return buf
}

export const useEngineStore = defineStore('engine-store', () => {
  let webSocket: WebSocket

  const segments = ref<Segment[]>()
  const segment = ref<Segment>()

  import('./engine.sample.json').then(res => {
    segments.value = res.default
  })

  const proceed = (buffer: AudioBuffer) => {
    if (webSocket?.readyState === 1) {
      const data = buffer.getChannelData(0)
      webSocket.send(float32ToInt16(data))
    }
  }

  const stop = () => {
    if (webSocket.readyState === 1) {
      webSocket.send('EOS')
      webSocket.close()
    }
  }
  const start = (audio: AudioKit) => {
    if (webSocket?.readyState === 1) return

    webSocket = new WebSocket(`${ENGINE_URL}?single=false&${ENGINE_PARAMS}`)
    webSocket.addEventListener('message', function ({ data }) {
      const parsed: { [key: string]: any } = JSON.parse(data)
      if (parsed.sessionId) {
        return console.info('engine started!', Date.now())
      }

      const response = parsed as Response
      if (response.segment !== segment.value?.index) {
        segment.value = {
          index: segments.value?.length || 0,
          start: audio.context.currentTime
        }
        segments.value?.push(segment.value)
      }

      segment.value.title = response.result.hypotheses[0].transcript

      if (response.result.final) {
        audio.recorder?.stop()
        segment.value.close = audio.context.currentTime
        console.log('record slept', Date.now())
        audio.recorder?.start()
      }
    })
  }

  return {
    segments,
    proceed,
    start,
    stop
  }
})
