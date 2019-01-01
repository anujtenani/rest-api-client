const fn = {
    timestamp: "async () => await new Promise((resolve, reject) => resolve(new Date().getTime()))",
    custom: "async ()=> 10",
    variable: "async ()=> await timestamp()/1000",
    hash: "async (params)=> await fetch('http://localhost:8090/helper/hash',{method:'POST', body: JSON.stringify(params), headers:{ 'Content-Type': 'application/json'}}).then((response)=>response.text())",
    md5: "async (params) => hash({algo:'md5', data:params})",
    customfn: "async ()=> { const ts = await timestamp(); return md5(ts) }",
    faker:"async(key, func)=> await fetch('http://localhost:8090/helper/faker/'+key+'/'+func).then((response)=>response.text())",
}


var blobParts = [];
blobParts.push(Object.keys(fn).map((item)=>{
    return `${item} = ${fn[item]}`;
}));
blobParts.push( ['onmessage = async (e)=> postMessage(await this[e.data.fn](e.data.params))'])
const x = [];
x.push(blobParts.join(";"));


var blob = new Blob(x);
var worker = new Worker(window.URL.createObjectURL(blob));
worker.onmessage = (e)=>console.log(e);
worker.postMessage({namespace:'faker', fn:"hash", params:{algo:'sha256', data:'testing'}});
