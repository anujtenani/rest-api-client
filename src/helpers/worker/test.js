// define functions in an object;
export const fn = {
    'timestamp':'()=>Promise.resolve(new Date().getTime())',
    'timestampTimes':'async (multiplier)=> {' +
        'const z = await timestamp();' +
        '' +
        'return z * Number(multiplier) ' +
        '}',
    'localvar':'(args)=> {' +
        '   console.log(args, window);' +
        '   window[args[0]] = args[1];' +
        '   window[args[0]]' +
        '' +
        '}',
    'jointo':'(args)=> window[args[0]]'
};

//convert this object to a data url
var blobParts = [];
blobParts.push(Object.keys(fn).map((item)=>{
    return `${item} = ${fn[item]}`;
}));
const x = ['var window = self; onmessage = async (e)=> {\n' +
'   console.log(e);    ' +
'const {key, context, fn, args} = e.data;\n' +
'    // importScripts(context);\n' +
'    const result = await this[fn](args);\n' +
'    postMessage({key, result});\n' +
'}\n'];
x.push(blobParts.join(";"));
var blob = new Blob(x);
//create webworker import url or context;
const importUrl = window.URL.createObjectURL(blob);

//console.log(importUrl);
//now create a worker

/*

var worker = new Worker(importUrl);
worker.onmessage = (e)=> {
//    worker.terminate();
    console.log(e);
}
worker.postMessage({key:'localvar', fn:"localvar", args:['name','Anuj']});
worker.postMessage({key:'jointo', fn:"jointo", args:['name','Tenani']});
*/
