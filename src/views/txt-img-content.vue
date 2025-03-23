<template>
    <div class="background_container">
        <div class="left_container">
            <div class="author_detail" @click="navigateToProfile">
                <div class="author_img">
                    <img :src="author.avatar" />
                </div>
                <div class="author_name">
                    <h3>{{ author.name }}</h3>
                </div>
            </div>
            <div class="contact_container">
                <button class="contact_btn" @click="goTo_chat_page">联系作者</button>
            </div>
            <div class="intro_container"></div>
        </div>
        <div class="details_container">
            <div class="img-txt_container"></div>
            <div class="handle_contianer">
                <button class="three_btn" @click="sign_up">报名参加</button>
                <button class="three_btn" @click="favor">收藏</button>
                <button class="three_btn" @click="share">转发</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

interface Author {
    avatar: string;
    name: string;
}

export default {
    props: {
        authorId: {
            type: String,
            required: true
        }
    },
    
    data() {
        return {
            author: {} as Author, // 使用类型断言
        }
    },
    
    mounted() {
        this.fetchAuthorInfo();
    },
    
    methods: {
        goTo_chat_page() {
            // 跳转到聊天页面的函数
        },
        
        async fetchAuthorInfo() {
            try {
                const response = await axios.get(`/api/authors/${this.authorId}`);
                this.author = response.data;
            } catch (error) {
                console.error('Error fetching author info:', error);
            }
        },
        
        navigateToProfile() {
            this.$router.push({ name: 'AuthorProfile', params: { authorId: this.authorId } });
        },
        
        sign_up() {},
        favor() {},
        share() {},
    },
}
</script>


 <style scoped> 
 
.background_container{
    display: flex;
    margin-top: 2px;
}

.left_container{
    width: 300px;
    height: 1000px; /* 后续改为auto  */
    background-color: aqua;
}

.details_container{
    width:800px;
    height: 900px;  /* 后续改为auto  */
    background-color: azure;
}

.img-txt_container{
    width:800px;
    height: 600px;
    background-color: bisque;
    justify-content: center;
}

.author_detail{
    width: 300px;
    height: 80px;
    display: flex;
    cursor: pointer;
}

.author_img{
    width: 60px;
    height: 60px;
    margin:10px 20px;
}
.author_name{
    width: 160px;
    height: 60px;
    margin: 10px 20px;
    justify-content: center;
}

.contact_container{
    width: 300px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.contact_btn{
    width: 200px;
    height: 28px;
    cursor: pointer;
    border: 1px orange;
    border-radius: 4px;
}

.handle_contianer{
    width:800px;
    height: 30px;
    background-color: blueviolet;
    display: flex;
}

.intro_container{
    width: 300px;
    height:400px;
}

.three_btn{
    width: 80px;
    height: 20px;
    margin: 4px 10px;
    border: 1px rgba(254,174,96,0.9);
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
}
</style>