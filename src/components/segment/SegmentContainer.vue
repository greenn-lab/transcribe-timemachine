<script lang="ts" setup>
  import { useEngineStore } from '@/stores/engine'
  import SegmentItem from '@/components/segment/SegmentItem.vue'

  const engineStore = useEngineStore()
  const data = engineStore.segments
</script>

<template>
  <ul class="m-4 p-2 rounded grow">
    <li v-for="item in data" :key="item.index">
      <SegmentItem :item="item" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  ul {
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

    > li {
      display: flex;
      align-items: baseline;
    }
  }
</style>
