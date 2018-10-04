<style>
  .table-out{
    width:100%;
    text-align:center;
    margin:0 auto;
  }
</style>
<template>
  <div>

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="item.name" v-for="(item,index) in list" :key="index" :name="index">
        <!--<div>{{list}}</div>-->
        <div class="table-out">
        </div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>接口信息</span>
          </div>
          <div class="text item">
            Url:{{item.url}}
          </div>
          <div class="text item">
            Method: {{ method(item.method) }}
          </div>
          <div class="text item">
            Backdata:
            <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              v-model="item.backData" :disabled="true">
            </el-input>
          </div>
          <el-table
            :data="item.param"
            style="margin:0 auto;width:360px;">
            <el-table-column
              prop="key"
              label="KEY"
              width="180">
            </el-table-column>
            <el-table-column
              prop="value"
              label="VALUE"
              width="180">
            </el-table-column>
          </el-table>
        </el-card>
      </el-collapse-item>

    </el-collapse>
  </div>
</template>
<script>
  import interData from '@/router/interface'
  export default {
    name: 'interface',
    data() {
      return{
        activeNames: [],
        list:[],
      }
    },
    methods:{
      method(val){
        if(val == 1){
          return "GET"
        }else if(val == 2){
          return "POST"
        }else if(val == 3){
          return 'DELETE'
        }else{
          return 'PUT'
        }
      },
      handleChange(val) {
        console.log(val);
      },
    },
    mounted(){
      if(interData.get()){
        this.list = interData.get().children;
      }else{
        this.$router.push({path:'/'})
      }
    }
  }
</script>
