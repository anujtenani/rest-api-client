import {callFunction} from "../helpers/worker/WorkerHelper";
import {buildUrlFromRequestState} from "../helpers/func";
import * as basic from '../helpers/auth/basic';
import * as digest from '../helpers/auth/digest';
import * as hawk from '../helpers/auth/hawk';
export default async (request)=>{
    let {url, method, headers, body, auth, qs} = request;
    const h = {};

    url = await substituteValuesInVariables(url);


    headers.allIds.forEach((id)=>{
        const {name, value} = headers.byId[id];
        h[name] = value;
    });

    url = buildUrlFromRequestState(url, qs);

    const params = body.allIds.map((id)=>{
        return body.byId[id];
    });
    const {bodyType, data} = body;

    const {authType} = auth;
    let a = {}
    switch (authType) {
        case "basic":
            headers['Authorization'] = basic.convertAuthToHeader(auth.username, auth.password);
            break;
        case "digest":
            headers['Authorization'] = await digest.convertAuthToHeader(url, method, auth.username, auth.password);
            break;
        case "bearer":
            headers['Authorization'] = `Bearer `+auth.token;
            break;
        case "hawk":
            headers['Authorization'] = hawk.convertAuthToHeader(url, method, auth.id, auth.key, auth.algorithm, auth.ext);
            break;
        default:
            a = undefined
    }

    const ret =  {
        url: url.startsWith('http') ? url : `http://`+url,
        method,
        headers:h,
        body : {params, bodyType, data},
        auth:a
    }
    console.log(ret);
    return ret;
}




function substituteValuesInVariables(line){
    const matches = line.match(/{{(.*?)}}/g);
    if (matches) {
        const fn = matches.map((item) => {
            return item.replace("{{", '').replace("}}", '');
        });
        console.log(fn);
        const promises = fn.map((fn) => {
            return callFunction(fn, '');
        });

        return Promise.all(promises).then((result) => {
            result.forEach(({data}, index) => {
                line = line.replace('{{' + fn[index] + '}}', data);
            });
            return line;
        });
    } else {
        return Promise.resolve(line);
    }
}
