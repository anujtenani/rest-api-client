import React, {Component} from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/xml/xml';
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
import PropTypes from 'prop-types';
import AsyncJsonInterface from "../../helpers/asyncjson/AsyncJsonInterface";


export default class PreviewSource extends Component {

    state = {
        previewmode:'json',//can be json, xml, htmlembedded,
        data:null
    }


    componentDidMount(){
        const json = new AsyncJsonInterface();
        json.parse(this.props.responseBody)
            .then((data)=> {
                return json.stringify(data, null, 2)
            }).then((data)=>{
                this.setState({data});
            });
    }

    render() {
        let mode = undefined;
        let body = this.props.responseBody;
        const {previewMode} = this.props;
        switch (previewMode) {
            case "json":
                mode = {name:'javascript', mode:'json'};
                try {
                    body = JSON.stringify(JSON.parse(body), null, 2);
                }catch(e){
                    mode = "xml"
                }
                break;
            case "xml":
                mode = "xml";
                break;
            case "html":
                mode = "htmlembedded";
                break;
            default:
                mode = undefined
        }
        return (
            <div className={"w-full h-16"}>
                <CodeMirror options={{
                    mode,
                    lineWrapping:true,
                    lineNumbers:true,
                    readOnly:true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                }} value={body}  />
            </div>
        );
    }
}


PreviewSource.propTypes = {
    previewMode: PropTypes.oneOf(['json','xml','html', 'raw'])
}
