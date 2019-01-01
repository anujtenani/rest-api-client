import {fn} from "./test";


export function getWorkerObjectUrl(store){
    const blob = new Blob([customFunctions(store), workerCore]);
    return window.URL.createObjectURL(blob);
}


const customFunctions = (store = fn)=>{
    var blobParts = [];
    blobParts.push(Object.keys(fn).map((item)=>{
        return `${item} = ${fn[item]}`;
    }));
    blobParts.join(';');
    return blobParts+";";
}


const workerCore = "onmessage = async (e)=>{\n" +
    "    const {key, fn, args} = e.data;\n" +
    "    try{\n" +
    "        if(this[fn]){\n" +
    "            const data = await this[fn](args);\n" +
    "            postMessage({key, result:{data}});\n" +
    "        }else{\n" +
    "            postMessage({key, result:{error:\"Undefined function \"+fn}});\n" +
    "        }\n" +
    "    }catch(e){\n" +
    "        postMessage({key, error:e});\n" +
    "    }\n" +
    "}";
