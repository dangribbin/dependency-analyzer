<template>
  <div class="sidebar">
    <ul>
      <li v-for="commit in commits">
        <span>{{commit.authorTimestamp}} - {{commit.author.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Commits',
  mounted: () => {
    let url = `http://localhost:3000/projects/` + this.$route.query.projectID + '/repositories/'  + this.$route.query.repositoryID + '/commits';
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
