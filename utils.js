let isBranch = version => {
  return ( version.indexOf('#') >= 0 && ((version.indexOf('www.') > 0) || (version.indexOf('https://') >= 0) || (version.indexOf('ssh://') >= 0) ) ) ;
};
