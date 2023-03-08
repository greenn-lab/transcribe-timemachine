<script setup lang="ts">
import IconMicrophone from '@/components/icons/IconMicrophone.vue'
import { today } from './utils/format'
</script>

<template>
  <IconMicrophone />
  {{ today() }}
</template>

<style scoped lang="scss"></style>
