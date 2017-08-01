<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import './normalize.css'
import Projects from './Projects.vue';
import Repositories from './Repositories.vue';
import axios from 'axios';
import Home from './Home.vue';
// import Projects from './Projects';
// import api from './api/index.js'

export default {
  name: 'app',
  components: {Projects, Repositories},
  // data () {
  //   return {
  //     projects: [],
  //     repositories: [],
  //     commits: []
  //   }
  // },
  // created() {
  //   axios.get(`http://localhost:3000/projects/`)
  //   .then(response => {
  //     this.projects = response.data.values;
  //     axios.get(`http://localhost:3000/repositories/`).then(reposResponse => {
  //       this.repositories = reposResponse.data.values
  //     })
  //   }).catch(function (err) {
  //     debugger
  //   });
  // }
}
</script>

<style>
body {
  font-family: sans-serif;
  margin: 20px;
}

.wrapper {
  display: flex;
}

.content {
  margin-left: 20px;
}

.sidebar, .content {

}

td {
  padding: 5px 25px 5px 0px;
  text-align: left;
}

th {
  padding: 15px 25px 15px 0;
  text-align: left
}
</style>
