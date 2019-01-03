import Hawk from 'hawk';


export function convertAuthToHeader(url, method, id, key, algorithm = "sha256", ext=''){
    const credentials = {
        id, key, algorithm
    }
    const { header } = Hawk.client.header(url, method, { credentials: credentials, ext });
    return header;
}
