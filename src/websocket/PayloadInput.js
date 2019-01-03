import React, {Component} from 'react';
import CodeMirror from "react-codemirror";
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
window.JSHINT = JSHINT;
window.jsonlint = jsonlint;


class PayloadInput extends Component {

    state = {
        value:''
    }

    onChange = (value)=>{
        this.setState({value})
    }

    onFocusChange = (focused)=>{
        if(!focused){
//            this.props.updateBodyItem({value:this.state.value});
            console.log('send updates')
        }
    }

    render() {
        const {value} = this.props;
        return (
            <CodeMirror options={{
                mode:{name:'javascript', mode:'json'},
                lineWrapping:true,
                lineNumbers:true,
                autoCloseBrackets:true,
                lint:true,
                gutters: ["CodeMirror-lint-markers"],
                viewportMargin:Infinity
            }} value={this.state.value} onChange={this.onChange} onFocusChange={this.onFocusChange} defaultValue={value} />

        );
    }
}

export default PayloadInput;
