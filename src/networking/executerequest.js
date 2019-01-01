import * as request from 'request';


function testCall(){
    request({
        url:'http://localhost:8090/test/html',
        method:'GET'
    }, (err, httpResponse, body)=>{
        console.log(err);
        console.log(httpResponse);
        console.log(body);
    });
}

export default testCall()
