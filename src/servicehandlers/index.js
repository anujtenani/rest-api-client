import * as chrome from "./ChromeWrapper";

export function setItem(){

}


export function sendRequest(url, method, headers, body, qs, auth){
    return chrome.sendRequest(url, method, headers, body, qs, auth);
}

function isChrome(){
    return window.chrome;
}

function isChromeExtensionInstalled(){
    return new Promise((resolve, reject)=>{
        window.chrome.runtime.sendMessage(chrome.extensionId, {type:'ping'}, function(response) {
            if(response && response === "pong"){
                resolve(true)
            }else{
                resolve(false);
            }
        });
    })
}
