// import { post } from "node_modules/axios/index.cjs";
import service from "./service";


export const getPostsByPartAPI = async (part: number, pageNum: number, pageSize: number, searchQuery: string) => {
    return await service.post('/api/noauth/browse', {
        part,     // 分区
        pageNum,  // 页码
        pageSize, // 每页数量
        searchQuery
    });
};

export const getPostDetailAPI = async (params:any) => {
    return await service.get("/api/noauth/get-post-detail", {
        params: {
            postID: params.postID,
            token: params.token,
        },
    });
};

// 获取用户发布的帖子列表
export const getSelfPostsAPI = async (params: any) => {
    return await service.get("/api/noauth/get-self-post", {
        params: {
            isAudit: params.isAudit, // 审核状态 0: 未审核, 1: 已审核, 2: 审核不通过
            pageNum: params.pageNum, // 页码
            pageSize: params.pageSize, // 每页数量
            userID:params.userID,
            token:params.token
        }
    });
};

// 获取用户发布的帖子列表
export const getdelPostsAPI = async (params: any) => {
    return await service.post("/api/auth/get-deleted-post", params);
};

export const publishPostAPI = async (params: { title: string; content: string; part: number }) => {
    return await service.post('/api/auth/publish-post', params);
};

export const uploadFileAPI = async (formData: FormData) => {
    return await service.post('/api/auth/upload-file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const delSelfPostAPI= async (postID:number) => {
    return await service.delete('/api/auth/delete-post',{
        data:{postID: postID}
    });
};

// 获取对应审批状态的帖子列表
export const getUnapprovedPostsAPI = async (params: {
    pageNum: number;
    pageSize: number;
    part?: number | string;
    isApproved?: number;
    searchQuery?: string;
}) => {
    return await service.get('/api/auth/admin/get-unapproved-list', {
        params: {
            pageNum: params.pageNum,   // 页码
            pageSize: params.pageSize,
            part: params.part,         // 模块部分，0-理论学习，1-走进高新等
            isApproved: params.isApproved,
            searchQuery: params.searchQuery,
        },
    });
};

export const approvePostAPI = async (data: {
    postID: number | undefined;
    action: number;
}) => {
    return service.put('/api/auth/admin/approve-action', data);
};

export const deletePostAPI = async (postID: number) => {
    return service.delete('/api/auth/delete-post', {
        data: { postID: postID }, // 将 postID 作为请求体传递
    });
};

//修改贴子
export const updatePostAPI = async (params: {
    postID: number;
    title: string;
    content: string;
    part: number;
    cover: string;
    video?:string;
}) => {
    const response = await service.put('/api/auth/update-post', params);
    return response; 
};