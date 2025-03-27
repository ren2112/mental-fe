import { createRouter, createWebHistory } from 'vue-router'
import FirstPage from '@/views/FirstPage.vue'
import Header from '@/views/Header.vue'
//import { title } from 'process';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: FirstPage,
    },
    {
      path: '/login',
      name:'login',
      component: () => import('../views/Login.vue'),
      meta:{requiresAuth:false, title:'登录'},
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue'),
      meta:{requiresAuth:false, title:'注册'}
    },
    {
      path: '/',
      component: Header,
      children:[
        {
          path:'index',
          component:()=> import('../views/Index.vue'),
          meta:{requiresAuth:false, title:'首页'}
        },
        {
          path:'post',
          component:()=> import('../views/Post.vue'),
          meta:{requiresAuth:true , title:'发个帖子'},
        },
        {
          path:'txt-img-post',
          component:()=>import('../views/txt-img-post.vue'),
          meta:{requiresAuth:true, title:'发个帖子'}
        },
        {
          path:'message',
          component:()=> import('../views/Message.vue'),
          meta:{requiresAuth:false}
        },
        {
          path: 'content',
          name:'content',
          component: () => import('../views/Content.vue'),
          meta:{requiresAuth:false, title:'帖子详情'}
        },
        {
          path:'my-home-page',
          name:'my-home-page',
          component:()=> import('../views/MyHomePage.vue'),
          meta:{requiresAuth:false, title:'个人主页'}
        },
        {
          path:'edit',
          component:()=> import('../views/Edit.vue'),
          meta:{requiresAuth:true, title:'编辑信息'}
        },
        {
          name:'edit-txt-img-post',
          path:'edit-txt-img-post',
          component:()=>import('../views/Edit-txt-img-post.vue'),
          meta:{requiresAuth:true, title:'修改贴子'}
        },
        {
          name:'edit-video-post',
          path:'edit-video-post',
          component:()=>import('../views/Edit-video-post.vue'),
          meta:{requiresAuth:true, title:'修改贴子'}
        },
        {
          path:'manage',
          component:()=> import('../views/manage/Manage.vue'),
          meta:{requiresAuth:true, title:'管理'},
          children:[
            {
              path:'',
              component:()=> import('../views/manage/UserManage.vue'),
              meta:{requiresAuth:true}
            },
            {
              path:'user-manage',
              component:()=> import('../views/manage/UserManage.vue'),
              meta:{requiresAuth:true, title:'用户管理'}
            },
            {
              path:'post-check',
              component:()=> import('../views/manage/PostCheck.vue'),
              meta:{requiresAuth:true, title:'帖子审核'}
            },
            {
              path:'post-modify',
              component:()=> import('../views/manage/PostModify.vue'),
              meta:{requiresAuth:true, title:'删除帖子'}
            },
            {
              path:'post-del-record',
              component:()=> import('../views/manage/DelRecord.vue'),
              meta:{requiresAuth:true, title:'删帖记录'}
            }
          ]
        },
      ]
    },
    {
      path: '/mob',
      children:[
        {
          path:'beginning',
          component:()=>import('../views/moble/beginningPage.vue'),
          meta:{requiresAuth:false, title:'欢迎访问'}
        },
        {
          path:'login',
          component:()=>import('../views/moble/loginPage.vue'),
          meta:{requiresAuth:false, title:'登录'}
        },
        {
          path:'register',
          component:()=>import('../views/moble/registerPage.vue'),
          meta:{requiresAuth:false, title:'注册'}
        },
        {
          path:'videoPost',
          component:()=>import('../views/moble/videoPostPage.vue'),
          meta:{requiresAuth:true, title:'视频贴子发布'}
        },
        {
          path:'txtimgPost',
          component:()=>import('../views/moble/txtimgPostPage.vue'),
          meta:{requiresAuth:true, title:'图文贴子发布'}
        },
        {
          path:'index',
          component:()=> import('../views/moble/index.vue'),
          meta:{requiresAuth:false, title:'首页'}
        },
        {
          path:'my-home-page',
          component:()=> import('../views/moble/myHomePage.vue'),
          meta:{requiresAuth:true, title:'个人主页'}
        },
        {
          path:'edit',
          component:()=> import('../views/moble/edit.vue'),
          meta:{requiresAuth:false, title:'编辑个人信息'}
        },
        {
          path: 'content',
          component: () => import('../views/moble/Content.vue'),
          meta:{requiresAuth:false, title:'帖子详情'}
        },
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach(async(to, from, next) => {
  const {useAuthStore} = await import('@/stores/auth');
  const authstore = useAuthStore();

  // 判断当前是否移动端路由
  const isMobileRoute = to.path.startsWith('/mob');
  // 获取正确的登录页路径
  const loginPath = isMobileRoute ? '/mob/login' : '/login';

  // 判断是否需要登录
  if (to.meta.requiresAuth && !authstore.token) {
    // 未登录，跳转到登录页
    next({ path: loginPath});
  } else {
    // 已登录或不需要登录
    next();
  }
});

//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
router.afterEach((to, from) => {
  document.title = to.meta.title as string || '高新区团系统工作平台' //修改网页的title
})

export default router
