import * as har from './har/importHar';


export default function doImport(data, importFormat="har"){
    switch (importFormat) {
        case "har":
            return har.doImport(JSON.parse(data));
        default:
            return []
    }

}
