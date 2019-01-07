import React from 'react';
import {connect} from 'react-redux';
import CodeMirror from 'react-codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/theme/monokai.css';
import '../../css/codemirror.css';
import jsonlint from 'jsonlint-mod';
import { JSHINT } from 'jshint';
import {actionUpdateBodyData, actionUpdateBodyItem} from "../../redux/body/bodyActions";
import JavascriptInput from "../../components/codemirror/JavascriptInput";

window.JSHINT = JSHINT
window.jsonlint = jsonlint;

class RequestBodyJson extends React.Component{

    state = {
        value:undefined
    }

    onChange = (value)=>{
        this.setState({value})
    }

    onFocusChange = (focused)=>{
        if(!focused){
            this.props.updateBody(this.state.value)
            console.log('send updates')
        }
    }

    onBlur = (value)=>{
        this.props.updateBody(value);
    }


    render(){
        const {value} = this.props;
        console.log(this.props, this.state);
        return <JavascriptInput onBlur={this.onBlur} defaultValue={value || ''} />
    }
}


function mapStateToProps(state, props){
    const {requestId} = props;
    return {
         value: state.requests.byId[requestId].body.data
    }
}
function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBody: (data)=> dispatch(actionUpdateBodyData(requestId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestBodyJson);
