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
import {actionUpdateBodyItem} from "../../redux/body/bodyActions";

window.JSHINT = JSHINT
window.jsonlint = jsonlint

class RequestBodyJson extends React.Component{

    state = {
        value:undefined
    }

    onChange = (value)=>{
        this.setState({value})
    }

    onFocusChange = (focused)=>{
        if(!focused){
            this.props.updateBodyItem({value:this.state.value})
            console.log('send updates')
        }
    }


    render(){
        const {value} = this.props;
        console.log(this.props, this.state);
        return <CodeMirror options={{
            mode:{name:'javascript', mode:'json'},
            theme:"monokai",
            lineWrapping:true,
            lineNumbers:true,
            autoCloseBrackets:true,
            lint:true,
            gutters: ["CodeMirror-lint-markers"],
            viewportMargin:Infinity
        }} value={this.state.value} onChange={this.onChange} onFocusChange={this.onFocusChange} defaultValue={value} />
    }
}


function mapStateToProps(state, props){
    const {requestId} = props;
    return {
         value: state.requests.byId[requestId].body.byId['json'].value
    }
}
function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBodyItem:(change)=>dispatch(actionUpdateBodyItem(requestId, "json", change))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestBodyJson);
