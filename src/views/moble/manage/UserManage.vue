<template>
  <div class="manage-content">
    <div class="search-box">
        <el-input
            v-model="inputSearch"
            placeholder="搜索"
            class="input-with-select"
            clearable
            autofocus
            @keyup.enter="onSearchUser(inputSearch)"
        >
          <template #prepend>
            <el-select v-model="typeSearch">
              <el-option v-for="item in typeAll" :value="item.id" :key="item.id" :label="item.label" class="option">
              </el-option>
            </el-select>
          </template>
          <template #append>
            <el-button
                :icon="Search"
                @click="onSearchUser(inputSearch)"
                class="search-buttom"
            />
          </template>
        </el-input>
    </div>


    <!-- 表格 -->
    <el-table :data="tableData"
              :table-layout="tableLayout"
              :default-sort="{ prop: 'ID', order: 'ascending' }"
              height="68vh"
    >
<!--      <el-table-column prop="Avatar" label="头像" width="50">-->
<!--        <template #default="scope">-->
<!--          <div class="avatar">-->
<!--            <img :src="scope.row.Avatar" alt="avatar" class="image"/>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="ID" label="帐号" show-overflow-tooltip width="60"/>
      <el-table-column prop="Username" label="姓名" show-overflow-tooltip width="60"/>
      <el-table-column prop="Email" label="邮箱" show-overflow-tooltip width="100"/>
      <el-table-column prop="Phone" label="电话" show-overflow-tooltip width="100"/>
      <el-table-column
          prop="Department"
          label="部门"
          :formatter="formatDepartment"
          sortable
          width="100"
          show-overflow-tooltip 
      />
      <el-table-column fixed="right" width="100" label="操作">
        <template #header>
          <el-button type="primary" @click="handleUpload" size="small">
            添加<el-icon class="el-icon--right"><Upload/></el-icon>
          </el-button>
        </template>
        <template #default="scope">
          <el-button :icon="Edit" @click="handleEdit(scope.row)" size="small">
            编辑
          </el-button>
          <br/>
          <el-button type="danger" :icon="Delete" @click="handleDelete(scope.row)" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--编辑对话框-->
    <el-dialog 
      v-model="editDialogVisible" 
      title="编辑用户信息" 
      align-center 
      draggable
      :width="dialogWidth"
      class="user-dialog"
    >
      <el-form :model="selectedUser"
               label-width="auto"
               :rules="rules"
               ref="editFormRef"
      >
        <el-form-item label="姓名" prop="Username">
          <el-input v-model="selectedUser.Username"/>
        </el-form-item>
<!--        <el-form-item label="修改密码" prop="Password">-->
<!--          <el-input v-model="selectedUser.Password" type="password" show-password/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="确认密码" prop="checkPassword">-->
<!--          <el-input v-model="selectedUser.checkPassword" type="password" show-password/>-->
<!--        </el-form-item>-->
        <el-form-item label="邮箱" prop="Email">
          <el-input v-model="selectedUser.Email"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="selectedUser.Phone"/>
        </el-form-item>
        <el-form-item label="部门" prop="Department">
          <el-select v-model="selectedUser.Department" placeholder="选择部门">
            <el-option
                v-for="item in departmentAll"
                :key="item.id"
                :label="item.label"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="display: flex; justify-content: space-between;">
          <!-- 将重置密码按钮放在最左边 -->
          <el-button @click="resetPassword(selectedUser)">重置密码</el-button>

          <!-- 将取消和确认按钮放在最右边 -->
          <div style="display: flex; gap: 10px;">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateUser(selectedUser)">确认</el-button>
          </div>
        </div>
      </template>
    </el-dialog>



