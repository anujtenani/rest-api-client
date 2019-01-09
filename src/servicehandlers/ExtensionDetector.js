import * as chrome from "./ChromeWrapper";

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
