<template>
  <div class="repositories-page">
    <header>
      <button type="button" @click="$router.go(-1)"><i class="fa fa-caret-left"></i> Back</button>
      <h2>Repositories in {{$route.params.projectKey}}</h2>
      <div class="filters">
        <!-- Recent, neutral, old, unknown -->
        Filter by:
        <input type="checkbox" id="recent-checkbox" value="true" v-model="filter.recent">
        <label for="recent-checkbox">Recent</label>
        <input type="checkbox" id="old-checkbox" value="true" v-model="filter.old">
        <label for="old-checkbox">Possibly Unmaintained</label>
        <input type="checkbox" id="neutral-checkbox" value="true" v-model="filter.neutral">
        <label for="neutral-checkbox">No Recent Activity</label>
        <input type="checkbox" id="unknown-checkbox" value="true" v-model="filter.unknown">
        <label for="unknown-checkbox">Unknown</label>
      </div>
      <div class="tools">
        <button type="button" class="tool-button">Compare all dependencies</button>
      </div>
    </header>
    <h4 v-if="loading">Loading...</h4>
    <div class="repositories-content" v-if="!loading">
      <div class="left">
        <table class="repositories">
          <tr>
            <th></th>
            <th @click="sortBy('name')">Repo <i v-if="sortProp ==='name'" :class="sortDirection === 'asc' ? 'fa fa-caret-down' : 'fa fa-caret-up'"></i> </th>
            <th @click="sortBy('lastCommit.authorTimestamp')">Status <i v-if="sortProp ==='lastCommit.authorTimestamp'" :class="sortDirection === 'asc' ? 'fa fa-caret-down' : 'fa fa-caret-up'"></i></th>
            <th @click="sortBy('lastCommit.authorTimestamp')">Last Commit Date <i v-if="sortProp ==='lastCommit.authorTimestamp'" :class="sortDirection === 'asc' ? 'fa fa-caret-down' : 'fa fa-caret-up'"></i></th>
          </tr>
          <tr :class="'repository ' + getRepoStatus(repository).className" v-for="repository in filteredData">
            <td><i :class="getRepoStatus(repository).icon"></i></td>
            <td><router-link class="repo-link" :to=" '/projects/' + $route.params.projectKey + '/repositories/' + repository.slug">{{repository.name}}</router-link></td>
            <td><span class="message">{{getRepoStatus(repository).message}}</span></td>
            <td><span class="message">{{repository.lastCommit ? moment(repository.lastCommit.authorTimestamp).format('MM-DD-YYYY') : 'Commit history unknown.' }}</span></td>
          </tr>
        </table>
      </div>
      <div class="right stats">
        <div class="stat clickable" @click="filterByOnly('all')">
          <h1>{{repositories.length}}</h1>
          <span>Repositories in this project</span>
        </div>
        <div class="stat clickable outdated-stat" @click="filterByOnly('old')">
          <pie-chart :data="repositoriesByStatus" :donut="false" :legend="false" width="140px" height="140px"></pie-chart>
          <div class="sub-stat with-graph">
            <h2>{{getReposOfType('old').length}}</h2>
            <span>Possibly unmaintained repositories</span>
          </div>
        </div>
        <div class="stat clickable">
          <h2><router-link class="repo-link" :to=" '/projects/' + $route.params.projectKey + '/repositories/' + oldestRepo.slug">{{oldestRepo.name}}</router-link></h2>
          <span>Oldest repository</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment';

  let repoStatusMap = {
    'old': moment().subtract(1, 'year'),
    'neutral': moment().subtract(6, 'months'),
    'recent': moment().isBetween(moment(), moment().subtract(6, 'months')),
    'unknown': null
  };

  export default {
    name: 'Repositories',
    data () {
      return {
        loading: false,
        repositories: null,
        error: null,
        filter: {old: true, unknown: true, recent: true, neutral: true},
        sortProp: 'name',
        lastSortProp: 'name',
        sortDirection: 'asc',
        oldestRepo: null,
        repositoriesByStatus: null
      }
    },
    created () {

      if (!this.$root.repos[this.$route.params.projectKey]) {
        this.fetchData()
      }
      else {
        this.repositories = this.$root.repos[this.$route.params.projectKey];
        this.createChartData(this.repositories);
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    computed: {
      filteredData: function (data){
        let self = this;
        if (!self.filter) {
          return self.repositories;
        }
        else {
          let filters = _.keys(_.pickBy(self.filter, _.identifier));
          let filteredData = _.filter(self.repositories, function (repo) {
            return _.some(filters, function (filterKey) {
              return self.getRepoStatus(repo).className === filterKey;
            });
          });

          if (self.sortProp){
            let sortedData = _.sortBy(filteredData, self.sortProp);
            return self.sortDirection === 'asc' ? sortedData : _.reverse(sortedData);
          }
          else {
            return filteredData;
          }
        }
      },
    },
    methods: {
      fetchData () {
        let self = this;
        self.error = self.post = null
        self.loading = true;
        let url = 'http://localhost:3005/projects/' + self.$route.params.projectKey + '/repositories?stats=true';
        axios.get(url).then(response => {
          self.repositories = response.data;
          self.createChartData(response.data);
          self.$root.repos[self.$route.params.projectKey] = response.data;
          self.loading = false;
        }).catch(function (err) {
          self.loading = false;
          self.error = err.toString();
        });
      },
      createChartData (repos) {
        this.oldestRepo = _(repos).filter('lastCommit').sortBy('lastCommit.authorTimestamp').head();
        this.repositoriesByStatus = this.getRepositoriesByStatus(repos);
      },
      getRepositoriesByStatus (repos) {
        let self = this;
        let reposByStatus = {};
        _.each(repos, (repo) => {
          let key = self.getRepoStatus(repo).className;
          reposByStatus[key] =  reposByStatus[key] ? (reposByStatus[key] + 1) : 1;
        });
        return reposByStatus;
      },
      sortBy (prop) {
        if (prop !== this.lastSortProp) {
          this.sortDirection = 'asc';
        }
        else {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        }
        this.sortProp = prop;
        this.lastSortProp = prop;
      },
      getReposOfType (type) {
        let self = this;
        return _.filter(self.repositories, function (repo) {
          return self.getRepoStatus(repo).className === type;
        });
      },
      filterByOnly (type) {
        let self = this;
        let defaultValue = type === 'all' ? true : false;
        _.each(_.keys(self.filter), (filterKey) => {
          self.filter[filterKey] = defaultValue;
        });
        self.filter[type] = true;
      },
      getRepoStatus (repo) {
        if (!repo.lastCommit) {
          return {
            className: 'unknown',
            icon: 'fa fa-question',
            message: 'No data available'
          }
        }
        if (moment(repo.lastCommit.authorTimestamp).isBefore(moment().subtract(1, 'year')) ) {
          return {
            className: 'old',
            icon: 'fa fa-exclamation-triangle',
            message: 'Possibly unmaintained'
          }
        }
        else if (moment(repo.lastCommit.authorTimestamp).isBefore(moment().subtract(6, 'months')) ) {
          return {
            className: 'neutral',
            icon: 'fa fa-meh-o',
            message: 'No recent activity'
          }
        }
        else if (moment(repo.lastCommit.authorTimestamp).isBefore(moment()) ){
          return {
            className: 'recent',
            icon: 'fa fa-check',
            message: 'Recently updated'
          }
        }
      }
    }
  }
</script>

<style lang="stylus">


</style>
