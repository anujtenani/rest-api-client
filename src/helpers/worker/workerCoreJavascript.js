/**
 * Playground for writing worker core javascript to be copy pasted later in BuildWorkerBlob file
 *
 * DO NOT USE toString()
 * See : https://stackoverflow.com/a/5265038
 */

onmessage = async (e)=>{
    const {key, fn, args} = e.data;
    try{
        if(this[fn]){
            const data = await this[fn](args);
            postMessage({key, result:{data}});
        }else{
            postMessage({key, result:{error:"Undefined function "+fn}});
        }
    }catch(e){
        postMessage({key, error:e});
    }
}
