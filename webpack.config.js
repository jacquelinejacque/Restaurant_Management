// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "fs": false,
      "path": false
    }
  }
};

