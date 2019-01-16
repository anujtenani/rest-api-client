import store from '../redux/store';
import WebWorker from "../helpers/worker/WebWorker";
import url from "url";
import {substituteValuesInVariables} from "./requestbuilder/func";

export default async (state, requestId)=>{
    const varId = state.env.variableAllIds.find((item)=>{
        return state.env.variableById[item].name === "baseurl";
    });

    console.log('active env', state.env.activeEnv, state.env.envVariableMap[varId]);

    let {url, method, headers, body, auth, qs, path} = state.requests.byId[requestId];

    const h = {};

    const worker = new WebWorker(state);

    url = await createUrl(requestId, worker);
    console.log('url created', url);
    const params = body.allIds.map((id)=>{
        return body.byId[id];
    });
    const {bodyType, data} = body;


    const ret =  {
        url,
        method,
        //headers:hdrs,
        body : {params, bodyType, data},
    }
    console.log(ret);
    return ret;
}



//TODO to be replaced with worker code
export function createUrl(requestId, worker){
    const state = store.getState();
    const request = state.requests.byId[requestId];
    const {path, qs} = request;
    let ur = request.url;
    const qsObject = {};
    qs.allIds.forEach((qsId)=>{
        const {name, value} = qs.byId[qsId];
        qsObject[name] = value;
    });
    if(path && path.allIds){
        path.allIds.forEach((pathId)=>{
            const {name, value} = path.byId[pathId];
            ur = ur.split(name).join(value);
        });
    }
    const baseurl = '';
    ur = baseurl+ur;
    ur = ur.startsWith('http') ? ur : `http://${ur}`;


    const parsedUrl = url.parse(ur, true);
    parsedUrl.query = {...parsedUrl.query, ...qsObject};
    parsedUrl.search = undefined;
    return url.format(parsedUrl);
}



