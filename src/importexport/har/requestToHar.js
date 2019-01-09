
export function requestToHarObject(request){
    const {method, url, comment} = request;
    console.log(request);
    let headers = request.headers.allIds.map((headerId)=>{
        const {name, value, comment} = request.headers.byId[headerId];
        return {name, value, comment};
    })

    const queryString = request.qs.allIds.map((queryId)=>{
        const {name, value} = request.qs.byId[queryId];
        return {name, value}
    });
    const {body} = request;
    const {bodyType, data, byId, allIds} = body;
    let p = {}
    switch (bodyType) {
        case "json":
        case "graphql":
            headers['Content-Type'] = "application/json";
            p = { text: data, mimeType:"application/json"}
            break
        case "text":
            headers['Content-Type'] = "text/plain";
            p = {text: data, mimeType:"text/plain"}
            break;
        case "form":
            headers['Content-Type'] = 'application/x-www-url-formencoded';
            p = { params: allIds.map((id)=> {
                const {name, value} = byId[id];
                return {name, value}
            }), mimeType:'application/x-www-url-formencoded'};
            break;
        case "multipart":
            p = { params: allIds.map((id)=> {
                    const {name, value, fileName, type} = byId[id];
                    return {name, value, fileName, contentType: type}
            }), mimeType:'multipart/form-data'};
            break;
        default:
            p = undefined;
    }

    return {
        method,
        url,
        "httpVersion": "HTTP/1.1",
        "cookies": [],
        headers,
        queryString,
        postData:p,
        p,
        "headersSize" : 0,
        "bodySize" : 0,
        comment
    }
}