<!--    &lt;!&ndash;密码编辑对话框&ndash;&gt;-->
<!--    <el-dialog v-model="passDialogVisible" title="修改用户密码" align-center draggable>-->
<!--      <el-form :model="selectedUser"-->
<!--               label-width="auto"-->
<!--               :rules="rules"-->
<!--               ref="passFormRef"-->
<!--      >-->
<!--        <el-form-item label="修改密码" prop="Password">-->
<!--          <el-input v-model="selectedUser.Password" type="password" show-password/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="确认密码" prop="checkPassword">-->
<!--          <el-input v-model="selectedUser.checkPassword" type="password" show-password/>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button @click="passDialogVisible = false">取消</el-button>-->
<!--          <el-button type="primary" @click="updatePass(selectedUser)">-->
<!--            确认-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->



    <!--添加对话框-->
    <el-dialog 
      v-model="addDialogVisible" 
      title="添加用户信息" 
      align-center 
      draggable
      :width="dialogWidth"
      class="user-dialog"
    >
      <el-form :model="selectedUser"
               label-width="auto"
               :rules="rules"
               ref="addFormRef"
      >
        <el-form-item label="姓名" prop="Username">
          <el-input v-model="selectedUser.Username"/>
        </el-form-item>
        <el-form-item label="密码" prop="Password">
          <el-input v-model="selectedUser.Password" type="password" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="selectedUser.checkPassword" type="password" show-password/>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <el-input v-model="selectedUser.Email"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="selectedUser.Phone"/>
        </el-form-item>
        <el-form-item label="部门" prop="Department">
          <el-select v-model="selectedUser.Department" placeholder="选择部门">
            <el-option
                v-for="item in departmentAll"
                :key="item.id"
                :label="item.label"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser(selectedUser)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>


    <!--分页-->
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="itemTotal"
        size="small"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
    />
  </div>
</template>



<script setup lang="ts">
/**
 * 导入（import）
 */
import {
  ref, watch, reactive, onMounted
} from 'vue'
import {
  Delete, Edit, Search, Upload
} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox, type TableInstance} from 'element-plus'
import {
  addUserAPI,
  deleteUserAPI,
  department,
  getUserListAPI, resetPasswordAPI, updatePasswordAPI,
  updateUserAPI
} from "@/api/user";
import {
  pageSize,
  pageNum,
  itemTotal,
  tableData,
  typeAll,
  typeSearch,
  inputSearch,
  onSearchUser
} from "@/stores/search"
import type { FormInstance, FormRules } from 'element-plus'


/**
 * 常/变量（const/let）的定义
 */
// 类型定义
interface User {
  ID?: number | undefined;
  Username?: string;
  Password?: string;
  Email?: string;
  Department?: number | undefined;
  Phone?: string;
  Avatar?: string;
}

// 对话框宽度设置
const dialogWidth = ref('90%')

// 外部导入
tableData.value = []
inputSearch.value = ''
typeSearch.value = 'ID'
typeAll.value = [
  { id: 'ID', label: '帐号'},
  { id: 'Username', label: '姓名'},
  { id: 'Email', label: '邮箱'},
  { id: 'Phone', label: '电话'}]
pageSize.value = 12;
pageNum.value = 1;
itemTotal.value = 0;


const departmentAll = ref([
  { id: 0, label: '区团工委' },
  { id: 1, label: '社区团组织' },
  { id: 2, label: '高校团组织' },
  { id: 3, label: '企业团组织' },
]);
const tableLayout = ref<TableInstance['tableLayout']>('fixed')
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
// 选中数据
let selectedUser = ref<any>({
  ID: undefined,
  Username: '',
  Password: '',
  checkPassword: '',
  Email: '',
  Phone: '',
  Department: undefined,
});
function resetSelectedUser() {
  selectedUser.value = {
    ID: undefined,
    Username: '',
    Password: '',
    checkPassword: '',
    Email: '',
    Phone: '',
    Department: undefined,
  };
}

const editFormRef = ref<FormInstance>()
const passFormRef = ref<FormInstance>()
const addFormRef = ref<FormInstance>()
const rules: FormRules<any> = reactive({
  Username: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  Password: [
    { validator: validatePass, trigger: 'blur' }
  ],
  checkPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ],
  Email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  Phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入有效的电话号', trigger: ['blur', 'change'] }
  ]
})


/**
 * 函数
 */
// 验证规则
function validatePass(rule: any, value: any, callback: any) {
  if (value === '') {
    // 密码为空时，不需要验证
    callback()
  } else {
    if (selectedUser.value.checkPassword !== '') {
      // 根据当前对话框的可见性，触发对应表单的验证
      // if (passDialogVisible.value && passFormRef.value) {
      //   passFormRef.value.validateField('checkPassword')
      // }
      if (addDialogVisible.value && addFormRef.value) {
        addFormRef.value.validateField('checkPassword')
      }
    }
    callback()
  }
}
function validatePass2(rule: any, value: any, callback: any) {
  if (selectedUser.value.Password === '') {
    // 如果未修改密码，则不需要验证
    callback()
  } else if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== selectedUser.value.Password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}


