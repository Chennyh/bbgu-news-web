<template> 
  <article-edit :is-edit="false"></article-edit>
</template>

<script>
  import ArticleEdit from "../../article/edit/components/edit";

  export default {
    name: 'addArticle',
    components: { ArticleEdit }
  }
</script>

<style scoped>

</style>
