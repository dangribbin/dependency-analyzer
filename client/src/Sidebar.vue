<template>
  <div class="sidebar">
    <ul>
      <li v-for="project in projects">
        <a :href="'/repos/' + project.name + '/'">{{project.name}}</a>
      </li>
    </ul>
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
