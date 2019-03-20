const createConfig = require('./config');
const FontelloService = require('./fontello.service');

class FontelloWebpackPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // specify the hook to attach to
    const client = new FontelloService(this.options);

    compiler.hooks.emit.tapAsync(
      'FontelloWebpackPlugin',
      (compilation, callback) => {
        console.log('initialize plugin');
        client.initSession().then(() => {
          console.log('session initialized');
        }).catch(error => {
          console.error('session init failed', error);
        })
        callback();
      }
    );
  }
}

module.exports = FontelloWebpackPlugin;
