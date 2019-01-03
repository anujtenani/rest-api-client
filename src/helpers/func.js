import url from "url";

export function getHeaderFromObject(headerName, headerObject){
    const key = Object.keys(headerObject).find((headerKey) => headerKey.toLowerCase() === headerName.toLowerCase());
    return key ? headerObject[key] : '';
}

function buildUrl(uri, qs = {}){
    const parsedUrl = url.parse(uri, true);
    parsedUrl.query = {...parsedUrl.query, ...qs};
    parsedUrl.search = undefined;
    return url.format(parsedUrl);
}



export function buildUrlFromRequestState(url, qs){
    const qsObject = {};
    qs.allIds.forEach((qsId)=>{
        const {name, value} = qs.byId[qsId];
        qsObject[name] = value;
    });
    return buildUrl(url, qsObject);
}
