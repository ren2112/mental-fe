<template>
<div class="container">
    <div class="header">
        <div class="header-box">
            <p>视频贴子发布:</p>
            <div class="btnbox">
                <RouterLink to="/mob/txtimgPost" class="headerbtn">
                    发布图文
                    <el-icon><Position /></el-icon>
                </RouterLink>
                <button class="headerbtn" @click="handlePost" >立即发布!</button>
            </div>
        </div>
    </div>
    <div class="datainputcontainer">
        <div class="partchoosediv">
            <div class="partchoosebox">
                <p>活动分区:</p>
                <div class="dropdownmenuBOX">
                    <mobDropDownMenu v-model="selectedIndex" />
                </div>
            </div>
        </div>
        <div class="titleinputbox">
            <input type="text" id="title_input" placeholder="请输入视频标题（最多40字）" maxlength="40" v-model="title">
        </div>
        <div class="videouploadbox">
            <p>选择视频文件：</p>
            <mobVideoUpload v-model="videofile"/>
        </div>
        <div class="contentinputbox">
            <textarea class="intro_textarea" placeholder="请输入视频简介（最多2000字）" maxlength="2000" v-model="content"></textarea>
        </div>
    </div>
</div>
<FooterNav />
</template>

<script setup>
import { ref } from "vue";
import FooterNav from "@/views/moble/footer.vue"; // 导入底部导航组件
import mobDropDownMenu from "../../components/moble/mobDropDownMenu.vue";
import mobVideoUpload from "../../components/moble/videoUploadComponent.vue"
import { ElMessage } from "element-plus";
import { publishPostAPI , uploadFileAPI } from "../../api/post"
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('');//贴子标题
const content = ref('');//视频贴子的简介（内容）
const selectedIndex = ref(-1); // 响应式变量存储下拉菜单选中的索引值,即分区编号
const videofile = ref(null); //视频文件
const videoURL = ref(''); //视频url

// 立即发布逻辑
const handlePost = async () => {
    // 判断上传文件和标题是否为空
    if (!videofile.value) {
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

    try{
        videoURL.value = await uploadVideoFile();

        const params = {
            type: 1,
            part: selectedIndex.value,
            title: title.value,
            content: content.value,
            video: videoURL.value
        }

        const response = await publishPostAPI(params);
        console.log("post response : ",response);
        if(response.code===0){
            ElMessage.success("发布成功！");
            setTimeout(() => {
                router.push('/mob/index'); 
            }, 1000);
        }
    }catch(error){
        ElMessage.error('发布出错！');
        console.log("error : ",error);
    }
};
const uploadVideoFile = async ()=>{ //上传视频返回url
    if(!videofile.value) return '';

    const formData = new FormData();
    formData.append('file',videofile.value);
    try{
        const response = await uploadFileAPI(formData);
        if(response.code === 0){
            return response.data.fileUrl;
        }else{
            ElMessage.error("封面上传出错！");
            console.log("video File response: ",response);
            throw new Error("封面上传失败");
        }
    }catch(error){
        ElMessage.error("封面上传出错！");
        throw error;
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 300px;
    min-height: 600px;
    background: white;
}

.header {
    width: 100%;
    height: 8vh;
    background: rgba(0, 130, 65, 1);
    color: white;
    text-align: center;
    padding-top: 1vh;
    font-size: 3vh;
    border-bottom-left-radius: 2vh;
    border-bottom-right-radius: 2vh;
}

.header-box {
    height: 100%;
    padding: 0.1vh 5vw;
    align-items: center;
    display: flex;
    justify-content: space-between;
}

.btnbox {
    display: flex;
    gap: 2vw;
    padding: 0.5vw 0.5vh;
}

.headerbtn {
    padding: 0.5vw 0.5vh;
    background-color: white;
    border: transparent;
    border-radius: 0.5vh;
    color: rgba(0, 130, 65, 1);
    font-size: 1.7vh;
    text-decoration: none;
    align-items: center;
    text-align: center;
}

.datainputcontainer {
    margin-top: 1vh;
    background-color: white;
    width: 100%;
    height: auto;
    gap: 1vh;
}

.partchoosediv {
    width: 90%;
    margin: 0 5%;
    border-bottom: 0.25vh solid rgba(0, 130, 65, 1);
    height: 6vh;
    display: flex;
    font-size: 2vh;
    align-items: center;
    justify-content: space-between;
}

.partchoosebox {
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
}

.dropdownmenuBOX {
    width: 50%;
    height: 100%;
    display: flex;
    margin-left: 5vw;
    align-items: center;
}

.titleinputbox {
    width: 90%;
    height: 6vh;
    margin: 0 5%;
    border-bottom: 0.25vh solid rgba(0, 130, 65, 1);
}
.videouploadbox{
    font-size: 1.5vh;
    width: 90%;
    margin: 0 5%;
    border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
    height: 12vh;
    display: flex;
    gap: 2vh;
}
.contentinputbox {
    width: 90%;
    margin: 0 5%;
    border-bottom: 0.3vh solid rgba(0, 130, 65, 1);
    height: 55vh; /* 使用相对高度 */
    overflow: hidden;
    position: relative;
}
.intro_textarea{
  width: 100%;
  height: 100%;
  font-size: 1.6vh;
  font-weight: 500;
  font-family: "Helvetica Neue", Arial, sans-serif; 
  resize: none;
  outline: none;
  border: transparent;
  box-sizing: border-box;
}

#title_input {
    width: 100%;
    height: 100%;
    font-size: 2.5vh;
    font-weight: 600;
    outline: none;
    border: transparent;
    box-sizing: border-box;
}

</style>