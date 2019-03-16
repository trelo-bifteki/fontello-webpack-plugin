class FontelloWebpackPlugin {

  apply(compiler) {
    // specify the hook to attach to
    compiler.hooks.emit.tapAsync(
      'FontelloWebpackPlugin',
      (compilation, callback) => {
        console.log('I am here');
        callback();
      }
    );
  }
}

module.exports = FontelloWebpackPlugin;
