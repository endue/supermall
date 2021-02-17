import axios from 'axios'

export function request(config) {
  const ins = axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  // 请求拉接球
  ins.interceptors.request.use(config => {
    // 返回config
    return config
  }, err => {
    console.log(err);
  })

  // 响应拦截器
  ins.interceptors.response.use(res => {
    // 只要返回的data数据
    return res.data
  }, err => {
    console.log(err);
  })

  return ins(config)
}
