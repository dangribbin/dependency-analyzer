<template>
  <div v-if="error" class="error">
    {{ error }}
  </div>
  <div v-else-if="!error && !loading" class="projects-page">
    <h2>Projects</h2>
    <div class="projects-content">
      <div class="left">
        <table>
          <tr v-for="project in projects">
            <td>
              <router-link :to=" '/projects/' + project.key + '/repositories'">{{project.name}}</router-link>
            </td>
          </tr>
        </table>
      </div>
      <div class="right stats">
        <div class="stat">
          <h1>{{projects.length}}</h1>
          <span>Projects in this Stash account</span>
        </div>
      </div>
    </div>
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
    // fetch the data when the view is created and the data is already being observed
    if (!this.$root.projects) {
      this.fetchData()
    }
    else {
      this.projects = this.$root.projects;
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      axios.get(`http://localhost:3005/projects/`).then(response => {
        this.projects = response.data.values;
        this.$root.projects = response.data.values;
        this.loading = false;
      }).catch(function (err) {
        this.loading = false;
        this.error = err.toString();
      });
    }
  }
}
</script>

<style lang="stylus">


</style>
