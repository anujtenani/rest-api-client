import * as chrome from "./ChromeWrapper";
import * as firefox from './FirefoxWrapper';
import {isChrome, isFirefox} from "./BrowserDetector";


export function extensionInstalled(){
    return new Promise((resolve, reject)=>{
        //wait for a few seconds for the extension to become alive so to speak
        setTimeout(()=>{
            if(isChrome){
                chrome.extensionInstalled().then((e)=>{
                    if(e){
                        resolve();
                    }
                    console.log('got result', e);
                })
            }else if(isFirefox){
                console.log('testing firefox for extension');
                firefox.extensionInstalled().then((e)=>{
                    if(e){
                        resolve();
                    }
                    console.log('got result', e);
                })
            }
        }, 2000);
    })
}

export function sendRequest(url, method, headers, body, qs, auth) {
    if (isChrome) {
        return chrome.sendRequest(url, method, headers, body, qs, auth);
    } else if (isFirefox) {
        return firefox.sendRequest(url, method, headers, body, qs, auth);
    }else {
        throw new Error('No extension found');
    }
}



export function setItem(key, value){
    if (isChrome) {
        console.log('setting state', key, value);
        return chrome.setItem(key, value);
    } else if (isFirefox) {
        return firefox.setItem(key, value);
    }else {
        throw new Error('No extension found');
    }
}
export function getItem(key){
    if (isChrome) {
        console.log('getting state', key);
        return chrome.getItem(key);
    } else if (isFirefox) {
        return firefox.getItem(key);
    }else {
        throw new Error('No extension found');
    }
}

export function removeItem(key){
    if (isChrome) {
        return chrome.removeItem(key);
    } else if (isFirefox) {
        return firefox.removeItem(key);
    }else {
        throw new Error('No extension found');
    }
}

