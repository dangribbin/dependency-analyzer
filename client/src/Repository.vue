<template>

  <div class="repository-page">
    <!-- <div class="sidebar">
      <router-link :to=" '/projects/' + $route.params.projectKey + '/repositories/' + $route.params.repositorySlug + '/commits'">Commits</router-link>
      <router-link :to=" '/projects/' + $route.params.projectKey + '/repositories/' + $route.params.repositorySlug + '/dependencies'">Dependencies</router-link>
      <span>{{stats}}</span>
    </div> -->

    <div class="repository-content" v-if="!loading">
      <div class="left">

        <table>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th style="max-width: 400px;">Commit Message</th>
          </tr>

          <tr v-for="commit in sortedCommits">
            <td>{{moment(commit.authorTimestamp).format('MMM DD YYYY')}}</td>
            <td>{{commit.author.name}}</td>
            <td style="max-width: 400px;">{{commit.message}}</td>
          </tr>
        </table>

      </div>


      <div class="right" style="min-width: 600px">
        <div class="stat">
          <line-chart :data="commitsOverTimeData" ytitle="Commits over time" width="400px" height="160px"></line-chart>
        </div>
        <div class="stat-row">
          <div class="stat-row-stat">
            <pie-chart :data="commitsByAuthor" :donut="true" :legend="false" width="150px" height="170px"></pie-chart>
            <span>Commits by author</span>
          </div>
          <div class="stat-row-stat">
            <ol>
              <li></li>
            </ol>
          </div>
        </div>
        <div class="stat">
          <h1>{{commits.length}}</h1>
          <span>Commits in this repo</span>
        </div>
        <div class="stat clickable outdated-stat" @click="filterByOnly('author.name')">

        </div>
        <div class="stat">
          <!-- <h2><router-link class="repo-link" :to=" '/projects/' + $route.params.projectKey + '/repositories/' + oldestRepo.slug">{{oldestRepo.name}}</router-link></h2> -->
          <span>Oldest commit</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

let getNumberOfCommitsByAuthor (commits) => {
  let authors = {};
  _.each(commits, (commit) => {
    authors[commit.author.name] = authors[commit.author.name] ? (authors[commit.author.name] + 1) : 1;
  });
  return authors;
}
let getTopThreeCommitters (commits) => {

}

export default {
  name: 'Repository',
  data () {
    return {
      loading: false,
      commits: null,
      error: null,
      commitsOverTimeData: null,
      commitsByAuthor: {},
      topThreeCommitters: [],
      daysSinceLastCommit: null,
      sortProp: 'author.name',
      lastSortProp: 'name',
      sortDirection: 'asc',
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  computed: {
    sortedCommits: function (data) {
      let self = this;
      let sortedData = _.sortBy(this.commits, self.sortProp);
      return self.sortDirection === 'asc' ? sortedData : _.reverse(sortedData);
    },
  },
  methods: {
    fetchData () {
      let self = this;
      self.loading = true;
      let url = 'http://localhost:3000/projects/' + self.$route.params.projectKey + '/repositories/' + self.$route.params.repositorySlug + '/commits';
      axios.get(url).then(response => {
        self.commits = response.data.values;
        self.commitsOverTimeData = _.map(self.commits, function (commit) {
          return [ moment(commit.authorTimestamp).format('YYYY-MM'), moment(commit.authorTimestamp).format('DD')]
        });
        self.commitsByAuthor = getNumberOfCommitsByAuthor(self.commits);
        self.topThreeCommitters = getTopThreeCommitters(self.commits);
        self.loading = false;
      }).catch(function (err) {
        self.loading = false;
        self.error = err.toString();
      });
    }
  }
}
</script>

<style>

</style>
