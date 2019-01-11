import React, {Component} from 'react';
import MethodSelector from "./MethodSelector";
import URLInput from "./URLInput";
import {actionExecuteRequest} from "../../redux/requestActions";
import {connect} from 'react-redux';
import {FiPlay} from "react-icons/fi";

class RequestURL extends Component{

    testSend = ()=>{
        this.props.executeRequest()
    }

    render(){
        const {requestId} = this.props
        return <div className="h-12 primary-bg flex flex-row items-center border-b border-dashed primary-border">
            <MethodSelector requestId={requestId}/>
            <URLInput requestId={requestId}/>
            <SendButton onClick={this.testSend} />
        </div>
    }
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props
    return {
        executeRequest:()=>dispatch(actionExecuteRequest(requestId))
    }
}

export default connect(null, mapDispatchToProps)(RequestURL);

function SendButton({onClick}){
   return <button className="primary-button p-3 text-xl" onClick={onClick}><FiPlay /></button>
}
