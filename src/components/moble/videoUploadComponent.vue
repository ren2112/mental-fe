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
import { defineComponent, ref, watch  , onBeforeUnmount } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'VideoUploader',
  emits: ['update:modelValue'],  // 添加事件声明
  props: {
    modelValue: {
      type: [File, String] as PropType<File | string>, // 同时支持File和URL
      default: null
    }
  },
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)
    const previewUrl = ref<string>('')

    // 监听prop变化
    watch(() => props.modelValue, (newVal) => {
      if (typeof newVal === 'string') {
        // 处理URL类型
        previewUrl.value = newVal;
      } else if (newVal instanceof File) {
        // 处理File类型
        previewUrl.value = URL.createObjectURL(newVal);
      } else {
        previewUrl.value = '';
      }
    }, { immediate: true });

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

    onBeforeUnmount(() => {
      if (previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value);
      }
    });

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
    width: 12vh;
    max-height: 9vh;
    margin: 3vh 0;
    background: #f5f5f5;
    border: 2px dashed #999;
    border-radius: 1vh;
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
    font-size: 1.3vh;
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