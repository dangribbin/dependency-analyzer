const supportedFileTypes = [
  {
    name: 'Bower',
    fileName: 'bower.json',
    dependencyTypeKeys: ['dependencies', 'devDependencies']
  },
  {
    name: 'NPM',
    fileName: 'package.json',
    dependencyTypeKeys: ['dependencies', 'devDependencies']
  }
];

let ignore = [];
// let ignore = ['dev', 'hailstone-web-client', 'moderation', 'shift-components'];
