<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" placeholder="文章标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="发表用户：">
            <el-select v-model="listQuery.userId" placeholder="请选择用户" clearable>
              <el-option
                v-for="user in userOptions"
                :key="user.id"
                :label="user.username"
                :value="user.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发表类别：">
            <el-select v-model="listQuery.categoryId" placeholder="请选择类别" clearable>
              <el-option
                v-for="category in categoryOptions"
                :key="category.id"
                :label="category.name"
                :value="category.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章状态：">
            <el-select v-model="listQuery.stat" placeholder="请选择状态" clearable>
              <el-option
                v-for="item in statOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="articleTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="文章标题" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleArticlePreview(scope.$index, scope.row)">{{scope.row.title}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" width="80" align="center">
          <template slot-scope="scope">{{scope.row.pageView}}</template>
        </el-table-column>
        <el-table-column label="文章类别" width="120" align="center">
          <template slot-scope="scope">
            <template v-for="category in categoryOptions">
              <template v-if="category.id===scope.row.categoryId">
                {{ category.name }}
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="发布用户" width="100" align="center">
          <template slot-scope="scope">
            <template v-for="user in userOptions">
              <template v-if="user.id===scope.row.userId">
                {{ user.username }}
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="文章状态" width="100" align="center">
            <template slot-scope="scope" @>{{ scope.row.stat | StatFilter}}</template>
        </el-table-column>
        <el-table-column label="开启评论" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleReviewChange(scope.$index, scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.review">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini"
                         type="text"
                         @click="handleAttrEditDialog(scope.$index, scope.row)">修改属性
              </el-button>
              <el-button size="mini"
                         type="text"
                         @click="handleUpdate(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini"
                         type="text"
                         @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="修改属性"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="articleAttributes"
               ref="userForm"
               label-width="150px" size="small">
        <el-form-item label="发表类别：">
          <el-select v-model="articleAttributes.categoryId">
            <el-option
              v-for="category in categoryOptions"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布用户：">
          <el-select v-model="articleAttributes.userId">
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.username"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章状态：">
          <el-select v-model="articleAttributes.stat">
            <el-option
              v-for="item in statOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改属性"
      :visible.sync="dialogBatch"
      width="40%">
      <el-form :model="articleAttributes"
               ref="batchForm"
               label-width="150px" size="small">
        <el-form-item label="发表类别：" v-show="dialogCategoryShow">
          <el-select v-model="articleAttributes.categoryId">
            <el-option
              v-for="category in categoryOptions"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布用户：" v-show="dialogUserShow">
          <el-select v-model="articleAttributes.userId">
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.username"
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBatch = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleBatchDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchList,
    deleteArticle,
    updateReview,
    updateAttributes,
    batchUpdateReview,
    batchDeleteArticle,
    batchUpdateStat,
    batchUpdateCategory,
    batchUpdateUser
  } from '@/api/article'
  import { fetchAllCategoryList } from '@/api/category'
  import { fetchUAllUserList } from '@/api/login'

  import { formatDate } from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    keyword: null,
    userId: null,
    categoryId: null,
    stat: null
  };

  const defaultAttributes = {
    id: null,
    userId: null,
    categoryId: null,
    stat: null
  };

  const defaultStatOptions = [
    {
      value: 0,
      label: '草稿箱'
    },
    {
      value: 1,
      label: '已发表'
    },
    {
      value: 2,
      label: '回收站'
    }
  ];

  const defaultOperates = [
    {
      value: "commentsOn",
      label: '开启评论'
    },
    {
      value: "commentsOff",
      label: '关闭评论'
    },
    {
      value: "deleteArticle",
      label: '删除文章'
    },
    {
      value: "changeCategory",
      label: '修改类别'
    },
    {
      value: "changeUser",
      label: '修改用户'
    },
    {
      value: "draft",
      label: '移到草稿箱'
    },
    {
      value: "published",
      label: '移到已发表'
    },
    {
      value: "recycle",
      label: '移到回收站'
    }
  ];

  export default {
    name: "articleList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        operateType: null,
        operates: Object.assign({}, defaultOperates),
        userOptions: [],
        categoryOptions: [],
        statOptions: Object.assign({}, defaultStatOptions),
        multipleSelection: [],
        dialogVisible: false,
        articleAttributes: Object.assign({}, defaultAttributes),
        dialogBatch: false,
        dialogCategoryShow: false,
        dialogUserShow: false,
        tempIds: null
      };
    },
    created() {
      this.getList();
      this.getUserList();
      this.getCategoryList();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      StatFilter(value) {
        for (let defaultStatOption of defaultStatOptions) {
          if (defaultStatOption.value === value) {
            return defaultStatOption.label;
          }
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        }).catch(() => {
          this.listLoading = false;
          this.list = null;
          this.total = null;
        });
      },
      getUserList() {
        fetchUAllUserList().then(result => {
          this.userOptions = result.data;
        }).catch(() => {

        });
      },
      getCategoryList() {
        fetchAllCategoryList().then(result => {
          this.categoryOptions = result.data;
        }).catch(() => {

        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleAddProduct() {
        this.$router.push({path:'/article/add'});
      },
      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return false;
        }
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的文章',
            type: 'warning',
            duration: 1000
          });
          return false;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.batchUpdateReview(true, ids);
              break;
            case this.operates[1].value:
              this.batchUpdateReview(false, ids);
              break;
            case this.operates[2].value:
              this.batchDeleteArticle(ids);
              break;
            case this.operates[3].value:
              this.dialogBatch = true;
              this.dialogCategoryShow = true;
              this.dialogUserShow = false;
              this.articleAttributes.categoryId = null;
              this.tempIds = ids;
              break;
            case this.operates[4].value:
              this.dialogBatch = true;
              this.dialogCategoryShow = false;
              this.dialogUserShow = true;
              this.articleAttributes.userId = null;
              this.tempIds = ids;
              break;
            case this.operates[5].value:
              this.batchUpdateStat(0, ids);
              break;
            case this.operates[6].value:
              this.batchUpdateStat(1, ids);
              break;
            case this.operates[7].value:
              this.batchUpdateStat(2, ids);
              break;
          }
        }).catch(() => {

        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleReviewChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReview(row.id, {review: row.review}).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }).catch(() => {

          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/article/update',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(row.id).then(result => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          }).catch(() => {

          });

        }).catch(() => {

        });
      },
      handleArticlePreview(index, row) {
        this.$router.push({path:'/article/preview',query:{id:row.id}});
      },
      handleAttrEditDialog(index, row) {
        this.dialogVisible = true;
        this.articleAttributes.id = row.id;
        this.articleAttributes.userId = row.userId;
        this.articleAttributes.categoryId = row.categoryId;
        this.articleAttributes.stat = row.stat;
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateAttributes(this.articleAttributes.id, this.articleAttributes).then(result => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          }).catch(() => {

          });
        }).catch(() => {

        });
      },
      handleBatchDialogConfirm() {
        if (this.dialogCategoryShow) {
          this.batchUpdateCategory(this.articleAttributes.categoryId, this.tempIds);
        }else if (this.dialogUserShow) {
          this.batchUpdateUser(this.articleAttributes.userId, this.tempIds);
        }
        this.dialogBatch = false;
        this.dialogCategoryShow = false;
        this.dialogUserShow = false;
        this.tempIds = null;
      },
      batchUpdateReview(reviewStatus, ids) {
        let data = {
          "review": reviewStatus,
          "ids": ids
        };
        batchUpdateReview(data).then(result => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        }).catch(() => {

        });
      },
      batchDeleteArticle(ids) {
        let data = {
          "ids": ids
        };
        batchDeleteArticle(data).then(result => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        }).catch(() => {

        });
      },
      batchUpdateCategory(categoryId, ids) {
        let data = {
          "categoryId": categoryId,
          "ids": ids
        };
        batchUpdateCategory(data).then(result => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        }).catch(() => {

        });
      },
      batchUpdateUser(userId, ids) {
        let data = {
          "userId": userId,
          "ids": ids
        };
        batchUpdateUser(data).then(result => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        }).catch(() => {

        });
      },
      batchUpdateStat(statId, ids) {
        let data = {
          "stat": statId,
          "ids": ids
        };
        batchUpdateStat(data).then(result => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        }).catch(() => {

        });
      }
    }
  }
</script>

<style scoped>

</style>
