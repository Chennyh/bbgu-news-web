import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  }
]

export const asyncRouterMap = [
  {
    path:'/article',
    component: Layout,
    redirect: '/article/news',
    name: 'article',
    meta: {title: '文章', icon: 'article'},
    children: [
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/article/news/index'),
        meta: {title: '文章列表', icon: 'news'}
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/article/edit/add'),
        meta: {title: '发表文章', icon: 'edit'}
      },
      {
        path: 'update',
        name: 'update',
        component: () => import('@/views/article/edit/update'),
        meta: {title: '编辑文章'},
        hidden: true
      },
      {
        path: 'preview',
        name: 'preview',
        component: () => import('@/views/article/preview/index'),
        meta: {title: '预览文章'},
        hidden: true
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/article/category/index'),
        meta: {title: '文章类别', icon: 'category'}
      },
      // {
      //   path: 'comments',
      //   name: 'comments',
      //   component: () => import('@/views/article/comments/index'),
      //   meta: {title: '文章评论', icon: 'comments'}
      // }
    ]
  },
  {
    path:'/ums',
    component: Layout,
    redirect: '/ums/user',
    name: 'ums',
    meta: {title: '权限', icon: 'ums'},
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/ums/user/index'),
        meta: {title: '用户列表', icon: 'ums-user'}
      },
      {
        path: 'wxuser',
        name: 'wxuser',
        component: () => import('@/views/ums/wxuser/index'),
        meta: {title: '微信用户', icon: 'user'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: {title: '角色列表', icon: 'ums-role'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

