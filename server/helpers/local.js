let getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

let fsGetDependenciesForProject = (projectName) => {
  let file = null;
  let allDependenciesForProject = {};

  _.each(supportedFileTypes, (fileType) => {
    try {
      file = require(path.join(__dirname, '../' + projectName, fileType.fileName));
    }
    catch (e){}
  });

  return allDependenciesForProject;
}

let getRepositories = () => {
  let localRepos = getDirectories(path.join(__dirname, '../'));
  // todo make this configurable
  localRepos = _.reject(repos, directory => {
    // ignore from the main ignore list or anything with an -api prefix for now
    return (ignore.indexOf(directory) >= 0 || directory.indexOf('-api') >= 0);
  });
}

let getAllLocalDependencies = () => {
  let localRepos = getDirectories(path.join(__dirname, '../'));
  // todo make this configurable
  localRepos = _.reject(repos, directory => {
    // ignore from the main ignore list or anything with an -api prefix for now
    return (ignore.indexOf(directory) >= 0 || directory.indexOf('-api') >= 0);
  });
}

module.exports = {
  getAllLocalDependencies
}
