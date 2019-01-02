export const extensionId = "olgnlmioekgfimpdfalfjbnccaihngec"; //TODO keep this extension updated with chrome extension

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


export function sendRequest(url, method, headers, body, qs, auth){
    const type = "request.send";
    const payload = {url, method, body, headers, qs, auth};
    return sendMessageToExtension({type, payload});
}


function sendMessageToExtension(data){
    return new Promise((resolve, reject)=>{
        window.chrome.runtime.sendMessage(extensionId, data, function(response) {
            resolve(response);
        });
    })
}