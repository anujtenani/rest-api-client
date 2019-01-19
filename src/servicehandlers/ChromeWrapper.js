export const extensionId = "ohalacbnhbfllngjcgnejjdgmhbkcnld"; //TODO keep this extension updated with chrome extension

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



export function sendRequest(url, method, headers, body){
    const type = "request.send";
    const payload = {url, method, body, headers};
    return sendMessageToExtension({type, payload});
}


function sendMessageToExtension(data){
    return new Promise((resolve, reject)=>{
        window.chrome.runtime.sendMessage(extensionId, data, function(response) {
            resolve(response);
        });
    })
}

export function extensionInstalled(){
    return sendMessageToExtension({type:'ping'})
}

export function openOauthTab(url, redirectUri){
    const type = "open.oauth.tab";
    const payload = {url, redirectUri};
    return sendMessageToExtension({type, payload});
}


export function getInAppPurchases(){
    return sendMessageToExtension({type:'inapp-sku-details'})
}

export function getUserPurchases(){
    return sendMessageToExtension({type:'inapp-get-purchases'});
}
export function buyItem(sku){
    return sendMessageToExtension({type:'inapp-buy', sku});
}
/*

buyItem('cloud.sync.basic').then((e)=>{
    console.log('purchase result',e);
}).then(()=>{
    return getUserPurchases().then((result)=>{
        console.log(result);
    })
})


getInAppPurchases().then((result)=>{
    const {response} =result;
    const {details} = response || {};
    const {inAppProducts} = details || {};
    inAppProducts.filter(({state})=>state === "ACTIVE").forEach(({sku, prices, localeData})=>{
        console.log(sku, prices, localeData);
    });
   // console.log(result);
})

*/
