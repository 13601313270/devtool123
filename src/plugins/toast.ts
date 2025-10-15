import { createVNode, render } from 'vue'
import ToastComponent from '../components/Toast.vue'

export interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export interface ToastInstance {
  close: () => void
}

const Toast = (options: string | ToastOptions): ToastInstance => {
  // 如果传入的是字符串，则将其转换为对象
  const opts: ToastOptions = typeof options === 'string' ? { message: options } : options

  // 设置默认值
  const defaultProps: ToastOptions = {
    message: opts.message || '',
    type: opts.type || 'info',
    duration: opts.duration || 2000,
  }

  // 创建容器元素
  const container = document.createElement('div')
  container.setAttribute('style', 'position: fixed; top: 0; left: 0; z-index: 9999;')

  // 创建 VNode
  // @ts-ignore
  const vm = createVNode(ToastComponent, defaultProps)

  // 渲染到容器
  render(vm, container)

  // 添加到页面
  document.body.appendChild(container)

  // 销毁方法
  const close = () => {
    // 调用组件的隐藏方法
    // @ts-ignore
    if (vm.component && vm.component.exposed && vm.component.exposed.hide) {
      // @ts-ignore
      vm.component.exposed.hide()
    }

    // 延迟移除 DOM 元素，确保动画完成
    setTimeout(() => {
      render(null, container)
      try {
        document.body.removeChild(container)
      } catch (e) {
        // 忽略错误
      }
    }, 300)
  }

  // 返回实例
  return {
    close
  }
}

// 为不同的提示类型提供快捷方法
Toast.success = (message: string, duration?: number): ToastInstance => {
  return Toast({
    message,
    type: 'success',
    duration
  })
}

Toast.error = (message: string, duration?: number): ToastInstance => {
  return Toast({
    message,
    type: 'error',
    duration
  })
}

Toast.warning = (message: string, duration?: number): ToastInstance => {
  return Toast({
    message,
    type: 'warning',
    duration
  })
}

Toast.info = (message: string, duration?: number): ToastInstance => {
  return Toast({
    message,
    type: 'info',
    duration
  })
}

export default Toast