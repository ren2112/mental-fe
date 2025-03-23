import {ref} from "vue";
import {isEmpty} from "@/stores/method"
import {getUserListAPI, department} from "@/api/user";
import {ElMessage} from "element-plus";
import {getUnapprovedPostsAPI} from "@/api/post";


/**
 * 常/变量（const/let）的定义
 */
export let tableData = ref([]);

export const inputSearch = ref()
export const typeSearch = ref<string>()
export const typeAll = ref([{}])
export const pageSize = ref<number>(6);
export const pageNum = ref<number>(1);
export let itemTotal = ref<number>(0);
export const partNum = ref('');




// 搜索框函数
export async function onSearchUser(inputSearch: string) {
    // if (isEmpty(inputSearch)) {
    //     // 输入为空时，重置
    //     await fetchUsers();
    // }
    // else {
    const searchField = typeSearch.value; // 获取当前搜索类型
    let data: {
        pageSize: number;    // 每页记录数（必需）
        pageNum: number;     // 页码（必需）
        ID?: number;         // 用户 ID（可选）
        Username?: string;   // 用户名（可选）
        Email?: string;      // 邮箱（可选）
        Phone?: string;      // 电话（可选）
        Department?: number;
        Avater?:string;
    }
    if (department.value != -1) {
        data = {
            pageSize: pageSize.value,
            pageNum: pageNum.value,
            Department: department.value,
            [searchField]: inputSearch
        }
    } else {
        data = {
            pageSize: pageSize.value,
            pageNum: pageNum.value,
            [searchField]: inputSearch
        }
    }

    try {
        console.log(data);
        const response = await getUserListAPI(data);
        console.log(response);

        if (response.code === 0) {
            if(response.data.users === null) {
                tableData.value = [];
                itemTotal.value = 0;
            }

            else {
                itemTotal.value = response.data.total;
                tableData.value = response.data.users.map((user: any) => ({
                    Username: user.username,
                    Avatar:user.avatar,
                    ID: user.id,
                    Email: user.email,
                    Phone: user.phone,
                    Department: user.department,
                }));
            }
        }
        else {
            ElMessage({
                message: response.msg || '搜索失败',
                type: 'error'
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        ElMessage({
            message: "无法连接服务器",
            type: 'error',
        });
    }
}

// 搜索框函数
export async function onSearchPost(inputSearch: string, isApproved: number) {
    // const searchField = typeSearch.value; // 获取当前搜索类型
    let data: {
        pageSize: number;    // 每页记录数（必需）
        pageNum: number;     // 页码（必需）
        part: number | string,
        isApproved: number,
        searchQuery: string;
    }
    data = {
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        part: partNum.value,
        isApproved: isApproved,
        searchQuery: inputSearch
    }

    try {
        console.log(data);
        const response = await getUnapprovedPostsAPI(data);
        console.log(response);

        if (response.code === 0) {
            if(response.data.posts === null) {
                tableData.value = [];
                itemTotal.value = 0;
            }
            else {
                itemTotal.value = response.data.total;
                tableData.value = response.data.posts.map((post: any) => ({
                    ID: post.id,
                    Cover: post.cover,
                    Title: post.title,
                    Content: post.content,
                    UserId: post.user.username,
                    Type: post.type,
                    Part: post.part,
                    createdAt: post.created_at,
                    IsAudit: post.is_audit
                }));
            }
        }
        else {
            ElMessage({
                message: response.msg || '刷新失败',
                type: 'error'
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        ElMessage({
            message: "无法连接服务器",
            type: 'error',
        });
    }
}
