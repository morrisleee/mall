import axios from 'axios'

// 最終方案
export function request(config) {
  // 1.創建 axios 實例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8080',
    timeout: 5000
  })

  // 2.1 axios的請求攔截器
  // 2.1 請求攔截的功能
  // 1.攔截 config 中 一些訊息不符合 server 的要求
  // 2.每次發送網路請求時，都希望在畫面中顯示的請求圖案 ( 轉圈圈 )
  // 3.某些請求，必須攜帶一些特殊訊息 (登入: token)
  instance.interceptors.request.use(config => {
    // console.log(config);
    return config
  }, err => {
    // console.log(err);
  })

  // 2.2 axios回應攔截器
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data
  }, err => {
    // console.log(err);
  })

  // 終極方案: 看源碼  = =
  // new axios.create 會 return Promise
  // 3.發送真正的網路請求
  return instance(config)
}
