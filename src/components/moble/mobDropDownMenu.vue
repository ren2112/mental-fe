<template>
    <div class="dropdown" @click.stop="toggleDropdown">
      <button class="dropbtn">{{ selectedOption }}</button>
      <transition name="slide-fade">
        <div v-if="isOpen" class="dropdown-content">
          <a href="#" v-for="(option,index) in options" :key="option" 
             @click.prevent="selectOption(option,index)">
            {{ option }}
          </a>
        </div>
      </transition>
    </div>
</template>
  
<script>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
  
  export default {
    name: 'Dropdown',
    props: {
      modelValue: {
        type: Number,
        default: -1,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const isOpen = ref(false);
      const options = ref(['理 论 学 习', '走 进 高 新', '青 年 活 动','青 年 夜 校','志 愿 服 务','社 会 实 践']);
      const selectedOption = ref(
        props.defaultSelected >= 0 
          ? options.value[props.defaultSelected] 
          : '请选择活动类型：'
      );
      watch(() => props.modelValue, (newVal) => {
        if (newVal >= 0 && newVal < options.value.length) {
          selectedOption.value = options.value[newVal];
        }
      });
  
      const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
      };
  
      const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown')) {
          isOpen.value = false;
        }
      };
      const selectOption = (option, index) => {
        selectedOption.value = option;
        emit('update:modelValue', index); 
        hideDropdown();
      }
      const hideDropdown = () => {
        isOpen.value = true;
      };

      onMounted(() => {
        document.addEventListener('click', handleClickOutside);
      });
  
      onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
      });
  
      return{
        isOpen,
        selectedOption,
        options,
        toggleDropdown,
        handleClickOutside,
        selectOption
      }
    }
  };
</script>
  
<style scoped>
/* 移动端优先样式 */
.dropdown {
  position: relative;
  display: block;
  width: 100%;
}

.dropbtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 0.8rem;
  padding: 5px 0;
  border: 1px solid rgba(0,130,65,1);
  border-radius: 5px;
  background-color: rgba(0,130,65,1);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.dropdown-content {
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background: white;
  display: flex;
  flex-direction: column;
}

.dropdown-content a {
  display: block;
  padding: 2px 0;
  text-align: center;
  text-decoration: none;
  font-size: 0.85rem;
  color: rgba(0,130,65,0.9);
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  line-height: 1.5;
  white-space: nowrap;
}

/* 动画修正 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: scaleY(0.95); /* 改为缩放动画 */
}

/* 桌面端适配 */
@media (min-width: 768px) {
  .dropdown {
    display: inline-block;
    width: auto;
    min-width: 200px;
  }

  .dropbtn {
    height: 40px;
    font-size: 1rem;
  }

  .dropdown-content {
    position: absolute;
    min-width: 200px;
  }
  
  .dropdown-content a {
    font-size: 0.95rem;
    padding: 10px 16px;
  }
}
</style>