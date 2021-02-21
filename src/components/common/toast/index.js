import Toast from './Toast'

const obj = {}

obj.install = function (Vue) {
  // 创建组件构造器
  const toastContrustor = Vue.extend(Toast)
  // 创建组件对象
  const toast = new toastContrustor()
  // 将组件对象手动挂载到某元素上
  toast.$mount(document.createElement('div'))
  //
  document.body.appendChild(toast.$el)
  // 设置vue一个全局属性
  // 使用地点在Detail/CartBottomBar两个组件中
  Vue.prototype.$toast = toast
}

export default obj
