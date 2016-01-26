module.exports = function(type) {
  const types = ['dist', 'prod', 'test'];

  if (types.indexOf(type) === -1) {
    throw new Error('Unknown webpack configuration');
  }

  return require('./' + type);
};
