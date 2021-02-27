<template> 
  <el-container>
    <el-main>
      <div>
        <div>
          <h3 style="text-align: center;">
            {{ article.title }}
          </h3>
        </div>
        <div style="width: 100%;margin-top: 5px;display: flex;justify-content: flex-end;align-items: center">
          <div style="display: inline; color: #20a0ff;margin-left: 50px;margin-right:20px;font-size: 12px;">
            {{ article.username }}
          </div>
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">
            {{ article.categoryName }}
          </span>
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">
            浏览 {{ article.pageView }}
          </span>
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">
            {{ article.updateTime | formatDateTime}}
          </span>
          <el-tag type="success"
                  v-for="(item,index) in article.tags"
                  :key="index"
                  size="small"
                  style="margin-left: 8px">
            {{item.name}}
          </el-tag>
          <span style="margin:0px 50px 0px 0px"></span>
        </div>
      </div>
      <div style="text-align: left;" v-html="article.context">
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { getArticle } from '@/api/article'

  import { formatDate } from '@/utils/date';

  const defaultArticle = {
    userId: null,
    categoryId: null,
    title: '',
    context: '',
    tags: [],
    pageView: null,
    updateTime: null,
    username: null,
    categoryName: null
  };

  export default {
    name: "articlePreview",
    data() {
      return {
        article: Object.assign({}, defaultArticle)
      };
    },
    created() {
      this.getArticle();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      getArticle() {
        getArticle(this.$route.query.id).then(result => {
          this.article = result.data;
        }).catch(() => {

        });
      }
    }
  }
</script>

<style scoped>

</style>
