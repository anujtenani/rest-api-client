import * as shortId from "shortid";

export function setItem(key, value){
    const type = "storage.set";
    const payload = {key, value};
    return sendMessageToExtension({type, payload});
}


export function getItem(key){
    const type = "storage.get";
    const payload = {key};
    return sendMessageToExtension({type, payload});
}

export function removeItem(key){
    const type = "storage.remove";
    const payload = {key};
    return sendMessageToExtension({type, payload});
}



export function sendRequest(url, method, headers, body, bodyType){
    const type = "request.send";
    const payload = {url, method, body, headers, bodyType};
    return sendMessageToExtension({type, payload});
}


function sendMessageToExtension(data){
    return new Promise((resolve, reject)=>{
        const key  = shortId.generate();
        pendingResponses[key] = resolve;
        window.postMessage({...data, key, origin:"page"}, "*");
    })
}
var pendingResponses = {};
window.addEventListener("message", function(event) {
   const { data } = event;
   if(data.origin === "extension") {
       if (data.key) {
           pendingResponses[data.key](data.result);
       }
   }
});


export function extensionInstalled(){
    return sendMessageToExtension({type:'ping'})
}

export function openOauthTab(url, redirectUri){
    const type = "open.oauth.tab";
    const payload = {url, redirectUri};
    return sendMessageToExtension({type, payload});
}
