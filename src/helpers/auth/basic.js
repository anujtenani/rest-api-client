export function convertAuthToHeader(username, password){
    return Promise.resolve(`Authorization: Basic ${btoa(username+":"+password)}`);
}
