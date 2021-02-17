import {request} from "./request";

// home页相关请求

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
