// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import './style.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// import 'element-plus/dist/index.css';
import './assets/css/element.scss' 
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 修改分页器默认文字
zhCn.el.pagination.total = '共 `{total} 条`';
zhCn.el.pagination.goto = '跳至';
zhCn.el.pagination.pagesize = '条/页';
zhCn.el.pagination.pageClassifier = '页';



const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router)
app.use(ElementPlus, { locale: zhCn }).mount('#app');