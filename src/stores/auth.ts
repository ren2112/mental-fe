import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getUserByTokenAPI, loginAPI } from '@/api/user';
import type {User} from '@/type/user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  const userInfo = ref<User | null>(null); // 这里指定类型，并初始为null

  const login = async (email: string, password: string) => {
    const res = await loginAPI(email, password) as any;
    if (res.code != 0) {
      throw res.msg;
    }
    token.value = res.data.token;
    const resUser = await getUserByTokenAPI();
    userInfo.value = resUser.data.user;
  };

  const refreshUserInfo = async () => {
    const resUser = await getUserByTokenAPI();
    userInfo.value = resUser.data.user;
  };

  function clearToken() {
    token.value = '';
    userInfo.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
  }

  return { token, clearToken, login, userInfo, refreshUserInfo };
}, {
  persist: true,
});