<template>

  <div class="repository-page">

    <button type="button" name="button" @click="$router.go(-1)"><i class="fa fa-caret-left"></i> Back</button>

    <h2>{{tab === 'commits' ? 'Commits to' : 'Dependencies of'}} {{$route.params.repositorySlug}}</h2>
    <p v-if="!loading && tab === 'commits' && commits.isLastPage">Showing up to {{commits.values.length}}</p>
    <h4 v-if="loading">Loading... <br><small style="font-weight:normal">This can take a little bit if there's a lot of commits</small></h4>

    <div class="tabs" v-if="!loading">
      <button type="button" name="button" @click="tab = 'commits'" :class="'tab ' + (tab === 'commits' ? 'active' : '') ">Commits</button>
      <button type="button" name="button" @click="tab = 'dependencies'" :class="'tab ' + (tab === 'dependencies' ? 'active' : '') ">Dependencies</button>
    </div>

    <div class="repository-content" v-if="!loading">

      <div class="commits-view" v-if="tab === 'commits'">
        <div class="left">
          <table class="commits-table">
            <tr>
              <th style="width: 120px">Date</th>
              <th style="width: 120px">User</th>
              <th style="max-width: 400px;">Commit Message</th>
            </tr>

            <tr v-for="commit in sortedCommits">
              <td style="width: 120px">{{moment(commit.authorTimestamp).format('MMM DD YYYY')}}</td>
              <td style="width: 120px">{{commit.author.name}}</td>
              <td class="commit-message-cell" style="max-width: 400px;">{{commit.message}}</td>
            </tr>
          </table>
        </div>

        <div class="right stats" style="min-width: 600px">

          <div class="stat">
            <h1>{{commits.values.length}}{{!commits.isLastPage ? '+' : ''}}</h1>
            <span>Commits in this repo</span>
          </div>

          <div class="stat">
            <h1>{{lastCommitDate}}</h1>
            <span>Last commit</span>
          </div>

          <div class="stat">
            <line-chart :data="commitsOverTimeData" ytitle="Commits over time" width="400px" height="160px" label="Commits"></line-chart>
          </div>

          <div class="stat-row">
            <div class="stat-row-stat">
              <pie-chart :data="commitsByAuthor" :donut="true" :legend="false" width="150px" height="170px"></pie-chart>
              <span>Commits by author</span>
            </div>
            <div class="stat-row-stat">
              <ol>
                <li v-for="committer in topThreeCommitters"><b>{{committer.name + ' - ' + committer.commits}}</b></li>
              </ol>
            </div>
          </div>

          <div class="stat clickable outdated-stat" @click="filterByOnly('author.name')">

          </div>
          <!-- <div class="stat">
            <h2><router-link class="repo-link" :to=" '/projects/' + $route.params.projectKey + '/repositories/' + oldestRepo.slug">{{oldestRepo.name}}</router-link></h2>
            <span>Oldest commit</span>
          </div> -->
        </div>
      </div>

      <div class="dependencies-view" v-if="tab === 'dependencies'">

        <div class="left">

          <div v-for="file in dependencyFiles.dependencyObjects" class="dependency-file">
            <h2>File: <span class="file-name">{{file.fileName}}</span></h2>

            <div v-if="file.dependencies" class="dependency-object indent">
              <h3>dependencies:</h3>
              <table>
                <tr>
                  <th>Package</th>
                  <th>Consumed Version</th>
                  <th>Latest available version</th>
                </tr>
                <tr v-for="(key, value) in file.dependencies">
                  <td>{{value}}</td>
                  <td :class="'consumed-version-cell ' + getConsumedVersionCellClass(value, key)">
                    <i class="fa fa-exclamation-triangle outdated-icon"></i>
                    <i class="fa fa-check up-to-date-icon"></i>
                    <i class="fa fa-question unknown-icon"></i>
                    <span>{{key}}</span>
                  </td>
                  <td>{{dependencyFiles.currentVersions[value]}}</td>
                </tr>
              </table>
            </div>

            <div v-if="file.devDependencies" class="dependency-object indent">
              <h3>devDependencies:</h3>
              <table>
                <tr>
                  <th>Package</th>
                  <th>Consumed Version</th>
                  <th>Latest available version</th>
                </tr>
                <tr v-for="(key, value) in file.devDependencies">
                  <td>{{value}}</td>
                  <td :class="'consumed-version-cell ' + getConsumedVersionCellClass(value, key)">
                    <i class="fa fa-exclamation-triangle outdated-icon"></i>
                    <i class="fa fa-check up-to-date-icon"></i>
                    <i class="fa fa-question unknown-icon"></i>
                    <span>{{key}}</span>
                  </td>
                  <td>{{dependencyFiles.currentVersions[value] }}</td>
                </tr>
              </table>
            </div>

            <div v-if="file.resolutions" class="dependency-object indent">
              <h3>resolutions:</h3>
              <table>
                <tr v-for="(key, value) in file.resolutions">
                  <td>{{value}}</td>
                  <td>{{key}}</td>
                </tr>
              </table>
            </div>

          </div>

        </div>

        <div class="right stats">

            <div class="stat">

            </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
