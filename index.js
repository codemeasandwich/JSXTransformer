const hook = require('node-hook');
const babel = require("@babel/core");
const path = require("path");

//=====================================================
//=================================== Setup time report
//=====================================================

console.log("JSXTransformer - Started")

const startTime = new Date();
let totleProcessingMillSec = 0;
const waitSec = 2000
function done(){
  const difference = totleProcessingMillSec / 1000;
  console.log("JSXTransformer - Done: "+difference+" Sec")
}
let timeout = setTimeout(done,waitSec);

//=====================================================
//================================== Source map support
//=====================================================

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

//=====================================================
//=================================== Proxy file import
//=====================================================

function proxyFileImport(source, filename) {
  clearTimeout(timeout)
  // get process START timestamp
  const a = new Date();
  // get target file name
  const file = path.basename(filename);
  //Skip files in the node_modules
  if(filename.includes("node_modules")){
    return source
  }
  //skip files with no JSX
  if(false === source.includes("</") &&
     false === source.includes("/>")){
     return source
  }

//+++++++++++++++++++++++++++++++++ Render Import Name
//++++++++++++++++++++++++++++++++++++++++++++++++++++

  if(renderImportName){
    source = source.split("\n");
    source[0] = `import React from '${renderImportName}'; ` + source[0]
    source = source.join("\n");
  }

//++++++++++++++++++++++++++++++++++++++ transform JSX
//++++++++++++++++++++++++++++++++++++++++++++++++++++

  const transformsource = babel.transformSync(source,{
    presets: ["@babel/preset-react","@babel/preset-env"],
    sourceMap : true
  })
  // fix bug where target file is "unknown"
  transformsource.map.sources = transformsource.map.sources.map(source => "unknown" === source ? file : source)
  // save source map for lookup
  mapping[filename] = transformsource.map
  // get process END timestamp
  const b = new Date();
  // update totle process time
  totleProcessingMillSec += b - a

  timeout = setTimeout(done,waitSec);

  return transformsource.code;
} // END proxyFileImport

//++++++++++++++++++++++++++ Proxy Import for JSX / JS
//++++++++++++++++++++++++++++++++++++++++++++++++++++

hook.hook('.jsx', proxyFileImport);
hook.hook('.js', proxyFileImport);

//=====================================================
//==================================== Set JSX Lib name
//=====================================================

module.exports = renderImportNameToUse => renderImportName = renderImportNameToUse
