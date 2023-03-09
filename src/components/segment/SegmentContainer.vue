<script lang="ts" setup></script>

<template>
  <ul></ul>
</template>

<style lang="scss" scoped>
ul {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.4rem;
  flex-grow: 1;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0.5rem 0;
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

  a {
    text-align: right;
    width: 10rem;
  }

  a::after {
    content: ' ';
  }

  time {
    font-family: 'Courier New', monospace;
    opacity: 0.6;
  }

  time + time:not(:empty)::before {
    content: '~';
  }

  p {
    border-radius: 0.25rem;
    outline: none;
    margin: 0.25rem;
    padding: 0.5rem;
    width: calc(100% - 10rem);
  }

  p:focus {
    background-color: rgba(255, 255, 255, 0.15);
  }

  p::selection {
    background-color: #0005;
    color: #fff;
  }
}
</style>
