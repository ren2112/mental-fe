<template>
  <nav class="footer">
    <el-dropdown @command="handlePartSelect">
      <div class="dropdown-trigger">
        <span>{{ selectedPart }}</span> <!-- 这里会变成选中的分区名称 -->
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(label, index) in navOptions" :key="index" :command="index">
            {{ label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div @click="navigateTo('/post')">
      <span>发布帖子</span>
    </div>
    <div @click="navigateTo('/mob/my-home-page')">
      <span>个人主页</span>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, defineEmits } from "vue";

const router = useRouter();
const emit = defineEmits(["part-selected"]); // 声明自定义事件

const navOptions = [
  "理论学习",
  "走进高新",
  "青年活动",
  "青年夜校",
  "志愿服务",
  "社会实践",
];

const selectedPart = ref("分区选择"); // 默认显示“分区选择”

const navigateTo = (path) => {
  router.push(path);
};

const handlePartSelect = (index) => {
  selectedPart.value = navOptions[index]; // 选中后修改显示的文本
  emit("part-selected", index); // 发送选择的分区索引
};
</script>

<style scoped>
.footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: rgba(0, 130, 65, 1);
  padding: 10px 0;
  position: fixed;
  bottom: 0;
}

.footer div {
  color: white;
  font-size: 14px;
  cursor: pointer;
}
</style>
