import axios from 'axios'
import storejs from 'storejs'

function install(Vue, op){
  var axiosConfig = {
    baseURL: op.baseURL,
    headers:{
      "Content-Type":"application/json",
    }
  }
  
  let instance = axios.create(axiosConfig)
  
  instance.interceptors.request.use((config) => {// 请求拦截器
    // config.headers.access_token = store.getters.getToken;
    config.headers.player_id=storejs.get("player_id")
    return config
  }, (error) => {
    return Promise.reject(error)
  })
  
  instance.interceptors.response.use(function (response) {
      // 对响应数据做点什么  响应拦截器
      // 根据过期的返回结构，判断如果是token过期，则跳转至登录页，不确定的是，过期是否是拦截到error里
      // if (response.status == 200 && response.data.errorCode && response.data.errorCode == '10005') {
      //   router.app.$router.push({
      //     name: 'login',
      //     params: {msg: '登录超时，请重新登录'}
      //   })
      // }
      return response
    }, function (error) {
      // 对响应错误做点什么
      if (error.toString().indexOf('timeout') >= 0) {
        console.error('服务器连接超时，请网络或服务器')
      } else if (error.toString().indexOf('Network Error') >= 0) {
        console.error('网络异常，请检查网络或服务是否开启')
      }
      return Promise.reject(error) // 返回接口返回的错误信息
    });
  
    // Vue.use(instance)
  
    // instance.getByCache = function(){
    //   console.log('getByCache')
    // }
  
  Vue.prototype.$http = instance;

  Vue.prototype.$http.getByCache = function(){
    let op = arguments[2] || {};
    return instance.get(arguments[0], {...arguments[1], adapter: httpCache({time: op.time || 0})}, );
  }
}




//==============处理缓存======================

// 数据存储
export const cache = {
  data: {},
  set (key, data, bol = false) {
    if(bol){
      storejs.set(key, data);
    }else{
      this.data[key] = data;
    }
  },
  get (key,bol = false ) {
    if (bol) {
      return storejs.get(key)
    } else {
      return this.data[key]
    }
  },
  clear (key) {
    storejs.remove(key);
    delete this.data[key];
  }
}

// 建立唯一的key值
export const buildUniqueUrl = (url, method, params = {}, data = {}) => {
  const paramStr = (obj) => {
    if (toString.call(obj) === '[object Object]') {
      return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key]
        return result
      }, {}))
    } else {
      return JSON.stringify(obj)
    }
  } 
  url += `?${paramStr(params)}&${paramStr(data)}&${method}`
  return url
}

// 防止重复请求
let httpCache = (options = {}) => async config => {
  console.log('fn ccc', config)
  const defaultOptions = {
    time: 0, // 设置为0，不清除缓存
    ...options
  }
  const index = buildUniqueUrl(config.url,config.method,config.params,config.data)
  console.log('fn ccc', index)
  //TODO 尝试把cache换成  storejs，解决刷新就重新请求的问题。
  let responsePromise = cache.get(index)
  let responseT = cache.get(index, true)

  if(responsePromise){
    return responsePromise.then(data => JSON.parse(JSON.stringify(data))) // 为防止数据源污染
  }else if(responseT){
    if (defaultOptions.time !== 0) {
      console.debug('进入清理队列',defaultOptions.time)
      setTimeout(() => {
        console.log('执行清理', index)
        cache.clear(index)
      }, defaultOptions.time)
    }
    return Promise.resolve(JSON.parse(JSON.stringify(responseT)))
  }else{
    responsePromise = (async () => {
      try {
        const response = await axios.defaults.adapter(config)
        cache.set(index, response, true);
        return Promise.resolve(response)
      } catch (reason) {
        cache.clear(index)
        return Promise.reject(reason)
      }
    })()
    cache.set(index, responsePromise)
  }
  return responsePromise.then(data => JSON.parse(JSON.stringify(data))) // 为防止数据源污染
}





export default {
  install: install
};
