//TODO
function doImport(json){
    //get verson
    const oasv = json.openapi

    const {title, description, terms, contact, licence, version} = json.info;

    const {paths} = json;
    const endpoints = Object.keys(paths);
    endpoints.forEach((endpoint)=>{
        const methods = Object.keys(paths[endpoint]);
        methods.forEach((m)=>{
            const {tags, summary, operationId, requestBody, responses, security, parameters} = paths[endpoint][m];
        })
    })
}
