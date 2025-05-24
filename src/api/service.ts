import { useAuthStore } from '@/stores/auth';
import axios, {  AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElLoading, ElMessage } from "element-plus";
// 创建axios实例 进行基本参数配置
const service = axios.create({
    // 默认请求地址，根据环境的不同可在.env 文件中进行修改
    baseURL: '',
    // 设置接口访问超时时间
    timeout: 30000, // request timeout，
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
            ElMessage.error(res.msg || '请求失败')
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

export default service