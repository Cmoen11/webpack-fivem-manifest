const { defaults, isNil } = require('lodash');
var fs = require("fs");

const defaultOptions = {
  itemsFromCompilation: compilation => Object.keys(compilation.assets),
  filePath: undefined,
  output: '../__resource.lua',
};

function ResourceManifestPlugin(options) {
  defaults(this, {...defaultOptions, ...options}, defaultOptions);
}

const pluginName = 'fivem-manifest-plugin';

ResourceManifestPlugin.prototype.apply = function(compiler) {
  const { itemsFromCompilation, output, filePath } = this;
  
  let preContent;

  if (!isNil(filePath)) {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) throw err;
      preContent = data.match(/[^]*;/);
    });
  }


  compiler.hooks.emit.tap(pluginName, compilation => {
    const assets = itemsFromCompilation(compilation);
    const result = format(
      preContent,
      assets,
      compilation.options.output.path.split('\\').pop(),
    );
    compilation.assets[output] = {
      source: () => Buffer.from(result),
      size: () => Buffer.byteLength(result),
    };
  });
};

function format(preContent, assets, path) {
  return `
${preContent}
ui_page "${path}/index.html"

files{${assets.map(asset => `"${path}/${asset}"`).join(',')}}
  `;
}

module.exports = ResourceManifestPlugin;
