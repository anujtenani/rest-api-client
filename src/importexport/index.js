
import * as har from './har/index'

export function doImport(data, importFormat){
    const obj = JSON.parse(data);
    if(!importFormat){
        if(obj.log){
            importFormat = "har";
        }else if(obj.requests){
            importFormat = "native";
        }
    }
    switch (importFormat) {
        case "har":
            return har.doImport(obj);
        case "native":
            return obj.requests.allIds.map((id)=>obj.requests.byId[id]);
            //merge state with this state;
        default:
            return []
    }

}


export function doExport(data, exportFormat="native"){
    switch (exportFormat) {
        case "native":
            return JSON.stringify(data);
        case "har":
            return JSON.stringify(har.doExport(data));
        default:
            return {}
    }
}