// 表格函数
// 定义 formatter 函数
function formatDepartment (row: User) {
  // 在 departmentAll.value 数组中查找 id 等于 cell 的部门对象
  const dept = departmentAll.value.find(d => d.id === row.Department);
  return dept ? dept.label : '未知部门';
}

// 获取用户列表
async function fetchUsers() {
  let data: {
    pageSize: number;    // 每页记录数（必需）
    pageNum: number;     // 页码（必需）
    ID?: number;         // 用户 ID（可选）
    Username?: string;   // 用户名（可选）
    Email?: string;      // 邮箱（可选）
    Phone?: string;      // 电话（可选）
    Department?: number; // 部门（可选）
  }

  if (department.value != -1) {
    data = {
      pageSize: pageSize.value,
      pageNum: pageNum.value,
      Department: department.value,
    }
  } else {
    data = {
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    }
  }

  try {
    console.log(data);
    const response = await getUserListAPI(data);
    console.log(response);

    if (response.code === 0) {
      if (response.data.users === null) {
        tableData.value = [];
        itemTotal.value = 0;
      } else {
        itemTotal.value = response.data.total;
        tableData.value = response.data.users.map((user: any) => ({
          Avatar: user.avatar,
          Username: user.username,
          ID: user.id,
          Email: user.email,
          Phone: user.phone,
          Department: user.department,
        }));
      }
    } else {
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


// 编辑
function handleEdit (user: User) {
  resetSelectedUser();
  selectedUser.value.ID = user.ID;
  selectedUser.value.Username = user.Username;
  selectedUser.value.Email = user.Email;
  selectedUser.value.Phone = user.Phone;
  selectedUser.value.Department = user.Department;
  editDialogVisible.value = true;
}

async function updateUser (user: User) {
  if (!editFormRef.value) return
  try {
    await editFormRef.value!.validate()

    // 如果验证通过，执行提交逻辑
    try {
      const data = {
        id: user.ID,
        username: user.Username,
        email: user.Email,
        phone: user.Phone,
        department: user.Department
      }
      const response = await updateUserAPI(data);

      if (response.code === 0) {
        await fetchUsers();
        ElMessage({
          message: '用户信息更新成功',
          type: 'success'
        });
        editDialogVisible.value = false;
      } else {
        ElMessage({
          message: response.msg || '更新失败',
          type: 'error'
        });
      }
    } catch (error) {
      ElMessage({
        message: "无法连接服务器",
        type: 'error',
      });
    }
  } catch (error) {
    // 如果验证失败
    ElMessage.error('请检查表单是否有误')
  }
}

// 修改密码
// async function updatePass (user: User) {
//   if (!passFormRef.value) return
//   try {
//     await passFormRef.value!.validate()
//
//     // 如果验证通过，执行提交逻辑
//     try {
//       const data = {
//         id: user.ID,
//         password: user.Password || '123',
//       }
//       const response = await updateUserAPI(data);
//
//       if (response.code === 0) {
//         ElMessage({
//           message: '密码更新成功',
//           type: 'success'
//         });
//         passDialogVisible.value = false;
//       } else {
//         ElMessage({
//           message: response.msg || '更新失败',
//           type: 'error'
//         });
//       }
//     } catch (error) {
//       ElMessage({
//         message: "无法连接服务器",
//         type: 'error',
//       });
//     }
//   } catch (error) {
//     // 如果验证失败
//     ElMessage.error('请检查表单是否有误')
//   }
// }

// 重置密码
async function resetPassword (user: User) {
  try {
    const data = {
      id: user.ID,
      // newPassword: "0000",
    }
    const response = await resetPasswordAPI(data);

    if (response.code === 0) {
      ElMessage({
        message: '密码重置成功',
        type: 'success'
      });
    } else {
      ElMessage({
        message: response.msg || '重置失败',
        type: 'error'
      });
    }
  } catch (error) {
    ElMessage({
      message: "无法连接服务器",
      type: 'error',
    });
  }
}

// 删除
const handleDelete = (row: User) => {
  ElMessageBox.confirm(
      '确认删除？',
      '警告',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    deleteUser(row);
  })
}

async function deleteUser (user: User) {
  try {
    const data = {
      id: user.ID,
    }
    const response = await deleteUserAPI(data)
    console.log(response);

    if (response.code === 0) {
      await fetchUsers();
      ElMessage({
        message: '用户信息删除成功',
        type: 'success'
      });
    } else {
      ElMessage({
        message: response.msg || '删除失败',
        type: 'error'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    ElMessage({
      message: "无法连接服务器",
      type: 'error',
    });
  }
}

// 添加
function handleUpload() {
  resetSelectedUser();
  addDialogVisible.value = true;
}

async function addUser (user: User) {
  if (!addFormRef.value) return
  try {
    await addFormRef.value!.validate()

    // 如果验证通过，执行提交逻辑
    try {
      const data = {
        username: user.Username,
        password: user.Password || '123',
        email: user.Email,
        phone: user.Phone,
        department: user.Department
      }
      console.log(data)
      const response = await addUserAPI(data);
      console.log(response)

      if (response.code === 0) {
        await fetchUsers();
        ElMessage({
          message: '用户信息添加成功',
          type: 'success'
        });
        addDialogVisible.value = false;
      } else {
        ElMessage({
          message: response.msg || '添加失败',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      ElMessage({
        message: "无法连接服务器",
        type: 'error',
      });
    }
  } catch (error) {
    // 如果验证失败
    ElMessage.error('请检查表单是否有误')
  }
}


// 分页函数
function handlePageChange(newPage : number) {
  pageNum.value = newPage;
}


/**
 * 监听
 */
onMounted(async () => {
  await fetchUsers();
});
watch([pageSize, pageNum, department], fetchUsers, { immediate: true });
</script>

<style scoped lang="scss">
.manage-content {
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;

  // justify-content: space-between;
  margin-top: 2.5vh;
  margin-bottom: 2.5vh;
  // width: 100%;
  row-gap: 2.5vh;

  /* 输入框容器 */
  .search-box {
    /* 修改搜索框样式 */
    .el-input {
      max-width: 100vw;
      --el-input-border-color: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
      border-radius: 3.5vh; /* 圆角 */
      border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
      transition: border-color 0.3s, background-color 0.3s;
    }
    ::v-deep .el-input__wrapper {
      border-radius: 3.5vh; /* 圆角 */
      box-shadow: none;
    }
    ::v-deep .el-input-group__append {
      border-radius: 3.5vh; /* 圆角 */
      border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
      transition: border-color 0.3s, background-color 0.3s;
    }

    /* 修改按钮的样式 */
    .el-button {
      right: 0;
      border-radius: 3.5vh;
      background-color: rgba(0, 130, 65, 1); /* 默认按钮背景色 */
      color: white;
      border: none;
      transition: background-color 0.3s, box-shadow 0.3s;
    }


    /* 修改选择器的样式 */
    ::v-deep .el-select {
      width: 20vw;
      left: 0;
      border-radius: 3.5vh;
      background-color: rgba(0, 130, 65, 1); /* 默认按钮背景色 */
      border: none;
      transition: background-color 0.3s, box-shadow 0.3s;
    }
    ::v-deep .el-select__placeholder {
      color: white;
    }
    ::v-deep .el-input-group__prepend {
      border-radius: 3.5vh; /* 圆角 */
      border: 1px solid rgba(0, 130, 65, 1); /* 边框颜色 */
      transition: border-color 0.3s, background-color 0.3s;
    }
  }


  /* 表格 */
  .el-table {
    border-radius: 1.2vh; /* 设置元素的圆角为 10 像素 */
  }
  .el-table__body {
    align-items: flex-start; /* 确保行顶部对齐 */
  }

  .avatar {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    height: 100%;            /* 让容器高度填满单元格 */

    .image {
      width: 3vh;  /* 设置图片的宽度 */
      height: 3vh; /* 设置图片的高度 */
      object-fit: cover; /* 保持图片比例并裁剪以适应尺寸 */
      border-radius: 50%;        /* 使图片成为圆形 */
      border: 1px solid rgba(0,130,65,0.3); /* 添加圆形边框 */
    }
  }
}

/* 对话框样式 */
:deep(.user-dialog) {
  .el-dialog__body {
    padding: 2vh;
  }
  
  .el-dialog__header {
    padding: 2vh;
    margin-right: 0;
    
    .el-dialog__title {
      // font-size: 2.2vh;
      font-weight: bold;
    }
  }
}
</style>
