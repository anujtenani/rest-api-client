import WebWorker from "../../helpers/worker/WebWorker";
import {getVariableMapForCurrentEnv, substituteValuesInVariables} from "./func";
import url from "url";
import store from "../../redux/store";
import * as basic from "../../helpers/auth/basic";
import * as digest from "../../helpers/auth/digest";
import * as hawk from "../../helpers/auth/hawk";

class RequestBuilder {

    worker;
    state;
    requestId;
    varmap;
    constructor(state, requestId){
         this.worker = new WebWorker(state);
         this.varmap = this.variableMapForCurrentEnv(state);
    }

    async buildHeaders(state, requestId, worker){
        const {headers} = state.requests.byId[requestId];

        const hdrs = headers.allIds.map((item)=>{
            const {name, value} = headers.byId[item];
            const n = this.substituteValuesInVariables(name);
            const v = this.substituteValuesInVariables(value);
            return Promise.all([n,v]);
        })

        const headerObj = await Promise.all(hdrs).then((result)=>{
            const obj = {}
            result.forEach((item)=>{
                const name = item[0];
                obj[name] = item[1];
            });
            return obj;
        });
        const authHeaders = await this.buildAuthHeaders(state, requestId, worker);
        return {...headerObj, ...authHeaders};
    }




    async buildAuthHeaders(auth, url, method){
        const {authType} = auth;
        switch (authType) {
            case "basic": {
                const username = await this.substituteValuesInVariables(auth.username);
                const password = await this.substituteValuesInVariables(auth.password);
                return {Authorization: basic.convertAuthToHeader(username, password)};
            }
            case "digest": {
                const username = await this.substituteValuesInVariables(auth.username);
                const password = await this.substituteValuesInVariables(auth.password);
                return {Authorization: await digest.convertAuthToHeader(url, method, username, password)}
            }
            case "bearer":
                const bearer = await this.substituteValuesInVariables(auth.bearer);
                return {Authorization : `Bearer ${bearer}`}
            case "hawk":
                //TODO substitute variables
                return {Authorization : hawk.convertAuthToHeader(url, method, auth.id, auth.key, auth.algorithm, auth.ext) }
            default:
                return {}
        }
    }



    buildUrl(requestId){
        const state = store.getState();
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
        const baseurl = this.varmap['baseurl'] || '';
        ur = baseurl+ur;
        ur = ur.startsWith('http') ? ur : `http://${ur}`;


        const parsedUrl = url.parse(ur, true);
        parsedUrl.query = {...parsedUrl.query, ...qs};
        parsedUrl.search = undefined;
        return this.substituteValuesInVariables(url.format(parsedUrl));
    }


    substituteValuesInVariables(line){
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
                return this.worker.callFunction(fn, this.state);
            });
            return Promise.all(promises).then((result) => {
                result.forEach(({data}, index) => {
                    line = line.replace('```' + fn[index] + '```', data);
                });
                return line;
            });
        } else {
            return Promise.resolve(line);
        }
    }


    variableMapForCurrentEnv(state){
        const {activeEnv, variableAllIds, variableById, envVariableMap} = state.env;
        const varmap = {}
        //generate variable map
        variableAllIds.forEach((id)=>{
            varmap[variableById[id].name] = envVariableMap[id][activeEnv];
        });
        return varmap;
    }

}
