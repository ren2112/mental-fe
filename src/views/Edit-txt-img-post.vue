<template>
    <div class="background_container">
      <div class="items_container">
        <div class="others_box">
          <div class="image_insert">
            <label>添加图片到内容：</label>
            <div class="image_upload_container">
              <input
                  type="file"
                  accept="image/*"
                  ref="imageInput"
                  @change="uploadImage"
                  style="display: none;"
              />
              <button class="post_btn" @click="selectUploadImage">上传图片</button>
            </div>
          </div>
          <div class="type_choose">
            <label>选择活动分区：</label>
            <div id="app">
              <Dropdown 
                :defaultSelected="selectedIndex"
                @update:selectedIndex="updateSelectedIndex"
              />
            </div>
          </div>
          <div class="head_box">
            <button class="head_btn" @click="handlePost">完成修改</button>
          </div>
        </div>
        <div class="title_line">
          <input
              type="text"
              id="title_input"
              placeholder="请输入贴子标题（最多40字）"
              maxlength="40"
              v-model="title"
          />
        </div>
        <div class="text_part">
          <div 
              id="content_input"
              contenteditable="true" 
              class="editable-content"
              maxlength="4000"
              @input="updateContent"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
          ></div>
          <div 
              v-if="showPlaceholderText && !content" 
              class="placeholder-text"
            >
              请输入贴子内容(最多4000字)
          </div>
        </div>
        <div class="cover_box">
          <div class="cover_choose">
            <label>选择贴子封面：</label>
            <div class="cover_upload_container" @click="selectImage" @mouseover="showChangeText = true" @mouseleave="showChangeText = false">
              <input type="file" accept="image/*" ref="fileInput" @change="onImageChange" style="display: none;"/>
              <div v-if="!image" class="cover_placeholder">+ 上传贴子封面</div>
              <img v-if="image" :src="image" class="uploaded_cover"  alt=""/>
              <div v-if="image && showChangeText" class="text_for_change" @click.stop="selectImage">更改</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Dropdown from '../components/dropdownmenu.vue';
import { uploadFileAPI, updatePostAPI ,getPostDetailAPI,publishPostAPI } from '../api/post'; 
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

interface PostData {
  title: string;
  content: string;
  cover: string;
  part:number;
  // 根据实际接口响应添加其他字段
}

