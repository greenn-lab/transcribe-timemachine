import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAudioBlobStore = defineStore('audioBlob', () => {
  const blobs = ref<Blob[]>([])
  const add = (blob: Blob) => {
    blobs.value.push(blob)
  }

  const download = (name: string = 'untitled') => {
    const a = document.createElement('a')
    a.download = `${name || ''}.wav`
    const url = URL.createObjectURL(new Blob(blobs.value))

    a.click()
  }

  return { blobs, add, download }
})
