<template>
  <div>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown @command="handleDashBoard($event)">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu split-button slot="dropdown">
            <el-dropdown-item command="1">新增</el-dropdown-item>
            <el-dropdown-item command="2">修改</el-dropdown-item>
            <el-dropdown-item command="3">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>管理</span>
      </el-header>
    </el-container>
    <el-tree accordion :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    <!--模块-->
    <el-dialog :title="titles" :visible.sync="moduleShow" width="30%" :before-close="moduleClose">
      <el-form label-width="100px" :model="module" :rules="rules" ref="module">
        <el-form-item label="模块名称："  prop="name">
          <el-input v-model="module.name"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="moduleShow = false">取 消</el-button>
      <el-button type="primary" @click="setModule(1,'module')">确 定</el-button>
    </el-dialog>
    <!--分支-->
    <el-dialog :title="titles" :visible.sync="offsetShow" width="30%" :before-close="offsetClose">
      <el-form label-width="100px" :model="offset" :rules="rules" ref="offset">
        <el-form-item label="分支名称：" prop="name">
          <el-input v-model="offset.name"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="offsetShow = false">取 消</el-button>
      <el-button type="primary" @click="setModule(2,'offset')">确 定</el-button>
    </el-dialog>
    <!--接口-->
    <el-dialog :title="titles" :visible.sync="interShow" width="30%" :before-close="interClose">
      <el-form label-width="100px" :model="interfaces" :rules="rules" ref="interfaces">
        <el-form-item label="接口功能：" prop="name">
          <el-input v-model="interfaces.name"></el-input>
        </el-form-item>
        <el-form-item label="接口路径：" prop="url">
          <el-input v-model="interfaces.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式：">
          <el-radio-group v-model="interfaces.method">
            <el-radio :label=1>Get</el-radio>
            <el-radio :label=2>Post</el-radio>
            <el-radio :label=3>Delete</el-radio>
            <el-radio :label=4>Put</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求参数：" v-for="(item,index) in interfaces.param" :key="index">
          <el-col :span="10">
            <el-form-item>
              <el-input v-model="item.key" placeholder="key" :disabled="index+1 != interfaces.param.length"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="item.value" placeholder="value" :disabled="index+1 != interfaces.param.length"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">
            <i v-if="index+1 == interfaces.param.length" @click="addParam(index)" class="el-icon-circle-plus i-add"></i>
            <i v-else @click="delParam(index)" class="el-icon-circle-close i-add"></i>
          </el-col>
        </el-form-item>
        <el-form-item label="返回值：" prop="backData">
          <el-input type="textarea" :autosize="{ minRows: 2}" v-model="interfaces.backData"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="interShow = false">取 消</el-button>
      <el-button type="primary" @click="setModule(3,'interfaces')">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import dataes from '@/router/data'
  import count from '@/router/count'
  import delCount from '@/router/delCount'
  export default {
    data() {
      return {
        module:{
          parentId:0,
          rank:0,
          name:'',
        },
        offset:{
          parentId:null,
          rank:1,
          name:'',
        },
        interfaces:{
          method:1,
          parentId:null,
          rank:2,
          name:'',
          url:'',
          backData:'',
          param:[
            {key:'',value:''}
          ]
        },
        titles:'',
        moduleShow:false,
        offsetShow: false,
        interShow: false,
        selectId:null,
        data: [],
        defaultProps: {
          children: 'children',
          value:'_id',
          label: 'name'
        },
        rules: {
          name: [
            { required: true, message: '名称不为空', trigger: 'blur' },
          ],
          url: [
            { required: true, message: '路径不为空', trigger: 'blur' },
          ],
          backData:[
            { required: true, message: '返回值不为空', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      //选择分支
      handleNodeClick(data) {
        this.select = data;
      },
      //模块关闭
      moduleClose(done) {
        this.$confirm('确认关闭？').then(_ => {
            done();
          }).catch(_ => {});
      },
      //分支关闭
      offsetClose(done) {
        this.$confirm('确认关闭？').then(_ => {
            done();
          }).catch(_ => {});
      },
      //接口关闭
      interClose(done) {
        this.$confirm('确认关闭？').then(_ => {
            done();
          }).catch(_ => {});
      },
      //下拉选框触发
      handleDashBoard(val){
        if(!this.select && val != 1){
          this.$message('至少选择一个分支');
          return
        }
        // 1 新增 2 修改 3 删除
        if(val == 1) this.setShow()
        if(val == 2) this.recomposeShow()
        if(val == 3) this.deleteShow()
      },
      //重置表单
      resets(formname){
        console.log();
        this.$nextTick(()=>{
          this.$refs[formname].resetFields();
        })
      },
      //新增弹出框
      setShow(){
        if(!this.select){
          this.titles = '新增模块';
          this.resets('module')
          this.moduleShow = true;
          return ;
        }
        if(this.select.rank == 0){
          this.titles = '新增分支';
          this.resets('offset')
          this.offsetShow = true;
        }
        if(this.select.rank == 1){
          this.titles = '新增接口';
          this.resets('interfaces')
          this.interShow = true;
        }
        if(this.select.rank == 2){
          this.$message({
            type: 'info',
            message: '接口不可以增加子集'
          });
          return
        }
      },
      //修改弹出框
      recomposeShow(){
        if(!this.select){
          this.$message({
            type: 'info',
            message: '选中项为空！'
          });
          return
        }
        this.$http.get('/findData',{params:{'_id':this.select._id}}).then(res=>{
          if(this.select.rank == 0){
            this.titles = '修改模块';
            this.moduleShow = true;
            this.module = res.data[0];
          }
          if(this.select.rank == 1){
            this.titles = '修改分支';
            this.offsetShow = true;
            this.offset = res.data[0];
          }
          if(this.select.rank == 2){
            this.titles = '修改接口';
            this.interShow = true;
            this.interfaces = res.data[0];
          }
        }).catch(err=>{
          this.$message({
            type:'error',
            message:'数据查询失败请稍候重试！'
          })
          console.log(err);
        })
      },
      //删除弹出框
      deleteShow(){
        this.$confirm('此操作将永久删除<<'+this.select.name+'>>分支, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let list = JSON.stringify(delCount(this.select,0))
          this.$http.get('/delete',{params:{list}}).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.resetData();
          }).catch(error=>{
            this.$message({
              type: 'info',
              message: '删除失败，请刷新后重试！'
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加模块
      setModule(val,formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.titles.indexOf('新'));
            if(this.titles.indexOf('新') > -1){
                if(val == 1){
                  this.$http.get('/setData',{params:{param:this.module}}).then(res=>{
                    this.moduleShow = false;
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                    this.resetData();
                  }).catch(err=>{
                    this.$message({
                      type:'error',
                      message:'添加数据失败请稍候重试！'
                    })
                    console.log(err);
                  })
                }
                if(val == 2){
                  console.log(this.select._id);
                  this.offset.parentId = this.select._id;
                  this.$http.get('/setData',{params:{param:this.offset}}).then(res=>{
                    this.offsetShow = false;
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                    this.resetData();
                  }).catch(err=>{
                    this.$message({
                      type:'error',
                      message:'添加数据失败请稍候重试！'
                    })
                    console.log(err);
                  })
                }
                if(val == 3){
                this.interfaces.parentId = this.select._id;
                this.$http.get('/setData',{params:{param:this.interfaces}}).then(res=>{
                  this.interShow = false;
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.resetData();
                }).catch(err=>{
                  this.$message({
                    type:'error',
                    message:'添加数据失败请稍候重试！'
                  })
                  console.log(err);
                })
              }
            }else{
              if(val == 1){
                this.$http.post('/recompose',this.module).then(res=>{
                  this.moduleShow = false;
                  this.$message({
                    type: 'success',
                    message: '修改模块成功!'
                  });
                  this.resetData();
                }).catch(err=>{
                  this.$message({
                    type:'error',
                    message:'修改模块数据失败请稍候重试！'
                  })
                  console.log(err);
                })
              }
              if(val == 2){
                this.$http.post('/recompose',this.offset).then(res=>{
                  this.offsetShow = false;
                  this.$message({
                    type: 'success',
                    message: '修改分支成功!'
                  });
                  this.resetData();
                }).catch(err=>{
                  this.$message({
                    type:'error',
                    message:'修改分支失败请稍候重试！'
                  })
                  console.log(err);
                })
              }
              if(val == 3){
//                this.interfaces.param =
                this.$http.post('/recompose',this.interfaces).then(res=>{
                  this.interShow = false;
                  this.$message({
                    type: 'success',
                    message: '修改接口成功!'
                  });
                  this.resetData();
                }).catch(err=>{
                  this.$message({
                    type:'error',
                    message:'修改接口失败请稍候重试！'
                  })
                  console.log(err);
                })
              }
            }

          } else {
            this.$message({
              type:'error',
              message:'请完善相关信息!!！不要乱点！！！！！'
            })
          }
        });


      },
      //转换字符串
      typeChange(data){
        return JSON.stringify(data);
      },
      //增加参数
      addParam(index){
        console.log(index);
        let inter = this.interfaces.param[index];
        if(inter.key != '' && inter.value != ''){
          this.interfaces.param.push({
            key:'',
            value:'',
          })
        }else{
          this.$message('请完善当前信息！')
        }
      },
      //删除参数
      delParam(index){
        console.log(index);
        this.interfaces.param.splice(index,1)
      },
      onload(val=0){
        if(dataes.get() && val == 0){
          this.data = dataes.get();
        }else{
          this.$http.get('/getData').then(res=>{
            this.data = count(res.data);
            dataes.set(this.data)
          }).catch(err=>{
            console.log(err)
          })
        }
      },
      resetData(){
        this.$emit('parentOnload');
        this.onload(1)
      }
    },
    mounted(){
      this.onload();
    }
  };
</script>
<style>
  .i-add{
    font-size:18px;margin-left:5px;color:#dcdfe6
  }
  .input-public{
    margin-bottom:20px !important;
  }
</style>

