<template>
  <button :class="['button', { 'button--disabled': disabled || loading, 'button--loading': loading }]"
    :disabled="disabled || loading" @click="handleClick">
    <span v-if="loading" class="button__spinner"></span>
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
});

const emit = defineEmits(['click']);

const handleClick = (event: MouseEvent) => {
  // 阻止在 disabled 或 loading 状态下的点击事件
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped lang="less">
.button {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  position: relative;

  &:hover {
    background-color: #3367d6;
  }

  &--disabled {
    background-color: #cccccc !important;
    cursor: not-allowed !important;
    opacity: 0.6;

    &:hover {
      background-color: #cccccc !important;
    }
  }

  &--loading {
    cursor: wait !important;
  }
}

.button__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>