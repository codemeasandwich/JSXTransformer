var hook = require('node-hook');
var babel = require("@babel/core");
var path = require("path");

require('source-map-support').install({
  retrieveSourceMap: function(filename) {

    if (mapping[filename]) {
      return {
        url: filename,
        map: mapping[filename]
      };
    }
    return null;
  }
});

const mapping = {};
let renderImportName = "";

function logLoadedFilename(source, filename) {
var file = path.basename(filename);
  //Skip files in the node_modules
  if(filename.includes("node_modules")){
    return source
  }
  //skip files with no JSX
  if(false === source.includes("</") &&
     false === source.includes("/>")){
     return source
  }

  if(renderImportName){

    source = source.split("\n");
    source[0] = `import React from '${renderImportName}'; ` + source[0]
    source = source.join("\n");
    /*
    let commitDeviderFound = "";
    if(source[0].includes("//")){
      commitDeviderFound = "//";
    } else if(source[0].includes("/*")){
      commitDeviderFound = "/*"
    }

    let firstLine = source[0];
    let tail = ""

    if(commitDeviderFound){
      const towParts = firstLine.split(commitDeviderFound);
      firstLine = towParts[0]
      tail = towParts[1]
    }

    firstLine = firstLine.trim()

    firstLine = `${firstLine}${firstLine.endsWith(";") ? "" : ";"}import React from '${renderImportName}';`



    if(code){

    }*/
  }

  const transformsource = babel.transformSync(source,{
    presets: ["@babel/preset-react","@babel/preset-env"],
    sourceMap : true
  })
  transformsource.map.sources = transformsource.map.sources.map(source => "unknown" === source ? file : source)
  mapping[filename] = transformsource.map
  return transformsource.code;
} // END logLoadedFilename

hook.hook('.jsx', logLoadedFilename);
hook.hook('.js', logLoadedFilename);

module.exports = renderImportNameToUse => renderImportName = renderImportNameToUse
