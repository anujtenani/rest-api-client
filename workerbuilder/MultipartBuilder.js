module.exports = MultipartBuilder;
function MultipartBuilder() {
    var boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
    }
    this.boundary = MultipartBuilder.boundary;
    this.LINE_BREAK = MultipartBuilder.LINE_BREAK;
    this.contentLength = MultipartBuilder.contentLength;
//    this.boundary = boundary;
//    console.log('boundary', this.boundary);
//    console.log('lb', this.LINE_BREAK);
}

MultipartBuilder.LINE_BREAK = '\r\n';
MultipartBuilder.contentLength = 0;
MultipartBuilder.boundary = '__X__BOUNDARY__';

MultipartBuilder.prototype.getContentTypeHeader = function(){
        return `Content-Type: multipart/form-data; charset=utf-8; boundary=${this.boundary}`
}

MultipartBuilder.prototype.getContentLengthHeader = function(){
        return `Content-Length: ${this.contentLength}`
}

MultipartBuilder.prototype.toBlob = function(params){
    //see if params have a file ?
    const parts = [];
    let blobMimeType = "text/plain";
    //build it as a blob and see if it has a mimetype of text/* if yes, return as string else return as blob
    params.forEach(({name, value, fileName, size, contentType})=>{
        console.log('rendering params', fileName, size, contentType);
        parts.push("--");
        parts.push(this.boundary);
        parts.push(this.LINE_BREAK);
        parts.push(getContentDisposition(name, fileName));
        parts.push(this.LINE_BREAK);
        if(fileName) {
            parts.push(getContentType(contentType))
            parts.push(this.LINE_BREAK);
        }
        parts.push(this.LINE_BREAK);
        if(fileName){
             blobMimeType = "application/octet-stream";
             parts.push(DataUriToBlob(value));
        }else{
            parts.push(value);
        }
        parts.push(this.LINE_BREAK);

    });
    parts.push('--');
    parts.push(this.boundary);
    parts.push('--');
    parts.push(this.LINE_BREAK);
    const blob =  new Blob(parts);
    this.contentLength = blob.size;
    console.log('blob size', blob.size);
    return blob;
};

MultipartBuilder.prototype.toString = function(params){
    return new Promise((resolve, reject)=>{
        const blob = this.toBlob(params);
        const reader = new FileReader();
        reader.onloadend = ()=>{
            resolve(reader.result);
        }
        reader.readAsBinaryString(blob);
    });
};

MultipartBuilder.prototype.toDataUrl = function(params){
    return new Promise((resolve, reject)=>{
        const blob = this.toBlob(params);
        const reader = new FileReader();
        reader.onloadend = ()=>{
            resolve(reader.result);
        }
        reader.readAsDataURL(blob);
    });
};

/** @ignore */
const getContentDisposition = (name, filename)=>{
    if(filename){
        return `Content-Disposition: form-data; name="${name}"; filename="${filename}"`
    }else{
        return `Content-Disposition: form-data; name="${name}"`
    }
}
/** @ignore */
const getContentType = (contentType)=>{
    console.log('adding content type', contentType);

    return `Content-Type: ${contentType || 'application/octet-stream'}`;
}
/** @ignore */
const DataUriToBlob = (dataURI) => {
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
