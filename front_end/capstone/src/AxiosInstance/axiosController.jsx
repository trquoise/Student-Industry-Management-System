import axios from "axios";

let baseUrl = '/api'

// 创建axios实例，在这里可以设置请求的默认配置
const instance = axios.create({
    timeout: 20000, // 设置超时时间10s
    // baseURL: baseUrl
})
// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.headers.post['Content-Type'] = 'application/json'

/** 添加请求拦截器 **/
instance.interceptors.request.use(config => {
    var token = localStorage.getItem("token")//获取本地存储的token
    console.log(token)
	// 判断cookie有没有存储token，有的话加入到请求头里
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`//在请求头中加入token
        config.headers['Access-Control-Allow-Private-Network'] = true
    }
    return config
}, error => {
    // 对请求错误做些什么
    console.log(error)
    // return Promise.reject(error)
})

/** 添加响应拦截器  **/
// instance.interceptors.response.use(response => {
//     if (response.statusText === 'OK') {
//         return Promise.resolve(response)
//     } else {
//         return Promise.reject(response)
//     }
// }, error => {
// 	// 请求报错的回调可以和后端协调返回什么状态码，在此根据对应状态码进行对应处理
//     if (error.response) {
// 		// 如401我就让用户返回登录页
//         // if (error.response.status === 401) {
//         //     this.props.history.push('/login');
//         // }
//         console.log(error.response)
//         return Promise.reject(error)
//     } else {
//         return Promise.reject('请求超时, 请刷新重试')
//     }
// })

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
