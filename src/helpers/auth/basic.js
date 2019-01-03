export function convertAuthToHeader(username, password){
    return Promise.resolve(`Basic ${btoa(username+":"+password)}`);
}
