const mime = require('mime-types');

/**
 * Helper function to retrieve a particular header by its key
 * @param key
 * @param headersObject
 * @returns {undefined}
 */
function getHeader(key, headersObject){
    const headerKey = Object.keys(headersObject).find((headerKey)=> headerKey.toLowerCase() === key.toLowerCase());
    return  headerKey ? headersObject[headerKey][0] : undefined;
}

/**
 * Checks if content-type header has a charset of utf-8
 * This is used to determine if the response body should be decoded as string or as as dataURI
 * @param headers
 */
function charsetFromHeaders(headers){
    const contentType = getHeader('content-type', headers);
    console.log('charset for content type', contentType);
    return mime.charset(contentType);
}

/**
 * Since we get BLOB from XMLHTTPRequests. Blobs have a type property which tells the mimetype of that blob
 * for eg. an image blob from XMLHTTPRequest will have a blob.type = "image/jpg" and similarly a text file will have a blob type of "text/html"
 * This functions simply tests if a particular blob.type should be decoded as string or as datauri
 * @param mimetype
 */
function charsetFromType(mimetype){
    return mime.charset(mimetype)
}

module.exports = {
    charsetFromHeaders, charsetFromType, getHeader
}
