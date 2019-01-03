import {callFunction} from "../helpers/worker/WorkerHelper";
import url from 'url';
import {buildUrlFromRequestState} from "../helpers/func";
export default async (request)=>{
    let {url, method, headers, body, auth, qs} = request;
    const h = {};

    url = await substituteValuesInVariables(url);


    headers.allIds.forEach((id)=>{
        const {name, value} = headers.byId[id];
        h[name] = value;
    });


    url = buildUrlFromRequestState(url, qs);
    console.log(url);

    const {authType} = auth;
    let a = {}
    switch (authType) {
        case "basic":
            a = {username:auth.username, password:auth.password};
            break;
        case "digest":
            a = {username:auth.username, password: auth.password, sendImmediately: true};
            break;
        default:
            a = undefined
    }

    const ret =  {
        url: url.startsWith('http') ? url : `http://`+url,
        method,
        headers:h,
        body,
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
