<template>
  <div v-if="error" class="error">
    {{ error }}
  </div>
  <div v-else-if="!error" class="projects">
    <ul>
      <li v-for="project in projects">
        <router-link :to=" 'projects/' + project.key + '/repositories'">{{project.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
export default {
  name: 'Projects',
  data () {
    return {
      loading: false,
      projects: null,
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
      this.loading = true

      axios.get(`http://localhost:3000/projects/`).then(response => {
        this.projects = response.data.values;
        this.loading = false;
      }).catch(function (err) {
        this.loading = false;
        this.error = err.toString();
      });
    }
  }
}
</script>

<style>
.projects {

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
