const { defaults } = require('lodash');
const path = require('path');

const defaultOptions = {
  itemsFromCompilation: compilation => Object.keys(compilation.assets),
  preContent: "",
  output: '../__resource2.lua',
};

function ResourceManifestPlugin(options) {
  console.log(options);
  defaults(this, {...defaultOptions, ...options}, defaultOptions);
}

const pluginName = 'fivem-manifest-plugin';

ResourceManifestPlugin.prototype.apply = function(compiler) {
  const { itemsFromCompilation, output, preContent } = this;
  
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
  --------------------
ui_page "${path}/index.html"

files{${assets.map(asset => `"${path}/${asset}"`).join(',')}}
  `;
}

module.exports = ResourceManifestPlugin;
