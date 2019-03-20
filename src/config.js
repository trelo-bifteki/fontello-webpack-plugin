const fontTypes = {
  eot: "embedded-opentype",
  woff2: "woff2",
  woff: "woff",
  ttf: "truetype",
  svg: "svg"
};

const defaultOptions = {
	config: null,
	name: "icons",
	className: "",
	fonts: Object.keys(fontTypes),
	output: {
		css: "[name].css",
		font: "font/[name].[ext]"
	}
}

const createConfig = options => Object.assign({}, defaultOptions, options);

module.exports = createConfig;
