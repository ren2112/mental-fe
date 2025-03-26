<template>
    <div class="image-uploader" :class="{ active: previewUrl }" @click="triggerUpload">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        hidden
        @change="handleFileChange"
      >
      
      <!-- 未选择状态 -->
      <div v-if="!previewUrl" class="upload-placeholder">
        <span class="upload-text">上传封面</span>
      </div>
  
      <!-- 已选择状态 -->
      <div v-else class="image-preview">
        <img
          :src="previewUrl"
          class="preview-image"
          alt="已选封面"
        >
        <button class="change-btn">更改</button>
      </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ImageUploader',
  emits: ['update:modelValue'], // 添加事件声明
  setup(_, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)
    const previewUrl = ref<string>('')
    const currentFile = ref<File | null>(null)

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.value = ''
        fileInput.value.click()
      }
    }

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      
      if (file) {
        previewUrl.value = URL.createObjectURL(file)
        currentFile.value = file
        emit('update:modelValue', file) // 触发更新事件
      }
    }

    return {
      fileInput,
      previewUrl,
      triggerUpload,
      handleFileChange
    }
  }
})
</script>
  
<style scoped>
  /* 基础容器样式 */
  .image-uploader {
    position: relative;
    width: 100%;
    max-width: 104px;
    max-height: 78px;
    background: #f5f5f5;
    border: 2px dashed #999;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  /* 激活状态样式 */
  .image-uploader.active {
    border-style: solid;
    border-color: #666;
    background: #fff;
  }
  
  /* 未选择时的占位样式 */
  .upload-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  
  .upload-text {
    color: #666;
    font-size: 1.2rem;
    user-select: none;
  }
  
  /* 图片预览样式 */
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 更改按钮样式 */
  .change-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border: 1px solid #ddd;
    border-radius: 15px;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .change-btn:active {
    transform: scale(0.95);
    background: #f0f0f0;
  }
  
  /* 移动端优化 */
  @media (max-width: 480px) {
    .image-uploader {
      height: 180px;
      margin: 10px 0;
    }
    
    .upload-text {
      font-size: 1rem;
    }
    
    .change-btn {
      padding: 5px 10px;
      font-size: 0.85rem;
    }
  }
</style>