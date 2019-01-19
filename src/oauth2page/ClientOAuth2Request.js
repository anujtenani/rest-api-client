import {sendRequest} from "../servicehandlers";

export default function request(method, url, body, headers){
    return sendRequest(url, method, headers, body)
}
