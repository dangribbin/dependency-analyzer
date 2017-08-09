<template>
  <div class="sidebar">
    <line-chart :data="chartData" ytitle="Commits"></line-chart>

    <div class="stat">
      <h1>{{daysSinceLastCommit}}</h1>
      <span></span>
    </div>
    <ul>
      <li v-for="(commit, index) in commits">
        <span>{{index +1}}. {{moment(commit.authorTimestamp).format('MMM DD YYYY')}} - {{commit.author.name}} - {{commit.message}}</span>
      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

export default {
  name: 'Commits',
  data () {
    return {
      loading: false,
      commits: null,
      error: null,
      chartData: null,
      daysSinceLastCommit: null
    }
  },
  // components: {
  //   'calendar-heatmap': calendarHeatmap
  // },
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
      let url = 'http://localhost:3000/projects/' + this.$route.params.projectKey + '/repositories/' + this.$route.params.repositorySlug + '/commits';
      axios.get(url).then(response => {
        this.commits = response.data.values;
        this.chartData = _.map(response.data.values, function (commit) {
          return [ moment(commit.authorTimestamp).format('YYYY-MM'), moment(commit.authorTimestamp).format('DD')]
        });
        this.loading = false;
      }).catch(function (err) {
        this.loading = false;
        this.error = err.toString();
      });
    }

  },
}
</script>

<style lang="stylus">
// .stat
//   color blue

</style>
