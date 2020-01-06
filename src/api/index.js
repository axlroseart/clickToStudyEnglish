import 'whatwg-fetch'
import apiConfig from './api.config.mjs'
const apiMap = {}
/**
 * 自动生成Api
 * @param {api配置文件} config
 */
function _apiGenerator(config) {
  let apiNames = Object.keys(config)
  for (let name of apiNames) {
    let apiRoute = config[name]
    // console.log(`==> generate api ${name}`)
    apiMap[name] = (formData, extra) => {
      // console.log(`==> api url : ${apiRoute.url} \n`)
      // 添加时间戳
      formData = {...formData, ...{t: new Date().getTime()}}

      let url = apiRoute.url
      let params
      let contentType = 'application/json;charset=UTF-8'
      let usertoken
      // form表单提交
      if (apiRoute.type === 'form') {
        // contentType = 'application/x-www-form-urlencoded'
        contentType = 'multipart/form-data'
        params = Object.assign(apiRoute.params, formData)
        params = _serialize(params)
      } else if (apiRoute.type === 'json') { // JSON格式提交
        params = Object.assign(apiRoute.params, formData)
        // 如果传递上来的参数带有pageNum字段，即为分页数据查询逻辑
        if (params.hasOwnProperty('pageNum')) {
          url += params.pageNum
          delete params.pageNum
        } else if (params.hasOwnProperty('usertoken')) {
          usertoken = params.usertoken
          delete params.usertoken
        }
        params = JSON.stringify(params, null, 2)
      } else if (apiRoute.type === 'mix') { // 混合模式
        params = Object.assign(apiRoute.params, formData)
        params = _serialize(params)
        url += '?' + params
        params = JSON.stringify({ ...apiRoute.extra, ...extra }, null, 2)
      } else {
        // 如果接口没有任何请求参数，则默认params为空对象
        params = Object.assign(apiRoute.params || {}, formData)
        if (params.hasOwnProperty('pageNum')) {
          url += params.pageNum
          delete params.pageNum
        } else if (params.hasOwnProperty('usertoken')) {
          usertoken = params.usertoken
          delete params.usertoken
        }
        params = _serialize(params)
        url += '?' + params
        params = null
      }
      // whatwg-fetch
      return new Promise((resolve, reject) => {
        // 增加8s延迟处理
        setTimeout(() => {
          reject({
            code: 99999,
            msg: '请求超时，请稍后重试'
          })
        }, 60000)
        fetch(url, {
          method: apiRoute.method,
          body: params,
          // XMLHttpRequest请求头信息配置
          headers: {
            'Content-Type': contentType,
            'Authorization': usertoken
          },
          credentials: 'include'
        }).then((res) => {
          checkStatus(res, resolve, reject)
        })
      })
    }
  }
}

/**
 * 检查请求状态
 * @param {Ajax Response} response
 */
function checkStatus(response, resolve, reject) {
  // 已经超时
  if (response.status === 401) {
    // let type = process.env.NODE_ENV
    // 跳转登录页面
    // type === 'production' ? window.location.href = 'http://' + window.location.host : window.location.href = ''
    // 返回未登录
    reject ({
      code: 401,
      message: '身份验证失败，请重新登录'
    })
  }

  if (response.status >= 200 && response.status < 300) {
    resolve(response.json())
  } else {
    let error = new Error(response.statusText)
    error.response = response
    reject(error)
    throw error
  }
}

function _serialize(data) {
  let ret = []
  for (let key in data) {
    ret.push(`${key}=${data[key]}`)
  }

  return ret.join('&')
}

_apiGenerator(apiConfig)

export default apiMap