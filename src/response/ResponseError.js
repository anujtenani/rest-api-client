import React, {Component} from 'react';
import {connect} from 'react-redux';
/**
 * Only to be shown when the http request fails
 * HTTP response with error status codes eg. 500 or 403 are response success
 */
class ResponseError extends Component {


    render() {
        const {code, hostname, port, message, url, method} = this.props;
        switch (code) {
            case "ENOTFOUND":
                return <ErrorENOTFOUND hostname={hostname} port={port} />;
            case "ECONNREFUSED":
                return <ErrorECONNREFUSED hostname={hostname} port={port} />;
            default:
                return <p className={"error-message text-center m-4"}>
                    <p>{message || "Unable to connect to"}</p>
                    <pre><span className={`tag--${method ? method.toLowerCase() : ''} mr-1`}>{method}</span>{url}</pre>
                </p>
        }
    }
}

function ErrorENOTFOUND({hostname, port}){
    return <p className={"error-message text-center m-4"}>
        DNS resolution failed on {hostname}
    </p>
}

function ErrorECONNREFUSED({hostname, port}){
    return <p className={"error-message text-center m-4"}>
        Unable to connect to {hostname} on port {port}
    </p>
}

const mapStateToProps = (state, props)=>{
    const {requestId, historyId} = props;
    return {
        ...state.requests.byId[requestId].history.byId[historyId].error
    }
}


export default connect(mapStateToProps)(ResponseError);
