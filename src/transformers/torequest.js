import {buildUrlFromRequestState} from "../helpers/func";
import * as basic from '../helpers/auth/basic';
import * as digest from '../helpers/auth/digest';
import * as hawk from '../helpers/auth/hawk';
import WebWorker from "../helpers/worker/WebWorker";

export default async (state, requestId)=>{
    const varId = state.env.variableAllIds.find((item)=>{
        return state.env.variableById[item].name === "baseurl";
    });

    const baseurl = varId ? state.env.envVariableMap[varId][state.env.activeEnv] : '';

    let {url, method, headers, body, auth, qs, path} = state.requests.byId[requestId];

    const h = {};

    const worker = new WebWorker(state);

    url = await substituteValuesInVariables(url, worker, state);

    headers.allIds.forEach((id)=>{
        const {name, value} = headers.byId[id];
        h[name] = value;
    });

    url = baseurl+buildUrlFromRequestState(url, qs, path);

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




function substituteValuesInVariables(line, worker, state){
    const matches = line.match(/{{(.*?)}}/g);
    if (matches) {
        const fn = matches.map((item) => {
            return item.replace("{{", '').replace("}}", '');
        });
        console.log(fn);
        const promises = fn.map((fn) => {
            return worker.callFunction(fn, state);
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
