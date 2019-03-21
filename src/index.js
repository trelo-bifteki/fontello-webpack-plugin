const createConfig = require('./config');
const FontelloService = require('./fontello.service');
const unzip = require('unzip');

const unzipByPipeline = pipeline => new Promise((resolve, reject) => {
  const assets = {};

  pipeline.pipe(unzip.Parse())
    .on('entry', entry => {
      entry.autodrain();
    })
    .on('error', error => reject(error))
    .on('close', () => resolve(assets));
});

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
          fontelloService.fetchFonts().then(body => {
            unzipByPipeline(body).then(() => {
              console.log('fonts downloaded and unzipped');
            })
          }).catch(error => {
            console.error('Unable to fetch fonts', error);
          })
        }).catch(error => {
          console.error('session init failed', error);
        });
        callback();
      }
    );
  }
}

module.exports = FontelloWebpackPlugin;
