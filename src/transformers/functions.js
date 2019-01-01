export default {
    timestamp:()=>new Date().getTime(),
    uuid:async ()=> await fetch('getuuid').then((response)=>response.text()),

}
