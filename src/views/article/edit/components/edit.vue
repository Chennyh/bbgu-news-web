<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
      </div>
      <div class="header" style="margin-top: 15px">
        <el-select v-model="article.categoryId" placeholder="请选择文章类别" style="width: 150px;" clearable>
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="article.title" placeholder="请输入标题" style="width: 400px;margin-left: 10px" clearable></el-input>
        <el-tag
          :key="index"
          v-for="(tag, index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)" style="margin-left: 10px; margin-top: 5px;">
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="tagInputVisible"
          v-model="tagValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput" style="margin-left: 5px">+Tag</el-button>
      </div>
    </el-card>
    <div class="main">
      <div id="editor">
        <mavon-editor
          style="height: 100%;width: 100%;"
          ref="md"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
          v-model="article.mdContext"></mavon-editor>
      </div>
      <div style="display: flex;align-items: center;margin-top: 15px;justify-content: flex-end">
        <el-checkbox style="margin-right: 15px;" v-model="article.review" >开启评论</el-checkbox>
        <template v-if="!edit">
          <el-button @click="saveArticle(0)">保存到草稿箱</el-button>
          <el-button type="primary" @click="saveArticle(1)">发表文章</el-button>
        </template>
        <template v-else>
          <el-button @click="cancelEdit">放弃修改</el-button>
          <el-button type="primary" @click="saveArticle(article.stat)">保存修改</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchAllCategoryList } from '@/api/category'
  import { createArticle, updateArticle, uploadImg, deleteImg, getArticle } from '@/api/article'
  import { isNotNullORBlank } from "@/utils/validate";

  import store from '@/store'
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'

  const defaultTag= {
    name: null
  }

  const defaultArticle = {
    id: null,
    userId: null,
    categoryId: '',
    title: '',
    mdContext: '',
    context: '',
    stat: 0,
    review: true,
    tags: []
  };

  export default {
    name: "articleEdit",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        categories: [],
        tagInputVisible: false,
        tagValue: '',
        edit: this.isEdit,
        hasEditCreated: false,
        article: Object.assign({}, defaultArticle),
        dynamicTags: []
      };
    },
    created() {
      this.getCategories();
      if (this.isEdit) {
        getArticle(this.$route.query.id).then(result => {
          this.article = result.data;
          for (let i = 0; i < this.article.tags.length; i++) {
            this.dynamicTags.push(this.article.tags[i].name);
          }
        }).catch(() => {

        });
      }
    },
    components: {
      mavonEditor
    },
    methods: {
      getCategories() {
        fetchAllCategoryList().then(result => {
          this.categories = result.data;
        })
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.tagInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let tagValue = this.tagValue;
        if (tagValue) {
          this.dynamicTags.push(tagValue);
        }
        this.tagInputVisible = false;
        this.tagValue = '';
      },
      imgAdd(pos, $file) {
        //将图片上传到服务器.
        let formData = new FormData();
        formData.append("image", $file);
        uploadImg(formData).then(result => {
          //将返回的url替换到文本原位置![...](0) -> ![...](url)
          this.$refs.md.$img2Url(pos, result.data);
        });
      },
      imgDel(pos){
        let imageName=pos[0].split("/")
        deleteImg(imageName[imageName.length - 1]);
      },
      cancelEdit() {
        this.$router.go(-1)
      },
      saveArticle(state) {
        this.$confirm('是否要提交文章', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.article.userId = store.getters.id;
          this.article.context = this.$refs.md.d_render;
          this.article.stat = state;
          if (this.dynamicTags.length > 0) {
            this.article.tags = [];
            for (let i = 0; i < this.dynamicTags.length; i++) {
              let tag = Object.assign({}, defaultTag);
              tag.name = this.dynamicTags[i];
              this.article.tags.push(tag);
            }
          }
          if (!isNotNullORBlank(this.article.title, this.article.mdContext, this.article.categoryId)) {
            this.$message({
              type: 'error',
              message: '数据不能为空!'});
            return false;
          }
          if (this.isEdit) {
            updateArticle(this.$route.query.id, this.article).then(result => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
            });
          } else {
            createArticle(this.article).then(result => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 1000
              });
              this.$router.push({path:'/article/news'});
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  }
</script>

<style scoped>
  .header{
    margin-top: 10px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }

  .header > .button-new-tag {
    margin-left: 10px;
    margin-top: 5px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .header > .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-top: 5px;
    vertical-align: bottom;
  }

  .main{
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    padding-top: 0px;
  }

  .main > #editor{
    width: 100%;
    height: 600px;
    text-align: left;
  }

</style>
