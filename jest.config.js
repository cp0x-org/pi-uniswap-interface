module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest-setup.js'],
  // https://github.com/facebook/jest/issues/2663#issuecomment-341384494
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'identity-obj-proxy',
  },
}
