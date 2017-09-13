<template>
  <div class="sidebar">
    <ul>
      <li v-for="(file, index) in dependencies">
        <span>{{index +1}}</span>
      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Dependencies',
  data () {
    return {
      loading: false,
      dependencies: null,
      error: null
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true;
      let url = 'http://localhost:3005/projects/' + this.$route.params.projectKey + '/repositories/' + this.$route.params.repositorySlug + '/dependencies';
      axios.get(url).then(response => {
        this.dependencies = response.data.values;
        this.loading = false;
      }).catch(function (err) {
        this.loading = false;
        this.error = err.toString();
      });
    }
  },
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
