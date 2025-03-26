<template>
    <div class="upload-container" :class="{ active: previewUrl }" @click="triggerUpload">
      <input
        ref="fileInput"
        type="file"
        accept="video/*"
        hidden
        @change="handleFileChange"
      >
      
      <!-- 未选择状态 -->
      <div v-if="!previewUrl" class="upload-placeholder">
        <span class="upload-text">上传视频</span>
      </div>
  
      <!-- 已选择状态 -->
      <div v-else class="video-preview">
        <video
          :src="previewUrl"
          class="preview-video"
          disablePictureInPicture
          controlsList="nodownload"
        ></video>
        <button class="change-btn" @click.stop="triggerUpload">更改</button>
      </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'VideoUploader',
  emits: ['update:modelValue'],  // 添加事件声明
  props: {
    modelValue: {  // 新增prop用于v-model
      type: File as () => File | null,
      default: null
    }
  },
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)
    const previewUrl = ref<string>('')

    // 监听prop变化
    watch(() => props.modelValue, (newFile) => {
      if (!newFile) {
        previewUrl.value = ''
      }
    })

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
        emit('update:modelValue', file)  // 触发更新
      } else {
        emit('update:modelValue', null)
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
  .upload-container {
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
  .upload-container.active {
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
    font-size: 1rem;
    user-select: none;
  }
  
  /* 视频预览样式 */
  .video-preview {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .preview-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none; /* 禁用视频控制 */
  }
  
  /* 更改按钮样式 */
  .change-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(2px);
  }
  
  .change-btn:active {
    transform: scale(0.95);
    background: rgba(0, 0, 0, 0.8);
  }
  
  /* 移动端优化 */
  @media (max-width: 480px) {
    .upload-container {
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