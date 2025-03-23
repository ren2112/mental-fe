import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getUserByTokenAPI, loginAPI } from '@/api/user';

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 中读取初始值
  const token = ref('');
  const userInfo = ref({})


  const login=async(email:string,password:string)=>{
    const res=await loginAPI(email,password)
    if (res.code!=0){
      throw res.msg
    }
    token.value = res.data.token
    const resUser=await getUserByTokenAPI()
    userInfo.value=resUser.data.user
  }

  const refreshUserInfo=async()=>{
    const resUser=await getUserByTokenAPI()
    userInfo.value=resUser.data.user
  }

  function clearToken() {
    token.value = '';
    userInfo.value={}
    localStorage.removeItem('token'); // 从 localStorage 中移除
    // 额外清除 Pinia 持久化存储
    localStorage.removeItem('auth');  // Pinia persist 默认将整个 store 状态存储在 'auth' key 下
  }

  return { token, clearToken, login, userInfo,refreshUserInfo};
},{
    persist:true,
});


