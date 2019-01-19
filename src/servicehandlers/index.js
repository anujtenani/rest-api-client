import * as chrome from "./ChromeWrapper";
import * as firefox from './FirefoxWrapper';
import * as server from './ServerWrapper';

import {isChrome, isFirefox} from "./BrowserDetector";
import {promiseTimeout} from "../helpers/func";

var hasExtension = false;
extensionInstalled();

export function extensionInstalled(){
    return promiseTimeout(1000, new Promise((resolve, reject)=>{
        //wait for a few seconds for the extension to become alive so to speak
        setTimeout(()=>{
            if(isChrome){
                chrome.extensionInstalled().then((e)=>{
                    if(e){
                        hasExtension = true;
                        resolve();
                    }
                    console.log('got result', e);
                })
            }else if(isFirefox){
                console.log('testing firefox for extension');
                firefox.extensionInstalled().then((e)=>{
                    if(e){
                        hasExtension = true;
                        resolve();
                    }
                    console.log('got result', e);
                })
            }
        }, 500);
    }))
}

export function sendRequest(url, method, headers, body) {
    if (isChrome && hasExtension) {
        return chrome.sendRequest(url, method, headers, body);
    } else if (isFirefox && hasExtension) {
        return firefox.sendRequest(url, method, headers, body);
    }else {
        return server.sendRequest(url, method, headers, body);
    }
}



export function setItem(key, value){
    if (isChrome && hasExtension) {
        return chrome.setItem(key, value);
    } else if (isFirefox && hasExtension) {
        return firefox.setItem(key, value);
    }else {
        return server.setItem(key, value);
    }
}
export function getItem(key){
    if (isChrome) { //TODO fix checking of extension
        return chrome.getItem(key);
    } else if (isFirefox && hasExtension) {
        return firefox.getItem(key);
    }else {
        return server.getItem(key);
    }
}

export function removeItem(key){
    if (isChrome && hasExtension) {
        return chrome.removeItem(key);
    } else if (isFirefox && hasExtension) {
        return firefox.removeItem(key);
    }else {
        return server.removeItem(key);
    }
}


export function oauth2TabManager(url, redirectUri){
    if(isChrome && hasExtension) {
        return chrome.openOauthTab(url, redirectUri)
    }else if(isFirefox && hasExtension){
        return firefox.openOauthTab(url, redirectUri)
    }else {
        return server.oauth2TabManager(url)
    }

}
