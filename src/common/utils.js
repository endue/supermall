// 防抖动函数，避免频繁的请求
export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
