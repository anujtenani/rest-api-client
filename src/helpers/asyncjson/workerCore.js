onmessage = async (e)=>{
    const {type, key} = e.data;
    switch (type) {
        case "stringify": {
            console.log("stringifying");
            const {data, replacer, space} = e.data;
            const result = JSON.stringify(data, replacer, space);
            return postMessage({key, result});
        }
        case "parse":
            console.log("parsing");
            const {data} = e.data;
            const result = JSON.parse(data);
            console.log('posting message');
            return postMessage({key, result});
    }
    return postMessage({key, error:'Invalid Type'});
}
