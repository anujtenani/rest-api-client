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

    url = baseurl+buildUrlFromRequestState(url, qs, path);

    const params = body.allIds.map((id)=>{
        return body.byId[id];
    });
    const {bodyType, data} = body;
    const hdrs = await getHeaders(state, requestId, worker);
    const {authType} = auth;
    let a = {}
    switch (authType) {
        case "basic":
            hdrs['Authorization'] = basic.convertAuthToHeader(auth.username, auth.password);
            break;
        case "digest":
            hdrs['Authorization'] = await digest.convertAuthToHeader(url, method, auth.username, auth.password);
            break;
        case "bearer":
            hdrs['Authorization'] = `Bearer `+ await substituteValuesInVariables(auth.bearer, worker, state);
            break;
        case "hawk":
            hdrs['Authorization'] = hawk.convertAuthToHeader(url, method, auth.id, auth.key, auth.algorithm, auth.ext);
            break;
        default:
            a = undefined
    }



    const ret =  {
        url: url.startsWith('http') ? url : `http://`+url,
        method,
        headers:hdrs,
        body : {params, bodyType, data},
    }
    console.log(ret);
    return ret;
}


function getHeaders(state, requestId, worker){
    const {headers} = state.requests.byId[requestId];

    const hdrs = headers.allIds.map((item)=>{
        const {name, value} = headers.byId[item];
        const n = substituteValuesInVariables(name, worker, state);
        const v = substituteValuesInVariables(value, worker, state);
        return Promise.all([n,v]);
    })

    const headerObj = {};
    return Promise.all(hdrs).then((result)=>{
        result.forEach((item)=>{
            const name = item[0];
            headerObj[name] = item[1];
        });
        return headerObj;
    })
}



function substituteValuesInVariables(line, worker, state){
    const matches = line.match(/```(.*?)```/g);
    if (matches) {
        const fn = matches.map((item) => {
            return item.replace("```", '').replace('```','');
        });
        console.log(fn);
        const promises = fn.map((fn) => {
            if(fn.includes("(")){
                //TODO make way for on demand functions eg. ```base.timestamp()``` directly in the field
                //convert this function to
            }
            return worker.callFunction(fn, state);
        });

        return Promise.all(promises).then((result) => {
            console.log('got sub result', result);
            result.forEach(({data}, index) => {
                line = line.replace('```' + fn[index] + '```', data);
            });
            return line;
        });
    } else {
        return Promise.resolve(line);
    }
}
