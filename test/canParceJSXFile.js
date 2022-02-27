import ReactDOMServer from 'react-dom/server'
import Elam from "../example/Elem.jsx"

//++++++++++++++++++++++++++++++++++++ Test Render/JSX
//++++++++++++++++++++++++++++++++++++++++++++++++++++

const result = "<div>Hi World</div><button>Say Hello Back!</button>"
const output = ReactDOMServer.renderToString(<Elam />)
const passed = result === output

console.log(`Test Render/JSX: ${ passed ? "PASSED ✓" : "FALSED ✘" }`)

if( ! passed){
  console.log("Expected: "+result)
  console.log("Received: "+output)
}

//+++++++++++++++++++++++++++++++++++++ Test sourceMap
//++++++++++++++++++++++++++++++++++++++++++++++++++++

function foo(){
  try{
    throw new Error("Yo")
  }catch(err){
    const [errMessage,line1,line2] = err.stack.split("\n");
    let stackCheckFalseWith = "";
    if( ! line1.trim().startsWith("at foo")){
      stackCheckFalseWith = "1st line didnt match 'Scope name'";
      stackCheckFalseWith += "\n Received: "+line1
    } else if( ! line1.trim().includes("canParceJSXFile.js:23")){
      stackCheckFalseWith = "1st line didnt match 'file name'";
      stackCheckFalseWith += "\n Received: "+line1
    } else if( ! line2.trim().startsWith("at Object.<anonymous> ")){
      stackCheckFalseWith = "2nd line didnt match 'Scope name'";
      stackCheckFalseWith += "\n Received: "+line2
    } else if( ! line2.trim().includes("canParceJSXFile.js:51")){
      stackCheckFalseWith = "2nd line didnt match 'file name'";
      stackCheckFalseWith += "\n Received: "+line2
    }

    console.log(`Test stackTrace: ${ ! stackCheckFalseWith ? "PASSED ✓" : "FALSED ✘"}`)

    if( stackCheckFalseWith ){
      console.log(stackCheckFalseWith)
    }

  } // END catch
}// END foo

// Run stackTrace test
foo()
