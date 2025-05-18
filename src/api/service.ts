import { useAuthStore } from '@/stores/auth';
import axios, {  AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElLoading, ElMessage } from "element-plus";
// 创建axios实例 进行基本参数配置
const service = axios.create({
    // 默认请求地址，根据环境的不同可在.env 文件中进行修改
    baseURL: '',
    // 设置接口访问超时时间
    timeout: 3000, // request timeout，
    // 跨域时候允许携带凭证
    withCredentials: true,
})

let loadingInstance: any = null // 用于存储loading实例

let pendingRequests = 0 // 记录当前正在进行的请求数

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        pendingRequests++ // 请求数 +1
        
        if (!loadingInstance) { 
            loadingInstance = ElLoading.service({
                lock: true,
                text: '加载中...',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        }

        // 处理 token
        const userStore = useAuthStore()
        let token = userStore.token
        if (token) {
            config.headers.Authorization = token
        }

        return config
    },
    (error: AxiosError) => {
        pendingRequests-- // 请求失败也要减少计数
        if (pendingRequests === 0 && loadingInstance) {
            loadingInstance.close()
            loadingInstance = null
        }
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response) => {
        pendingRequests-- // 请求完成，计数减 1
        
        if (pendingRequests === 0 && loadingInstance) { // 只有最后一个请求返回时才关闭 loading
            loadingInstance.close()
            loadingInstance = null
        }

        return response.data
    },
    (error: AxiosError) => {
        pendingRequests-- // 请求失败，计数减 1
        if (pendingRequests === 0 && loadingInstance) {
            loadingInstance.close()
            loadingInstance = null
        }

        showErrMessage('请重新登录或者重试', 'error', 2000)
        return Promise.reject(error)
    }
)


/**
 * @description 显示错误消息
 * opt 传入参数
 * err 错误信息
 * type 消息类型
 * duration 消息持续时间
 */
function showErrMessage(msg: string, type: any = 'error', duration = 5000) {
// console.log(type)

    ElMessage({
        message: msg,
        type: type,
        duration: duration,
    })
}

export default service