import React, {Component} from 'react';
import HTTPSnippet from 'httpsnippet';
import {connect} from 'react-redux';
import {requestToHarObject} from "../importexport/har/requestToHar";

class GenerateCode extends Component {





    render() {
        console.log(this.props);
        if(this.props.url) {
            const harObj = requestToHarObject(this.props);
            console.log(harObj);
            const snippet = new HTTPSnippet(harObj);
            return (
                <div>
                    {snippet.convert("shell", 'curl', {indent: '\t'})}
                </div>
            );
        }else{
            return null;
        }
    }
}

const mapStateToProps = (state, props)=>{
    const {requestId} = props;
    console.log('mapping', requestId, state.requests.byId[requestId]);
    return {
        ...state.requests.byId[requestId]
    }
}



export default connect(mapStateToProps)(GenerateCode);
