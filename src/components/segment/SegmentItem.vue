<script lang="ts" setup>
import { timeFormat } from '@/utils/format'
import type { Segment } from '@/@types/Segment'
import { ref } from 'vue'

const RX_WORD = /[\wㄱ-힣,.?!~]/
const RX_WORDS = /[\wㄱ-힣,.?!~]+/

const props = defineProps<{ item: Segment }>()
const item = ref(props.item)

const grab = on => {
  on &&
    setTimeout(() => {
      const selection = window.getSelection()
      if (!selection) return

      let { anchorNode: node, anchorOffset: start, focusOffset: close } = selection
      if (node?.nodeType !== Node.TEXT_NODE || start !== close) return

      while (start > -1 && RX_WORD.test(node.textContent?.charAt(start - 1) || '')) start--

      const matched = RX_WORDS.exec(node.textContent?.substring(start) || '')
      if (matched) {
        selection.setBaseAndExtent(node, start, node, start + matched[0].length)
      }
    }, 30)
}
</script>

<template>
  <a>
    <time>{{ timeFormat(item.start) }}</time>
    <time>{{ timeFormat(item.close) }}</time>
  </a>
  <p
    @keydown="e => grab(e.altKey && /^Arrow/.test(e.key))"
    @mousedown="e => grab(e.altKey)"
    contenteditable="true"
  >
    {{ item.title }}
  </p>
</template>

<style lang="scss" scoped>
a {
  text-align: right;
  width: 10rem;

  &::after {
    content: ' ';
  }
}

time {
  opacity: 0.5;

  + time:not(:empty)::before {
    content: '~';
  }
}

p {
  border-radius: 0.25rem;
  outline: none;
  margin: 0.25rem;
  padding: 0.5rem;
  width: calc(100% - 10rem);

  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &::selection {
    background-color: #0005;
    color: #fff;
  }
}
</style>
