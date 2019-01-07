import React, {Component} from 'react';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import MarkdownInput from "../components/codemirror/MarkdownInput";
import {connect} from 'react-redux';
import {actionUpdateRequest} from "../redux/requestActions";
import Popup from "../components/Popup";
const ReactMarkdown = require('react-markdown')

class RequestSettings extends Component {

    handleBlur = (value)=>{
        this.props.updateRequest({comment: value});
    }

    render() {
        return (
            <div>
                <MarkdownInput onBlur={this.handleBlur} defaultValue={this.props.value} placeholder={"Request description. (markdown is supported)"}/>
                <ReactMarkdown source={this.props.value}/>
            </div>
        );
    }
}

const mapStateToProps = (state, props)=>{
    const {requestId} = props;
    return {
        value:state.requests.byId[requestId].comment
    }
}
const mapDispatchToProps = (dispatch, props)=>{
    const {requestId} = props;
    return{
        updateRequest:(change)=>dispatch(actionUpdateRequest(requestId, change))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RequestSettings);
