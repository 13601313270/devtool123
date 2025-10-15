<template>
  <div class="toast-container" :class="{ show: visible }">
    <div class="toast" :class="type">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, onUnmounted } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  message: string
  type?: ToastType
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 2000
})

const visible = ref(false)

let timer: number | null = null

const show = () => {
  visible.value = true
  timer = window.setTimeout(() => {
    hide()
  }, props.duration)
}

const hide = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  show()
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

defineExpose({
  hide
})
</script>

<style scoped lang="less">
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  transition: opacity 0.3s, transform 0.3s;
  opacity: 0;
  pointer-events: none;

  &.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .toast {
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    text-align: center;
    max-width: 80vw;
    word-wrap: break-word;

    &.success {
      background-color: #67c23a;
    }

    &.error {
      background-color: #f56c6c;
    }

    &.warning {
      background-color: #e6a23c;
    }

    &.info {
      background-color: #409eff;
    }
  }
}
</style>