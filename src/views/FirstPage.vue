<template>
  <div class="background">
    <div class="button-container">
      <router-link to="/login" class="rounded-button">登 录</router-link>
      <router-link to="/index" class="rounded-button">游客访问</router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
  }
}
</script>

<style scoped>
.background {
  background-image: url('../assets/back_ground_picture.jpg'); 
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 30px; 
}

.rounded-button {
  width: 240px;
  height: 50px;
  background-color: rgba(0,130,65,0.5);
  color: white;
  font-size: 20px;
  border: none;
  border-radius: 25px; 
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center; 
  align-items: center; 
  text-align: center; 
  text-decoration: none;
}

.rounded-button:hover {
  background-color: rgba(0,130,65,1);
}


/* 平板及以上：让按钮横向排列 */
@media (min-width: 768px) {  
  .rounded-button {
    font-size: 30px; /* 适配桌面端 */
    width: 300px;
  }
}
</style>
