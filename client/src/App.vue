<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  import Projects from './Projects.vue';
  import Repositories from './Repositories.vue';
  import axios from 'axios';
  import Home from './Home.vue';
  import * as d3 from 'd3';

  export default {
    name: 'app',
    components: {Projects, Repositories},
    created() {
      this.$root.projects = null;
      this.$root.repos = {};
    }
  }

</script>

<style lang="stylus">
  body
    font-family Avenir, Open Sans, Helvetica, sans-serif
    color #000
    margin: 20px;


  a
    color #000

  .wrapper
    display: flex;


  .content
    margin-left: 20px;


  .sidebar, .content

  td
    padding: 5px 25px 5px 0px;
    text-align: left;


  th
    padding: 15px 25px 15px 0;
    text-align: left

  button
    background none
    border 1px solid black
    padding 7px 12px

  red-color = #b70000

  .repositories-page, .repository-page
    font-family Avenir, Open Sans, Helvetica, sans-serif
    margin 20px
    color #000

  .repositories-content, .repository-content
    display flex
    flex-direction row

    .right
      align-items center
      padding-left 120px

    .stat
      text-align center
      margin 50px 0
      display: flex;
      align-items center
      flex-direction column
      h1
        font-size 55px
        margin-bottom 0

      h2
        margin-bottom 5px

    .outdated-stat
      color red-color

  table
    font-size 15px

  td, th
    padding 7px 15px

  th
    cursor pointer

  .clickable
    cursor pointer
    h1, h2
      text-decoration underline

  .repo-link, .index
    color #000

  .old
    color red-color
  .neutral
    color gray
  .recent
    color #22a222

  .filters
    padding 5px 0 20px;
    font-size 13px

    input
      margin-left 10px

  button
    background none
    border 1px solid black
    padding 7px 12px
    font-size 14px
    border-radius 3px
    cursor pointer
</style>
