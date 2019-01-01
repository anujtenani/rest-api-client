fetchFaker = async(key, func)=> await fetch(`http://localhost:8090/helper/faker/${key}/${func}`).then((response)=>response.text());
fetchHash =  async (params)=> await fetch('http://localhost:8090/helper/hash',{method:'POST', body: JSON.stringify(params), headers:{ 'Content-Type': 'application/json'}}).then((response)=>response.text());
testFunction = async(params)=> await params.fn();

onmessage = async (e)=> {
    console.log(e);
    try {
        const f = e.data.fn.split('.');
        const args = e.data.args;
        const res = f.reduce((obj, key)=>obj[key], this);
        console.log(res, args);
        if(typeof(args) === 'function') {
            const data = await res(args);
            postMessage(data);
        }else{
            postMessage(typeof(args))
        }
    }catch(e){
        postMessage(e);
    }
}

faker = {
    name:{
        firstName: async ()=> fetchFaker('name', 'firstName')
    }
}

crypto = {
    hash:{
        md5: async (data) => fetchHash({algo:'md5', data})
    }
}
