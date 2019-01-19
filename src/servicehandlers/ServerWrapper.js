import {serverProxyUrl} from "../config";

export function sendRequest(url, method, headers, body){
    const payload = {url, method, body, headers};
    return fetch(serverProxyUrl,{
        method:'POST',
        body: JSON.stringify(payload),
        headers:{
            'Content-Type':'application/json'
        }
    }).then((res)=>{
        return res.json();
    })
//    return sendMessageToExtension({type, payload});
}


export function setItem(key, value){
    if(typeof  value === "object"){ //FIX sometimes the value is passed as a json object
        value = JSON.stringify(value);
    }
    return Promise.resolve(localStorage.setItem(key, value));
}

export function getItem(key){
    return   Promise.resolve(localStorage.getItem(key));
}
export function removeItem(key){
    return  Promise.resolve(localStorage.removeItem(key));
}

export function oauth2TabManager(uri, redirectUri){
    return new Promise((resolve, reject)=>{
        this.externalWindow = window.open(uri, `width=400,height=600`);
        this.externalWindow.onbeforeunload = () => {
            this.onClose();
            clearInterval(this.codeCheck);
        };
        this.codeCheck = setInterval(async () => {
            try {
                console.log(this.externalWindow);
                if(this.externalWindow.closed){
                    clearInterval(this.codeCheck);
                    reject();
                    return;
                }
                clearInterval(this.codeCheck);
                this.externalWindow.close();
                resolve(this.externalWindow.location.href);
            }
            catch (e) {
                console.log(e);
            }
        }, 200);
    });

}
