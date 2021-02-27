<template>
  <div class="app-container">
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">文章总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ articleData.published }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ articleData.draft }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ articleData.pageView }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ articleData.total }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已发表</el-col>
                <el-col :span="6" class="overview-item-title">草稿箱</el-col>
                <el-col :span="6" class="overview-item-title">总浏览量</el-col>
                <el-col :span="6" class="overview-item-title">全部文章</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ userData.user }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ userData.admin }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ userData.wxUser }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ userData.total }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">普通用户</el-col>
                <el-col :span="6" class="overview-item-title">超级用户</el-col>
                <el-col :span="6" class="overview-item-title">微信用户</el-col>
                <el-col :span="6" class="overview-item-title">总用户量</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { articleCount } from '@/api/article'
  import { userCount } from '@/api/login'

  export default {
    name: 'home',
    data() {
      return {
        articleData: null,
        userData: null
      }
    },
    created(){
      this.getData()
    },
    methods:{
      getData() {
        articleCount().then(result => {
          this.articleData = result.data
        }).catch(() => {})
        userCount().then(result => {
          this.userData = result.data
        }).catch(() => {})
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }
</style>
