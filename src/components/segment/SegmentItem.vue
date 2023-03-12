<script lang="ts" setup>
  import { ref } from 'vue'
  import { timeFormat } from '@/utils/format'
  import { preventAndStop } from '@/utils/event'

  import type { Segment } from '@/types/Segment'

  const props = defineProps<{ item: Segment }>()
  const item = ref(props.item)

  const breakLine = (e: Event) => {
    preventAndStop(e)

    const selection = window.getSelection()
    if (!selection) return

    let { anchorNode: node, anchorOffset: offset } = selection
    if (!node) return

    const text = node.textContent || ''

    node.textContent = text.substring(0, offset) + '\n' + text.substring(offset++)
    selection.setBaseAndExtent(node, offset, node, offset)
  }
  const grab = (viaMouse = false, toLeft = false) => {
    setTimeout(() => {
      const selection = window.getSelection()
      if (!selection || !selection.focusNode || selection.anchorNode?.nodeType !== Node.TEXT_NODE)
        return

      let {
        anchorNode: { textContent },
        anchorOffset: start,
        focusOffset: close,
        focusNode: node
      } = selection
      const text = textContent || ''

      if (viaMouse || start === close) {
        if (/\n/.test(text.charAt(start - 1))) start++
        while (/\s/.test(text.charAt(start - 1))) start--
        while (/\S/.test(text.charAt(start - 1))) start--
        close = start + (/\S+/.exec(text.substring(start))?.[0].length || 0)
      } else if (toLeft || start === close) {
        while (/\s/.test(text.charAt(start - 1))) start--
        close = start
        while (/\S/.test(text.charAt(start - 1))) start--
      } else {
        while (/\s/m.test(text.charAt(close))) close++
        start = close
        while (/\S/m.test(text.charAt(close))) close++
      }

      if (start > -1 && close <= text.length) {
        selection.setBaseAndExtent(node, start, node, close)
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
    @keydown="
      e => {
        if (e.ctrlKey && /^Arrow/.test(e.key)) {
          grab(false, e.key === 'ArrowLeft')
          preventAndStop(e)
        }

        if (e.key === 'Enter') {
          breakLine(e)
        }
      }
    "
    @mousedown="e => e.ctrlKey && grab(true)"
    @contextmenu="preventAndStop"
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
    line-height: 1.2rem;
    margin: 0.25rem;
    padding: 0.5rem;
    white-space: pre;
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
