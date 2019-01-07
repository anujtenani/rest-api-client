import {fn} from "./test";


export function getWorkerObjectUrl(fnObject){
    const blob = new Blob([customFunctions(fnObject), workerCore]);
    return window.URL.createObjectURL(blob);
}


const customFunctions = (fnObject = fn)=>{
    var blobParts = [];
    blobParts.push(Object.keys(fnObject).map((item)=>{
        return `${item} = ${fnObject[item]}`;
    }));
    blobParts.join(';');
    return blobParts+";";
}


const workerCore = "/**\n" +
    " * Playground for writing worker core javascript to be copy pasted later in BuildWorkerBlob file\n" +
    " *\n" +
    " * DO NOT USE toString()\n" +
    " * See : https://stackoverflow.com/a/5265038\n" +
    " */\n" +
    "\n" +
    "this.base = {\n" +
    "    timestamp:()=>new Date().getTime(),\n" +
    "    findRequestById:(state, requestId)=>state.requests.byId[requestId]\n" +
    "}\n" +
    "\n" +
    "onmessage = async (e)=>{\n" +
    "    const {key, fn, state, args} = e.data;\n" +
    "    console.log('got ', e.data);\n" +
    "    callFunction(fn, state, args).then((result)=>{\n" +
    "        postMessage({key, result});\n" +
    "    }).catch((e)=>{\n" +
    "        postMessage({key, result:e});\n" +
    "    });\n" +
    "}\n" +
    "\n" +
    "\n" +
    "async function callFunction(fn, state,args) {\n" +
    "    try{\n" +
    "        const func = fn.split('.').reduce((acc, cur)=>acc ? acc[cur] : undefined, this);\n" +
    "        if(func){\n" +
    "            const data = await func(state,args);\n" +
    "            return {data}\n" +
    "        }else{\n" +
    "            return {error:\"Undefined function \"+fn}\n" +
    "        }\n" +
    "    }catch(err){\n" +
    "        console.log('got error', err);\n" +
    "        return {error:err.toString()}\n" +
    "    }\n" +
    "}\n";
