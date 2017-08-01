import Home from './Home.vue';
import Projects from './Projects.vue';
import Repositories from './Repositories.vue';
import Commits from './Commits.vue';
import Dependencies from './Dependencies.vue';

const routes = [
  { path: '/projects', component: Projects, name: 'projects' },
  { path: '/projects/:projectKey/repositories', component: Repositories, name: 'repositories' },
  { path: '/projects/:projectKey/repositories/:repositoryKey/commits', component: Commits, name: 'commits' },
  { path: '/projects/:projectKey/repositories/:repositoryKey/dependencies', component: Dependencies, name: 'dependencies' }
]

export default {
  routes
}
