import UrlParser from "url";

export function getHeaderFromObject(headerName, headerObject){
    const key = Object.keys(headerObject).find((headerKey) => headerKey.toLowerCase() === headerName.toLowerCase());
    return key ? headerObject[key] : '';
}


/**
 * This function checks for a change in url to update the UrlPreview and RequestBodyGraphql component
 * @param state
 * @param requestId
 * @returns {*}
 */
export function basicUrlBuilder(state, requestId){
    const request = state.requests.byId[requestId];
    const {path, qs, url} = request;
    let ur = url;
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
    const varmap = variableMapForCurrentEnv(state) || {};
    const baseurl = varmap['baseurl'] || '';
    ur = baseurl+ur;
    ur = ur.startsWith('http') ? ur : `http://${ur}`;

    const parsedUrl = UrlParser.parse(ur, true);
    parsedUrl.query = {...parsedUrl.query, ...qsObject};
    parsedUrl.search = undefined;
    return UrlParser.format(parsedUrl)
}

function variableMapForCurrentEnv(state){
    const {activeEnv, variableAllIds, variableById, envVariableMap} = state.env;
    const varmap = {}
    //generate variable map
    variableAllIds.forEach((id)=>{
        varmap[variableById[id].name] = envVariableMap[id][activeEnv];
    });
    return varmap;
}

export function promiseTimeout(ms, promise){
    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in '+ ms + 'ms.')
        }, ms)
    });
    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ]);
}


export function getProjectName(){
    return document.location.pathname.split("/")[2];
}
