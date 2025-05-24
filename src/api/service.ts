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


// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (!loadingInstance) {
            loadingInstance = ElLoading.service({
                lock: true,
                text: '加载中...',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        }

        // 添加 token
        const userStore = useAuthStore()
        const token = userStore.token
        if (token) {
            config.headers.Authorization = token
        }

        return config
    },
    (error: AxiosError) => {
        if (loadingInstance) {
            loadingInstance.close()
            loadingInstance = null
        }
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        if (loadingInstance) {
            loadingInstance.close()
            loadingInstance = null
        }

        const res = response.data
        if (res.code !== 0) {
            ElMessage.error(res.message || '请求失败')
        }

        return res
    },
    (error: AxiosError) => {
        if (loadingInstance) {
            loadingInstance.close()
            loadingInstance = null
        }

        ElMessage.error('请重新登录或者重试')
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