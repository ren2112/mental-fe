<template>
    <div class="dropdown" @mouseenter="showDropdown" @mouseleave="hideDropdown">
      <button class="dropbtn">{{ selectedOption }}</button>
      <div v-if="isOpen" class="dropdown-content">
        <a href="#" v-for="(option,index) in options" :key="option" @click.prevent="selectOption(option,index)">
          {{ option }}
        </a>
      </div>
    </div>
</template>
  
<script>
import { ref,watch } from 'vue';
  
export default {
    name: 'Dropdown',
    props: {
      // 可选：支持传入初始选中值
      defaultSelected: {
        type: Number,
        default: -1, // 表示未选中任何选项
      },
    },
    emits: ['update:selectedIndex'], // 自定义事件，用于向父组件传递选中的索引值
    setup(props,{emit}) {
      const isOpen = ref(false);
      const options = ref(['理 论 学 习', '走 进 高 新', '青 年 活 动','青 年 夜 校','志 愿 服 务','社 会 实 践']);
      const selectedOption = ref(
        props.defaultSelected >= 0 
          ? options.value[props.defaultSelected] 
          : '请选择活动类型：'
      )
      // 添加watch监听props变化
      watch(() => props.defaultSelected, (newVal) => {
        if (newVal >= 0 && newVal < options.value.length) {
          selectedOption.value = options.value[newVal];
        }
      });
  
      const showDropdown = () => {
        isOpen.value = true;
      };
  
      const hideDropdown = () => {
        isOpen.value = false;
      };
  
      const selectOption = (option, index) => {
        selectedOption.value = option
        emit('update:selectedIndex', index)
        hideDropdown()
      }
  
      return {
        isOpen,
        selectedOption,
        options,
        showDropdown,
        hideDropdown,
        selectOption,
      };
    },
  };
</script>
  
<style scoped>
.dropdown {
    position: relative;
    display: inline-block;
    margin-bottom: 5px;
}
  
.dropbtn {
    min-width: 150px;
    background-color: white;
    color: rgba(0,130,65,1);
    padding: 7px;
    font-size: 16px;
    border: 1px solid rgba(0,130,65,1);
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.dropbtn:hover{
    background-color: rgba(0,130,65,1);
    color: white;
}
  
.dropdown-content {
    display: block;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 140px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}
  
.dropdown-content a {
    color: white;
    background-color: rgba(0,130,65,0.7);
    padding: 10px 5px;
    text-decoration: none;
    display: block;
}
  
.dropdown-content a:hover {
    background-color: rgba(0,130,65,1);
}
</style>
  