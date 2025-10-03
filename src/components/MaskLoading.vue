<template>
  <div class="MaskLoading">
    <img class="loadingImg" src="../assets/loading.svg" />
    <text class="button_text">
      <div v-if="message">{{ message }}</div>
      <slot></slot>
    </text>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  message: string;
  icon: string;
  primary: boolean;
  disabled: boolean;
}
defineProps<Props>()
</script>

<style scoped lang="less">
.MaskLoading {
  height: 100vh;
  width: 100vw;
  background-color: #41404085;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1px);

  @keyframes rotateIcon {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .loadingImg {
    width: 33px;
    height: 33px;
    animation: rotateIcon 2s linear infinite;
  }

  .button_text {
    margin-top: 16px;
    color: white;
    font-size: 16px;
  }
}
</style>
