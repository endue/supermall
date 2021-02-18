import {request} from "./request";

// home页轮播图相关请求
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

// home页商品相关请求
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type, page
    }
  })
}
