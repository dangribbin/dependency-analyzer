<template>
  <div class="sidebar">
    <a v-for="project in projects" :href="'/repos/' + project.projectName + '/'">{{project.projectName}}</a>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: ['projects']
}
</script>

<style>
.sidebar {
  background: #EEE;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 20px 15px;
}

li {
  padding: 5px 0;
}
</style>
