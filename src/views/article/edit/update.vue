<template> 
  <article-edit :is-edit="true"></article-edit>
</template>

<script>
  import ArticleEdit from "../../article/edit/components/edit";

  export default {
    name: 'updateArticle',
    components: { ArticleEdit }
  }
</script>

<style scoped>

</style>
