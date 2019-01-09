import React, {Component} from 'react';
import {UnControlled as CodeMirror } from "react-codemirror2";
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


    onBlur = (editor, event)=>{
        this.props.updateBodyItem({value:editor.getValue()});
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
            }} onBlur={this.onBlur} value={value} />

        );
    }
}

export default PayloadInput;
