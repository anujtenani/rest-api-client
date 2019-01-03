import OAuth  from 'oauth-1.0a';
import CryptoJS from 'crypto-js';

// Initialize

/**
 * @param consumerKey
 * @param consumerSecret
 * @param signatureMethod one of HMAC-SHA1 , HMAC-SHA256, PLAINTEXT
 * @returns {*}
 */
export function convertAuthToHeader(consumerKey, consumerSecret, signatureMethod, url, method, body, tokenKey, tokenSecret) {

    const oauth = OAuth({
        consumer: {
            key: consumerKey,
            secret: consumerSecret
        },
        signature_method: signatureMethod,
        hash_function(base_string, key) {
            switch (signatureMethod) {
                case "HMAC-SHA1":
                    return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
                case "HMAC-SHA256":
                    return CryptoJS.HmacSHA256(base_string, key).toString(CryptoJS.enc.Base64);
                default:
                    return base_string
            }
        }
    });
    const request_data = {
        url,
        method,
        data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' }
    };

    const token = {
        key: tokenKey,
        secret:tokenSecret
    };

    //data = oauth.authorize(request_data, token)
    return oauth.toHeader(oauth.authorize(request_data, token))
}
