import {substituteValuesInVariables} from "./func";
import * as basic from "../../helpers/auth/basic";
import * as digest from "../../helpers/auth/digest";
import * as hawk from "../../helpers/auth/hawk";

export async function getHeaders(state, requestId, worker){
    const {headers} = state.requests.byId[requestId];

    const hdrs = headers.allIds.map((item)=>{
        const {name, value} = headers.byId[item];
        const n = substituteValuesInVariables(name, worker, state);
        const v = substituteValuesInVariables(value, worker, state);
        return Promise.all([n,v]);
    })

    const headerObj = await Promise.all(hdrs).then((result)=>{
        const obj = {}
        result.forEach((item)=>{
            const name = item[0];
            obj[name] = item[1];
        });
        return obj;
    })
    const authHeaders = await buildAuthHeaders(state, requestId, worker);
    return {...headerObj, ...authHeaders};
}




async function buildAuthHeaders(state, requestId, worker){
    const {auth, url, method} = state.requests.byId[requestId];
    const {authType} = auth;
    switch (authType) {
        case "basic": {
            const username = await substituteValuesInVariables(auth.username, worker, state);
            const password = await substituteValuesInVariables(auth.password, worker, state);
            return {Authorization: basic.convertAuthToHeader(username, password)};
        }
        case "digest": {
            const username = await substituteValuesInVariables(auth.username, worker, state);
            const password = await substituteValuesInVariables(auth.password, worker, state);
            return {Authorization: await digest.convertAuthToHeader(url, method, username, password)}
        }
        case "bearer":
            const bearer = await substituteValuesInVariables(auth.bearer, worker, state);
            return {Authorization : `Bearer ${bearer}`}
        case "hawk":
            //TODO substitute variables
            return {Authorization : hawk.convertAuthToHeader(url, method, auth.id, auth.key, auth.algorithm, auth.ext) }
        default:
          return {}
    }
}
