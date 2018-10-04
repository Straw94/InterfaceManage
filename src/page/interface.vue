<template>
  <div class="interface">
  <el-container style="height: 500px; border: 1px solid #eee">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="selections()">
      <el-submenu :index="''+index" v-for="(item,index) in list" :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="routeTo(1,listItem)" :index="''+item + inx" v-for="(listItem,inx) in item.children" :key="inx">{{ listItem.name }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="1111111111" @click="routeTo(0)">
        <i class="el-icon-menu"></i>
        <span slot="title">接口管理</span>
      </el-menu-item>

    </el-menu>

  </el-aside>
    <el-container>
      <el-main>
        <router-view v-on:parentOnload="onload"></router-view>
      </el-main>
    </el-container>
</el-container>
  </div>
</template>

<script>
import dataes from '@/router/data'
import count from '@/router/count'
import interData from '@/router/interface'

export default {
  name: 'interface',
  data() {
  const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        list:[],
        activeNames: ['1'],
        tableData: Array(20).fill(item)
      };
    },
    methods: {
      selections(index){
        console.log(1)
        console.log(222)
      },
      handleChange(val) {
        console.log(val);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      routeTo(val,order){
        if(!val){
            this.$router.push({path:'/interface/manage'})
        }else{
          interData.set(order);
          this.$router.push({
              path:'/interface/list',
            })
        }
      },
      onload(){
          this.$http.get('/getData').then(res=>{
            this.list = count(res.data);
            dataes.set(this.list)
          }).catch(err=>{
            console.log(err)
          })
//          let data = {
//            asdf:1111,
//            b:2222,
//          }
//          this.$http.post('/recompose',data).then(res=>{
//            console.log(res)
//          }).catch(err=>{
//            console.log(err)
//          })
//
//          this.$http.get('/setData',{params:'jiangdongdong'}).then(res=>{
//          console.log(res);
//        }).catch(err=>{
//          console.log(err);
//        })
      }
    },
    mounted(){
      this.onload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.interface{
  width:90%;
  margin:0 auto;

}

</style>
<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
