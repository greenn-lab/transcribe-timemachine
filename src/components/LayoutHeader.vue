<script lang="ts" setup>
  import explode from '@/utils/explode'
  import { useAudioStore } from '@/stores/audio'

  import WaveFormRealtime from '@/components/navigate/WaveFormRealtime.vue'
  import IconMicrophone from '@/assets/icons/IconMicrophone.vue'

  const audioStore = useAudioStore()

  const record = ({ currentTarget: target }: MouseEvent) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        audioStore.record(stream)
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
        <a @click="record" class="p-10">
          <IconMicrophone />
        </a>
      </div>
    </section>
  </header>
</template>
