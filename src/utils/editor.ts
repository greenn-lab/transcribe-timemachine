import { preventAndStop } from '@/utils/event'

export const breakLine = (e: Event) => {
  preventAndStop(e)

  const selection = window.getSelection()
  if (!selection) return

  const { anchorNode: node } = selection
  if (!node) return

  const text = node.textContent || ''

  let { anchorOffset: offset } = selection

  node.textContent = text.substring(0, offset) + '\n' + text.substring(offset++)
  selection.setBaseAndExtent(node, offset, node, offset)
}
export const grabWord = (viaMouse = false, toLeft = false) => {
  setTimeout(() => {
    const selection = window.getSelection()
    if (!selection || !selection.focusNode || selection.anchorNode?.nodeType !== Node.TEXT_NODE)
      return

    const { anchorNode: node } = selection
    const text = node.textContent || ''

    let { anchorOffset: start, focusOffset: close } = selection

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
