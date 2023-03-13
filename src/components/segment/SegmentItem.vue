<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { preventAndStop } from '@/utils/event'
  import { grabWord } from '@/utils/editor'
  import { timeFormat } from '@/utils/format'

  import type { Segment } from '@/types/Segment'

  const props = defineProps<{ item: Segment }>()
  const item = ref(props.item)
  const textarea = ref<HTMLTextAreaElement>()

  const { title } = item.value

  onMounted(() => {
    if (!textarea.value) return
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  })

  onUnmounted(() => {
    console.log(title + '\n' + item.value.title)
  })
</script>

<template>
  <li>
    <a>
      <time>{{ timeFormat(item.start) }}</time>
      <time>{{ timeFormat(item.close) }}</time>
    </a>
    <textarea
      ref="textarea"
      v-model="item.title"
      @contextmenu="preventAndStop"
      @keyup="
        e => {
          e.target.style.height = ''
          e.target.style.height = `${e.target.scrollHeight}px`
        }
      "
      @keydown="
        e => {
          if (e.ctrlKey && /^Arrow/.test(e.key)) {
            grabWord(false, e.key === 'ArrowLeft')
            preventAndStop(e)
          }
        }
      "
      @mousedown="e => e.ctrlKey && grabWord(true)"
      class="p-2 m-1"
    />
  </li>
</template>

<style lang="scss" scoped>
  li {
    display: flex;
    align-items: baseline;

    a {
      text-align: right;
      width: 10rem;

      &::after {
        content: ' ';
      }
    }

    time {
      opacity: 0.5;

      &:first-child::after {
        content: '~';
      }
    }

    textarea {
      background-color: transparent;
      border-radius: 0.25rem;
      height: 2rem;
      line-height: 1.2rem;
      outline: none;
      overflow: hidden;
      resize: none;
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

    time:empty,
    time:empty:before,
    time:empty:after {
      border-radius: 50%;
      display: inline-block;
      font-size: 12px;
      height: 1em;
      right: 0;
      top: -2.5em;
      width: 1em;
      animation-fill-mode: both;
      animation: cognito 1s infinite ease-in-out;
    }

    time:empty {
      color: #ffffff;
      left: -2em;
      margin: 0 auto 0 3rem;
      position: relative;
      transform: translateZ(0);
      animation-delay: 150ms;
    }

    time:empty:before,
    time:empty:after {
      content: '';
      position: absolute;
      top: 0;
    }

    time:empty:before {
      left: -1.2em;
    }

    time:empty:after {
      left: 1.2em;
      animation-delay: 300ms;
    }
  }

  @keyframes cognito {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
</style>
