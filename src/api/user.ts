import service from "./service";
import {ref} from "vue";

export const registerAPI = async (data : {username: string, email: string, password: string, repassword: string, verifyCode: string}) => {
    return await service.post('/api/noauth/register', data);
};
//登录接口
export const loginAPI = async (email: string, password: string) => {
    return await service.post('/api/noauth/login', {
        email,
        password,
    });
};
//注册接口
export const requestCodeAPI = async (email: string) => {
    return await service.post('/api/noauth/request-code', { email });
};
//上传用户头像接口
export const uploadAvatarAPI = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return await service.post('/api/auth/upload-avatar', formData);
};
//获取用户id
export const getUserByTokenAPI = async () => {
    return await service.get('/api/auth/get-user-by-token', {
    });
};

export const validateTokenAPI = async () => {
    return await service.get('/api/noauth/validate-token', {
    });
};

// 只从id获取用户接口 (/api/auth/admin/user-get)
export const getUserAPI = async ( id :any) => {
    return await service.get('/api/noauth/user-get', {
        params: { id },
    });
};

// 获取用户列表接口
export const department = ref<number>(-1);
export const getUserListAPI = async (
    data: {
        pageSize: number;    // 每页记录数（必需）
        pageNum: number;     // 页码（必需）
        ID?: number;         // 用户 ID（可选）
        Username?: string;   // 用户名（可选）
        Email?: string;      // 邮箱（可选）
        Phone?: string;      // 电话（可选）
        Department?: number; // 部门（可选）
    }) => {
    return await service.get('/api/auth/admin/get-user-list', {
        params: data
    });
};

// 更新自己用户接口 (/api/auth/user-update)
export const updateSelfUserAPI = async (
    data: any) => {
    return await service.put('/api/auth/user-update', data);
};


// 更新用户接口 (/api/auth/user-update)
export const updateUserAPI = async (
    data: {
        id: number | undefined;
        username?: string;
        password?: string;
        email?: string;
        phone?: string;
        department?: number | undefined;
        avatar?:string
    }) => {
    return await service.put('/api/auth/admin/user-update', data);
};

// 重制用户密码接口 (/api/auth/reset-password)
export const resetPasswordAPI = async (
    data: {
        id: number | undefined;
        // newPassword?: string;
    }) => {
    return await service.put('/api/auth/admin/reset-password', data);
};

// 删除用户接口 (/api/auth/admin/user-del)
export const deleteUserAPI = async (
    data: {
        id?: number | undefined;
    }) => {
    const params = {
        data: data
    }

    return await service.delete('/api/auth/admin/user-del', params);
};

// 添加用户接口 (/api/auth/admin/user-add)
export const addUserAPI = async (
    data: {
        username?: string;
        password?: string;
        email?: string;
        phone?: string,
        department?: number | undefined;
    }) => {
    const params = {
        data: data
    }

    return await service.post('/api/auth/admin/user-add', data);
};

//一般权限修改密码接口（仅限自己的id）url:/api/auth/admin/password-update
export const updatePasswordAPI = async (
    data: {
        password?: string;
        email?: string;
        verifyCode?: string;
    }) => {
    return await service.put('/api/auth/password-update', data);
};

//发送验证码接口
export const sendVerifyCodeAPI = async (
    data: {
        email?: string;
    }) => {
    return await service.post('/api/noauth/request-code', data);
};



