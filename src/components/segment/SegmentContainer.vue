<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useEngineStore } from '@/stores/engine'
  import SegmentItem from '@/components/segment/SegmentItem.vue'

  const BASE_HEIGHT = 45

  const engineStore = useEngineStore()

  const container = ref<HTMLDivElement>()
  const lineOfScreen = ref<number>(0)
  const startNumber = ref<number>(0)
  const onContainerSize = () => {
    const rect = container.value?.getBoundingClientRect() as DOMRect
    lineOfScreen.value = ~~(rect?.height / BASE_HEIGHT) + 1
  }

  const fittedItems = (e: MouseEvent) => {
    if (!container.value) return

    const scrollTop = container.value.scrollTop || 0
    startNumber.value = ~~(scrollTop / BASE_HEIGHT)
    const ul = container.value.querySelector('ul') as HTMLUListElement
    if (ul) {
      ul.style.top = `${scrollTop}px`
    }
  }

  onMounted(() => {
    onContainerSize()

    let timer: number
    window.addEventListener('resize', () => {
      clearTimeout(timer)
      timer = setTimeout(onContainerSize, 300)
    })
  })
</script>

<template>
  <div ref="container" @scroll="fittedItems" class="m-4 p-2 rounded grow relative">
    <i :style="{ '--delegator-height': `${engineStore.segments?.length * BASE_HEIGHT}px` }"></i>
    <ul>
      <SegmentItem
        v-for="item in engineStore.segments?.slice(startNumber, startNumber + lineOfScreen)"
        :key="item.index"
        :item="item"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  div {
    background: rgba(255, 255, 255, 0.1);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.4rem;
      cursor: pointer;
    }

    i {
      left: 0;
      position: absolute;
      height: var(--delegator-height);
      top: 0;
      width: 1px;
    }

    ul {
      position: relative;
    }
  }
</style>
