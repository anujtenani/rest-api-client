import React, {Component} from 'react';

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
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/foldgutter.css'

export default class PreviewJson extends Component {


    render() {
        return (
            <div className="w-full h-full">
                <CodeMirror options={{
                    mode:{name:'javascript', mode:'json'},
                    lineWrapping:true,
                    lineNumbers:true,
                    readOnly:true,
                    viewportMargin:Infinity,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                }} value={JSON.stringify(JSON.parse(this.props.responseBody), null, 2)}  />
            </div>
        );
    }
}