// import compareVersions from 'compare-versions';
var compareVersions = require('compare-versions');

let getNumberOfCommitsByAuthor = (commits) => {
  let authors = {};
  _.each(commits, (commit) => {
    authors[commit.author.name] = authors[commit.author.name] ? (authors[commit.author.name] + 1) : 1;
  });
  return authors;
}

let getTopThreeCommitters  = (commits) => {
  let self = this;
  let topThree = [];
  let commitsByAuthor = getNumberOfCommitsByAuthor(commits);
  _.each(_.keys(commitsByAuthor), (author) => {
    topThree.push({
      name: author,
      commits: commitsByAuthor[author]
    });
  });
  return _(topThree).sortBy('commits').reverse().take(3).value();
}

export default {
  name: 'Repository',
  data () {
    return {
      loading: false,
      commits: null,
      dependencyFiles: null,
      error: null,
      tab: 'commits',
      commitsOverTimeData: null,
      commitsByAuthor: {},
      topThreeCommitters: [],
      daysSinceLastCommit: null,
      sortProp: 'author.name',
      lastSortProp: 'name',
      sortDirection: 'asc',
      lastCommitDate: null
    }
  },
  created () {
    if (!this.$root.commits[this.$route.params.repositorySlug] || !this.$root.dependencyFiles[this.$route.params.repositorySlug]) {
      this.fetchData();
    }
    else {
      this.commits = this.$root.commits[this.$route.params.repositorySlug];
      this.dependencyFiles = this.$root.dependencyFiles[this.$route.params.repositorySlug];
      this.createChartData(this.commits);
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  computed: {
    sortedCommits: function (data) {
      let self = this;
      let sortedData = _.sortBy(this.commits.values, self.sortProp);
      return self.sortDirection === 'asc' ? sortedData : _.reverse(sortedData);
    }
  },
  methods: {
    fetchData () {
      let self = this;
      self.loading = true;
      let commitsUrl = 'http://localhost:3000/projects/' + self.$route.params.projectKey + '/repositories/' + self.$route.params.repositorySlug + '/commits';
      let dependenciesUrl = 'http://localhost:3000/projects/' + self.$route.params.projectKey + '/repositories/' + self.$route.params.repositorySlug + '/dependencies';
      axios.get(commitsUrl).then(response => {
        self.commits = response.data;
        self.$root.commits[self.$route.params.repositorySlug] = response.data;
        self.createChartData(self.commits);
        self.loading = false;
        axios.get(dependenciesUrl).then( (deps) => {
          self.dependencyFiles = deps.data;
          self.$root.dependencyFiles[self.$route.params.repositorySlug] = deps.data;
        });
      }).catch(function (err) {
        self.loading = false;
        self.error = err.toString();
      });
    },
    createChartData (commits) {
      let self = this;
      self.commitsOverTimeData = _.map(commits.values, function (commit) {
        return [ moment(commit.authorTimestamp).format('YYYY-MM'), moment(commit.authorTimestamp).format('DD')]
      });
      let lastCommit = _(commits.values).sortBy('authorTimestamp').reverse().value()[0];
      self.lastCommitDate = moment(lastCommit.authorTimestamp).format('MMM \'YY');
      self.commitsByAuthor = getNumberOfCommitsByAuthor(commits.values);
      self.topThreeCommitters = getTopThreeCommitters(commits.values);
    },
    getConsumedVersionCellClass (key, consumedVersion) {
      let latestVersion = this.dependencyFiles.currentVersions[key];
      if (!latestVersion || !consumedVersion) {
        return 'unknown';
      }
      consumedVersion = consumedVersion.replace(/~|\^/g, '');
      if (compareVersions(consumedVersion, latestVersion) === -1) {
        return 'outdated';
      }
      else {
        return 'up-to-date';
      }
    }
  }
}
</script>

<style scoped lang="stylus">

red-color = #b70000
green-color = #22a222

.commits-table
  font-size 12px
  width 560px

.dependency-object table
  width 750px
  border-collapse collapse

  tr:nth-child(even)
    background #f1f1f1

  td:nth-of-type(1)
    width 250px

  td:nth-of-type(2)
    max-width 200px
    white-space nowrap
    overflow scroll

  td:nth-of-type(3)
    max-width 200px
    white-space nowrap
    overflow scroll

.file-name
  border 1px solid #aaa
  border-radius 3px
  padding 4px
  background #f1f1f1

.dependency-file
  margin 40px 0
  h3
    display inline-block
    vertical-align middle

  button
    font-size 11px
    padding 3px 6px
    vertical-align middle

.consumed-version-cell
  i
    display none
    width 20px

  &.unknown
    .unknown-icon
      display inline-block

  &.outdated
    color red-color
    .outdated-icon
      display inline-block

  &.up-to-date
    color green-color
    .up-to-date-icon
      display inline-block

</style>
