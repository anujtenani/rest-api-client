import {callFunction} from "../helpers/worker/WorkerHelper";

export default (request)=>{
    const {url, method, headers, body, auth, qs} = request;
    const h = {};
    headers.allIds.forEach((id)=>{
        const {name, value} = headers.byId[id];
        h[name] = value;
    });
    const queryString = {};
    qs.allIds.forEach((id)=>{
        const {name, value} = qs.byId[id];
        queryString[name] = value;
    });

    const b = {};
    body.allIds.forEach((id)=>{
        const {name, value} = body.byId[id];
        b[name] = value;
    });

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
        url,
        method,
        headers:h,
        form:b,
        queryString,
        auth:a
    }
    console.log(ret);
    return ret;
}


