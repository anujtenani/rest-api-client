/**
 * Converts blob to data uri so that it can displayed in the client
 * Most importantly data uris allow us to store the binary data in state (in serialized form)
 * @param blob
 * @returns {Promise<any>}
 * @constructor
 */
function BlobToDataUri(blob){
    return new Promise((resolve, reject)=>{
        var reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.onerror = (err)=>reject(err);
        reader.readAsDataURL(blob)
    });
}


/**
 * Converts blob received from XMLHTTPRequest to string
 * @param blob
 * @returns {Promise<any>}
 * @constructor
 */
function BlobToText(blob){
    return new Promise((resolve, reject)=>{
        var reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.onerror = (err)=>reject(err);
        reader.readAsText(blob)
    });

    Buffer.from()
}


/**
 * Converts DataURI received from client (where it is stored in the state) to a blob
 * On the client side the binary data (i.e. files/images etc.) are stored as data uri's in the redux state
 * TO send these dataURI's as multipart-form-body we have to convert them to BLOB
 * @param dataURI
 * @returns {Blob}
 * @constructor
 */
function DataUriToBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});
}


module.exports = {
    BlobToDataUri, BlobToText, DataUriToBlob
}
