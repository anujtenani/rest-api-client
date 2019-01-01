import CodeMirror from "react-codemirror";
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

    handleRef = (ref)=>{
        this.codemirror =ref;
        this.codemirror.getCodeMirror().on("beforeChange", function(instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            if(change.update) {
                change.update(change.from, change.to, [newtext]);
                return true;
            }else{
                return false;
            }
        });
        this.codemirror.getCodeMirror().on('mousedown',(instance, event)=>{
            console.log(event.target.className)
        })
    }


    render() {
        const {value}  = this.state;
        return (
            <div>
                <CodeMirror ref={this.handleRef} options={{
                    mode:'mymode',
                    lineWrapping:false,
                    lineNumbers:false,
                    autoCloseBrackets:true,
                    lint:true,
                    viewportMargin:Infinity,
                    extraKeys: { "Tab": false, "Shift-Tab": false, "Enter": false }
                }} value={this.state.value}
                            onChange={this.onChange}
                            defaultValue={value} />z
            </div>
        );
    }
}

export default CodemirrorInput;
