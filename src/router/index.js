import Vue from 'vue'
import Router from 'vue-router'
import interfaces from '@/page/interface'
import interfaceManage from '@/page/interfaceManage'
import interfaceList from '@/page/interfaceList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'interfaces',
      component: interfaces,
      children:[
        {
          path:'/interface/manage',
          name:'interfaceManage',
          component:interfaceManage
        },
        {
          path:'/interface/list',
          name:'interfaceList',
          component:interfaceList
        }
      ]
    },

  ]
})
