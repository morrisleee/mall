import Toast from './Toast'

const obj = {}

obj.install = function (Vue) {
  // 1.創建組件構造器
  const toastConstructor = Vue.extend(Toast)
  // 2.new 根據構造器，可創建出組件對象
  const toast = new toastConstructor()
  // 3.將組件對象，手動掛載到某個元素上
  toast.$mount(document.createElement('div'))
  // 4.toast.$el 對應的就是 div
  document.body.appendChild(toast.$el)


  Vue.prototype.$toast = toast
}

export default obj