export default defineComponent({
  name: 'EditPost',
  components: {
    Dropdown,
  },
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    const curTab = route.query.curTab || 0
    
    // DOM 引用需要明确类型
    const fileInput = ref<HTMLElement | null>(null)
    const imageInput = ref<HTMLElement | null>(null)
    
    // 响应式数据需要类型声明
    const fileName = ref<string>('未选择文件')
    const image = ref<string | null>(null)
    const showChangeText = ref<boolean>(false)
    const title = ref<string>('')
    const content = ref<string>('')
    const selectedIndex = ref<number>(-1)
    const coverFile = ref<File | null>(null)
    const cover = ref<string>('')
    const showPlaceholderText = ref<boolean>(true)
    const loading = ref<boolean>(false)

    const postID = ref<number>(0) // 初始化为 0

    const updateSelectedIndex = (index: number) => {
      selectedIndex.value = index
    }

    const selectImage = () => {
      (fileInput.value as HTMLInputElement)?.click()
    }

    const onImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      const file = input.files?.[0]
      if (file) {
        coverFile.value = file
        image.value = URL.createObjectURL(file)
      }
    }

    const selectUploadImage = () => {
      (imageInput.value as HTMLInputElement)?.click()
    }

    const uploadImage = async (event: Event) => {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append('file', file); // 上传的文件
            // 保持原有逻辑，添加类型断言
            formData.append('type', '0')
            formData.append('title', ''); // 标题（可为空）
            formData.append('content', content.value); // 当前内容（可为空）
            formData.append('part', '1')
            try {
                const response = await uploadFileAPI(formData);
                if (response.code === 0) {
                    const picUrl = response.data.picUrl;
                    insertImage(picUrl);
                } else {
                    ElMessage.error("图片上传失败");
                    console.error('上传失败:', response.msg);
                }
            } catch (error) {
                ElMessage.error("图片上传出错");
                console.error('上传出错:', error);
            }
        }
    }

    // 明确的参数类型
    const insertImage = (url: string) => {
        const editableDiv = document.getElementById('content_input')
        if (!editableDiv) return

        const imgElement = document.createElement('img')
        imgElement.src = url
        imgElement.style.maxWidth = '100%'; // 自适应宽度
        imgElement.style.height = 'auto';  // 自适应高度
        imgElement.style.margin = '10px 0';  // 设置图片的上下间距
        editableDiv.appendChild(imgElement)
        updateContent()
    }

    const updateContent = () => {
      const editableDiv = document.getElementById('content_input')
      if (!editableDiv) return

      const rawContent = editableDiv.innerHTML.trim()
      content.value = rawContent === '<br>' ? '' : rawContent
    }

    // 异步函数返回 Promise
    const uploadcover = async (): Promise<string> => {
        if (!coverFile.value) return ''
        const formData = new FormData();
        formData.append('file',coverFile.value);
        formData.append('type',0);
        formData.append('part',selectedIndex.value);
        formData.append('coverFlag',1);
    
        try{
            const response = await uploadFileAPI(formData);
            if(response.code===0){
                cover.value = response.data.picUrl;
                return cover.value;
            }else{
                ElMessage.error(response.msg);
                throw new Error('封面上传失败！');
            }
        }catch(error){
            console.error('封面上传出错:', error);
            throw error;
        }
    }

    // API 响应类型
    interface UpdateResponse {
      code: number
      msg: string
      data?: any
    }

    const handlePost = async () => {
        if (!title.value.trim()) {
            ElMessage.warning('帖子标题不能为空');
            return;
        }
        if (!content.value.trim()) {
            ElMessage.warning('帖子内容不能为空');
            return;
        }
        if (selectedIndex.value === -1) {
            ElMessage.warning('请选择一个活动分区');
            return;
        }
        if (!coverFile.value && !image.value) {
            ElMessage.warning('请选择帖子封面');
            return;
        }

        try {
            cover.value = await uploadcover();
            const body = {
                postID: postID.value,
                title:title.value,
                content:content.value,
                part:selectedIndex.value,
                cover:cover.value || image.value
            };
            let response = {}
            if(curTab === '1'){
              response = await publishPostAPI(body)
            }else{
              response = await updatePostAPI(body);
            }
            if(response.code === 0){
                ElMessage.success('修改成功');
                router.push({
                  name: 'my-home-page',
                  query: { id: authStore.userInfo.id }
                });
        
            }else{
                ElMessage(response.msg || "未知错误");
            }
        } catch (error) {
            ElMessage.error('修改出错，请稍后重试');
            console.error('修改错误:', error)
        }
    }

    const fetchPostData = async (): Promise<void> => {
      if (!postID.value) {
        ElMessage.error('无效的贴子 ID')
        return
      }

      try {
        loading.value = true
        const response = await getPostDetailAPI({
          postID: postID.value,
          token: authStore.token
        })
    // 填充数据到表单
        const postData = response.data.post as PostData
        title.value = postData.title
        content.value = postData.content
        image.value = postData.cover
        selectedIndex.value = postData.part
    // 渲染富文本内容
        const editableDiv = document.getElementById('content_input')
        if (editableDiv) {
          editableDiv.innerHTML = postData.content || ''
        }
      } catch (error) {
        console.error('获取贴子失败:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      const id = route.query.postID
      postID.value = typeof id === 'string' ? parseInt(id, 10) : 0
      if (!postID.value) {
        ElMessage.error('无效的贴子 ID')
        return
      }
      fetchPostData()
    })

    return {
      // 保持原有返回结构
      fileName,
      image,
      showChangeText,
      fileInput,
      imageInput,
      title,
      content,
      selectedIndex,
      coverFile,
      cover,
      showPlaceholderText,
      loading,

      // 方法列表
      selectImage,
      onImageChange,
      selectUploadImage,
      uploadImage,
      updateContent,
      hidePlaceholder: () => showPlaceholderText.value = false,
      showPlaceholder: () => {
        if (!content.value.trim()) {
          showPlaceholderText.value = true
        }
      },
      updateSelectedIndex,
      uploadcover,
      handlePost
    }
  }
})
</script>

