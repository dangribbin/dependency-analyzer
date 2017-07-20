<template>
  <div id="app">
    <Sidebar v-bind:projects="projects"></Sidebar>
  </div>
</template>

<script>
// import './normalize.css'
import Sidebar from './Sidebar.vue'
import axios from 'axios';

export default {
  name: 'app',
  components: {Sidebar},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      projects: [{projectName: 'Dan'}]
    }
  },
  created() {
    axios.get(`http://localhost:3000/projects`)
    .then(response => {
      // JSON responses are automatically parsed.
      debugger
      this.projects = response.data
    });
  }
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
