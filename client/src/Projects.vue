<template>
  <div v-if="error" class="error">
    {{ error }}
  </div>
  <div v-else-if="!error && !loading" class="projects-page">
    <div class="left">
      <h2>Projects</h2>
      <ul>
        <li v-for="project in projects">
          <router-link :to=" '/projects/' + project.key + '/repositories'">{{project.name}}</router-link>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="stat">
        <h1>{{projects.length}}</h1>
        <span>Projects in this Stash account</span>
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
    // fetch the data when the view is created and the data is
    // already being observed
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

      axios.get(`http://localhost:3000/projects/`).then(response => {
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

.projects-page
  margin 20px
  display flex
  flex-direction row

  .right
    align-items center

  .stat
    text-align center
    h1
      font-size 55px
      margin-bottom 0

ul
  list-style-type: none;
  margin: 0;
  padding: 0 15px;

li
  padding: 5px 0;

</style>