<style scoped>
.background_container{
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
.items_container{
    width: 90%;
    min-width: 1000px;
    height: auto;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 5px 5px 5px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    background-color: white;
}
.others_box{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 130, 65, 1);
    flex-wrap: wrap;
    margin: 10px 0;
}
.title_line{
    width: 100%;
    height: 60px;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.text_part{
    width: 100%;
    height: 520px;
    border-bottom: 1px solid rgba(0, 130, 65, 1);
    margin: 5px 0;
    display: flex;
    justify-content: center;
    position: relative;
}

.editable-content {
  width: 890px;
  border: 1px solid #ccc;
  min-height: 200px;
  overflow-y: auto;
  line-height: 1.5;
}

.editable-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

.placeholder-text {
  position: absolute;
  color: #aaa;
  pointer-events: none; /* 防止点击 placeholder */
  left: 15px;
}

.cover_box{
  width: 100%;
  height: 230px;
  margin: 10px 0;
  border-bottom: 1px solid rgba(0, 130, 65, 1);
}
#content_input {
  width: 100%; 
  height: 480px; /* 设置高度 */
  font-size: 16px; /* 字体大小 */
  border: transparent; /* 边框颜色 */
  resize: none; 
  outline: none; /* 去除默认聚焦边框 */
  margin: 1px 0;
}

.head_box{
    width: 33%;
    height: 40px;
    display: flex;
    align-items: center;
    flex: 1;
    margin: auto;
}
.type_choose{
    width: 33%;
    height: 45px;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.image_insert{
    width: 33%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
}
.cover_choose{
    width: 100%;
    height: 220px;
    margin: 5px 0;
    display: flex;
}
.cover_upload_container{
    width: 280px;
    height: 210px;
    border: 2px dashed rgb(128, 128, 128);
    position: relative;
    cursor: pointer;
    overflow: hidden;
}
.cover_placeholder{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    color: rgb(128, 128, 128);
}
.uploaded_cover{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.text_for_change{
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    color: black;
}
.post_btn{
    text-decoration: none;
    color: rgba(0,130,65,1);
    background-color: white;
    font-size: 16px;
    padding: 6px 42px;
    border: 1px solid rgba(0,130,65,1);
    border-radius: 4px;
    transition: background-color 0.3s;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}
.post_btn:hover{
    background-color: rgba(0,130,65,1);
    color: white;
}
.head_btn{
    width: auto;
    height: 35px;
    font-size: 16px;
    color: white;
    padding: 5px 42px;
    border: 1px solid rgba(0,130,65,1);
    border-radius: 3px;
    background-color: rgba(0,130,65,0.6);
    transition: background-color 0.3s;
    display: inline-block;
    margin: 5px;
    margin-bottom: 10px;
}
.head_btn:hover{
    background-color: rgba(0,130,65,1);
    color: white;
}
.style1{
  background-color: rgba(0,130,65,0.6);
  color: white;
}

#title_input{
    width: 100%;
    height: 50px;
    font-size: 24px;
    font-weight: 600;
    outline: none;
    border: transparent;
    border-bottom: 1px solid rgba(0,130,65,1);
    margin: 5px 0px;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 5px;
    width: 200px;
}

h1{
    color: rgba(0,130,65,1);
}
</style>