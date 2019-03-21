const createConfig = require('./config');
const FontelloService = require('./fontello.service');

class FontelloWebpackPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // specify the hook to attach to
    const fontelloService = new FontelloService(this.options);

    compiler.hooks.emit.tapAsync(
      'FontelloWebpackPlugin',
      (compilation, callback) => {
        fontelloService.initSession().then(() => {
        }).catch(error => {
          console.error('session init failed', error);
        })
        callback();
      }
    );
  }
}

module.exports = FontelloWebpackPlugin;
