
import * as har from './har/index'

export function doImport(data, importFormat="har"){
    switch (importFormat) {
        case "har":
            return har.doImport(JSON.parse(data));
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
