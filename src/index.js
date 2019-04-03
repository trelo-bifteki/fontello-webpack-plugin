const createConfig = require('./config');
const FontelloService = require('./fontello.service');
const unzip = require('unzip');
const path = require("path")

/**
 * Unzips all files by provided stream
 * @param {object} pipeline
 * @return {object} containing assets
 */
const unzipByPipeline = pipeline => new Promise((resolve, reject) => {
  const assets = {};

  pipeline.pipe(unzip.Parse())
    .on('entry', entry => {
      const ext = path.extname(entry.path).slice(1)

      if(entry.type === 'File') {
        const buffer = [];
        entry.on("data", data => buffer.push(data))
        entry.on("end", () => { assets[ext] = Buffer.concat(buffer) })
      } else {
        entry.autodrain();
      }
    })
    .on('error', error => reject(error))
    .on('close', () => resolve(assets));
});

const getPublicPath = compilation => {
	let publicPath = compilation.mainTemplate.getPublicPath({ hash: compilation.hash }) || ""

	if(publicPath && publicPath.substr(-1) !== "/") {
		publicPath += "/"
	}

	return publicPath
}

class FontelloWebpackPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // specify the hook to attach to
    const fontelloService = new FontelloService(this.options);

    compiler.hooks.make.tapAsync(
      'FontelloWebpackPlugin',
      (compilation, callback) => {
        fontelloService.initSession().then(() => {
          fontelloService.fetchFonts().then(body => {
            unzipByPipeline(body).then(assets => {
              console.debug(`got assets: ${Object.keys(assets)}`);

              return assets;
            })
          }).catch(error => {
            console.error('Unable to fetch fonts', error);
          })
        }).catch(error => {
          console.error('session init failed', error);
        });
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
          'FontelloWebpackPlugin',
          (assets, _callback) => {
            const publicPath = getPublicPath(compilation);
            console.log(`publicPath = ${publicPath}`);
            _callback();
          });
        callback();
      }
    );
  }
}

module.exports = FontelloWebpackPlugin;
