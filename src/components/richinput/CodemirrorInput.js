import {Controlled as CodeMirror} from "react-codemirror2";
import React, {Component} from 'react';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/http/http';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/markdown/markdown';
import '../../css/codemirror.css';

import './codemirrormode.js';
import './codeinput.css';


class CodemirrorInput extends Component {


    state = {
        value:undefined
    }

    onChange = (value)=>{
        this.setState({value})
    }

    handleRef = (editor)=>{
        editor.on("beforeChange", function(instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            if(change.update) {
                change.update(change.from, change.to, [newtext]);
                return true;
            }else{
                return false;
            }
        });
        editor.on('mousedown',(instance, event)=>{
            console.log(event.target.className)
        })
    }

    //TODO fix this

    render() {
        const {value}  = this.state;
        return (
            <div>
                <CodeMirror onBeforeChange={this.onChange} options={{
                    mode:'mymode',
                    lineWrapping:false,
                    lineNumbers:false,
                    autoCloseBrackets:true,
                    lint:true,
                    viewportMargin:Infinity,
                    extraKeys: { "Tab": false, "Shift-Tab": false, "Enter": false }
                }} value={this.state.value}
                    onChange={this.onChange}
                    defaultValue={value} />
            </div>
        );
    }
}

export default CodemirrorInput;
