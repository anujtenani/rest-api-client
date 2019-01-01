const fn = {
    timestamp: "async () =>  Promise.resolve(new Date().getTime()))",
    get: "async ()=> fetch(url).then((r)=>r.text())",

    custom: "async ()=> 10",
    variable: "async ()=> await timestamp()/1000",
    hash: "async (params)=> await fetch('http://localhost:8090/helper/hash',{method:'POST', body: JSON.stringify(params), headers:{ 'Content-Type': 'application/json'}}).then((response)=>response.text())",
    md5: "async (params) => hash({algo:'md5', data:params})",
    customfn: "async ()=> { const ts = await timestamp(); return md5(ts) }",
    faker:"async(key, func)=> await fetch('http://localhost:8090/helper/faker/'+key+'/'+func).then((response)=>response.text())",
}

