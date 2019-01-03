import * as shortId from 'shortid';
import md5 from 'crypto-js/md5';
import url from 'url';
import {sendRequest} from "../../servicehandlers";
import {getHeaderFromObject} from "../func";

/*
   Authorization: Digest username="Mufasa",
       realm="testrealm@host.com",
       nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",
       uri="/dir/index.html",
       qop=auth,

       nc=00000001,
       cnonce="0a4f113b",
       response="6629fae49393a05397450978507c4ef1",

       opaque="5ccc069c403ebaf9f0171e9517f40e41"
*/
export const convertAuthToHeader = (uri, method, username, password)=>{
    const {path} = url.parse(url);
    return extractFromHeader(url, method).then((data)=>{
        const {realm, qop, nonce, opaque} = data;
        const HA1 = md5(`${username}:${realm}:${password}`);
        const HA2 = md5(`${method}:${path}`);
        const nc = "0000001"; //request counter
        const cnonce = shortId.generate(); //client nonce
        const response = md5([HA1, nonce, nc, cnonce, qop, HA2].join(":"));

        const map = {
            username, realm, nonce, uri: path, qop, nc, cnonce, response, opaque
        }
        return 'Authorization: Digest '+Object.keys(map).map((key)=>{
            return `${key}="${map[key]}"`;
        }).join(",");
    });


}


/*
header
WWW-Authenticate: Digest realm="testrealm@host.com",
    qop="auth,auth-int",
    nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",
    opaque="5ccc069c403ebaf9f0171e9517f40e41"
*/
function extractFromHeader(url, method){
    //call the url with method and look for a WWW-Authenticate Header
    return sendRequest(url, method).then((result)=>{
        const o = {};
        const {headers} = result;
        const authStr = getHeaderFromObject('www-authenticate', headers);
        if(authStr){
            const r = new RegExp(/([a-z]+)="(.*?)"/g);
            let m;
            do {
                m = r.exec(authStr);
                if (m) {
                    o[m[1]] = m[2];
                }
            } while (m);
        }
        return o;
    })
}
