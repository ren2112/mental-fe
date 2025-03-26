<template>
<div class="container">
    <div class="header">
        <div class="header-box">
            <h3>视频贴子发布</h3>
            <div class="btnbox">
                <RouterLink to="/mob/txtimgPost" class="headerbtn">发布图文</RouterLink>
                <button class="headerbtn" @click="handlePost" >立即发布</button>
            </div>
        </div>
    </div>
    <div class="datainputcontainer">
        <div class="partchoosediv">
            <h4>活动分区：</h4>
            <div class="dropdownmenuBOX">
                <mobDropDownMenu v-model="selectedIndex" />
            </div>
        </div>
        <div class="titleinputbox">
            <input type="text" id="title_input" placeholder="请输入视频标题（最多40字）" maxlength="40" v-model="title">
        </div>
        <div class="contentinputbox">
            <textarea id="intro_textarea" placeholder="请输入视频简介（最多2000字）" maxlength="2000" v-model="content"></textarea>
        </div>
        <div class="videoinputbox">
            选择视频文件：
            <videoUploadComponent v-model="videofile" />
        </div>
    </div>
</div>
<FooterNav />
</template>

<script lang="ts" setup>
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import mobDropDownMenu from "../../components/moble/mobDropDownMenu.vue";
import videoUploadComponent from "../../components/moble/videoUploadComponent.vue";
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {uploadFileAPI } from '@/api/post'
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref(''); // 帖子标题
const content = ref(''); // 帖子简介
const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值
const videofile = ref(null); //视频文件

const handlePost = async () => {  //发布贴子逻辑
    // 判断上传文件和标题是否为空
    if (! videofile.value) {
        ElMessage.warning('请上传视频文件');
        return;
    }
    if (!title.value.trim()) {
        ElMessage.warning('帖子标题不能为空');
        return;
    }
    if(!content.value.trim()){
        ElMessage.warning('贴子内容不能为空');
        return;
    }
    if (selectedIndex.value === -1) {
        ElMessage.warning('请选择一个活动分区');
        return;
    }

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', videofile.value);  //视频文件
    formData.append('type',1);  //视频贴子
    formData.append('title', title.value); // 添加标题
    formData.append('content', content.value); // 添加简介
    formData.append('part',selectedIndex.value);  //贴子分区
    try {
        // 调用接口
        const response = await uploadFileAPI(formData);
        if(response.code===0){
            ElMessage.success(response.msg);
            setTimeout(() => {
                router.push('/mob/index');
            }, 1000);
        }
    }
    catch (error) {
        ElMessage.error('错误信息:', error);
    }

};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 330px;
    height: 100vh;
    background: white;
}
  
.header {
    width: 100%;
    height: 60px;
    background: rgba(0, 130, 65, 1);
    color: white;
    text-align: center;
    padding-top: 20px;
    font-size: 18px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}
.header-box{
    height: 50%;
    padding: 1px 5px;
    padding-left: 8px;
    align-items: center;
    display: flex;
    justify-content: space-between;
}
.btnbox{
    display: flex;
    gap: 10px;
    padding: 2px 5px;
}
.headerbtn{
    padding: 1px 3px;
    background-color: white;
    border: transparent;
    border-radius: 5px;
    color: rgba(0, 130, 65, 1);
    font-size: 1rem;
    text-decoration: none;
    align-items: center;
    text-align: center;
}
.datainputcontainer{
    margin-top: 5px;
    background-color: white;
    width: 100%;
    height: auto;
    gap: 5px;
}
.partchoosediv{
    width: 90%;
    margin: 0 5%;
    border-bottom: 2px solid rgba(0, 130, 65, 1);
    height: 40px;
    display: flex;
    align-items: center;
}
.dropdownmenuBOX{
    width: 30%;
    height: 100%;
    display: flex;
    align-items: center;
}
.titleinputbox{
    width: 90%;
    height: 40px;
    margin: 0 5%;
    border-bottom: 2px solid rgba(0, 130, 65, 1);
}
.contentinputbox{
    width: 90%;
    margin: 0 5%;
    border-bottom: 2px solid rgba(0, 130, 65, 1);
    min-height: 250px;
    max-height: 600px;
}
.videoinputbox{
    width: 90%;
    margin: 0 5%;
    border-bottom: 2px solid rgba(0, 130, 65, 1);
    height: 100px;
    display: flex;
}
#title_input{
  width: 100%;
  height: 100%;
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  border: transparent;
  box-sizing: border-box;
}
#intro_textarea{
  width: 100%;
  height: 100%;
  font-size: 0.9rem;
  resize: none;
  outline: none;
  border: transparent;
  box-sizing: border-box;
}
</style>