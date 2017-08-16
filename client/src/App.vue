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
      this.$root.commits = {};
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
    display flex


  .content
    margin-left 20px

  .sidebar, .content

  .indent
    padding-left 15px

  td
    padding: 5px 25px 5px 0px;
    text-align left
  th
    padding: 15px 25px 15px 0;
    text-align: left

  button
    background none
    border 1px solid black
    padding 7px 12px

  red-color = #b70000
  green-color = #22a222

  .repositories-page, .repository-page, .projects-page
    font-family Avenir, Open Sans, Helvetica, sans-serif
    margin 20px
    color #000

  .repositories-content, .repository-content, .projects-content, .commits-view, .dependencies-view
    display flex
    flex-direction row

    .right
      align-items center
      padding-left 40px

    .stats
      display flex
      flex-direction column

    .sub-stat
      display flex
      justify-content center
      width 40%

      &.with-graph
        margin-top 15px

      h1, h2
        font-weight normal

      *
        text-align center
        flex 0 0 50%
        padding 0 6px
        align-self center

        &:nth-child(2)
          align-self center

      h2
        font-size 35px
        padding-right 0

      span
        font-size 15px
        padding-left 3px

    .stat
      text-align center
      display: flex;
      align-items center
      flex-direction column
      padding 40px 0

      &:nth-of-type(1)
        padding-top 0

      h1
        font-size 55px
        margin 0

      h2
        margin 0 0 10px 0

    .stat-row
      display flex
      flex-direction row
      align-items center
      padding 40px 0

    .outdated-stat
      // color red-color

  .repositories-content, .repository-content
    table
      width 750px


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

  .tools
    padding 10px 0
    
  .tool-button
    border 1px solid green-color
    color green-color

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

    &.tab
      border none
      border-color #bbb
      padding 12px 15px
      margin 15px 0
      font-size 17px

      &.active
        text-decoration underline

  .dependencies-view
    font-family Inconsolata, Consolas, monospace
    .dependency-file
      margin 40px 0
</style>
