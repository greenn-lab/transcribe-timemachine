<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Segment } from '@/@types/Segment'
  import SegmentItem from '@/components/segment/SegmentItem.vue'

  const data = ref<Segment[]>([
    {
      index: 0,
      start: 1234,
      close: 4321,
      title: '아름다운, 우리 한글! 한글사랑? 나라사랑.'
    },
    {
      index: 1,
      start: 1234,
      close: 4321,
      title: '아름다운, 우리 한글! 한글사랑? 나라사랑.'
    }
  ])
</script>

<template>
  <ul>
    <li v-for="item in data" :key="item.index">
      <SegmentItem :item="item" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  ul {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.4rem;
    flex-grow: 1;
    list-style: none;
    margin: 1rem;
    padding: 0.5rem;
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
