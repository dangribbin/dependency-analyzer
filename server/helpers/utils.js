let isBranch = version => {
  return ( version.indexOf('#') >= 0 && ((version.indexOf('www.') > 0) || (version.indexOf('https://') >= 0) || (version.indexOf('ssh://') >= 0) ) ) ;
};

// let projects = _(repos).map(getDependenciesForProject).filter(_.identifier).value();

// // aggregate values
// _.each(projects, project => {
//
//   _.each(project.dependencies, dep => {
//
//     let version = '';
//     let sourceType = '';
//
//     if (!aggregatedValues[dep.name]){
//       aggregatedValues[dep.name] = [];
//     }
//
//     if (isBranch(dep.version)) {
//       let urlEnd = dep.version.indexOf('#');
//       version = dep.version.slice(urlEnd, dep.version.length);
//       dep.version = version;
//       sourceType = 'branch';
//     }
//
//     else {
//       version = dep.version;
//       sourceType = 'normal';
//     }
//
//     aggregatedValues[dep.name].push({
//       version: version,
//       repoName: dep.name,
//       projectName: project.project,
//       sourceType: sourceType,
//       dependencyHost: dep.dependencyHost
//     });
//
//     aggregatedValues[dep.name] = _.uniq(aggregatedValues[dep.name]);
//
//   });
//
// });
//
// let mostRecentVersions = {
//   bower: {},
//   npm: {}
// };
//
// json = { aggregations: aggregatedValues, projects: projects };

module.exports = {
  isBranch
}
