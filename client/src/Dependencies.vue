<template>
  <div class="sidebar">
    <ul>
      <li v-for="dependency in dependencies">
        <span>{{dependency.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Dependencies',
  mounted: () => {
    let url = `http://localhost:3000/projects/` + this.$route.query.projectID + '/repositories/'  + this.$route.query.repositoryID + '/dependencies';
    axios.get(url).then(function(data) {
        this.commits = data;
    });
  }
}

</script>

<style>
.sidebar {

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
