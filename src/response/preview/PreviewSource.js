import React, {Component} from 'react';
import CodeMirror from 'react-codemirror';
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
import AsyncJsonInterface from "../../helpers/AsyncJsonInterface";


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
        console.log('rendering');
        let mode = undefined;
        let body = this.props.responseBody;
        const {previewMode} = this.props;
        switch (previewMode) {
            case "json":
                mode = {name:'javascript', mode:'json'};
//                body = JSON.stringify(JSON.parse(body), null, 2);
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


        if(this.state.data)
        return (
            <div className={"w-full h-16"}>
                <CodeMirror options={{
                    mode,
                    lineWrapping:true,
                    lineNumbers:true,
                    readOnly:true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                }} value={this.state.data}  />
            </div>
        );
        else return null;
    }
}


PreviewSource.propTypes = {
    previewMode: PropTypes.oneOf(['json','xml','html', 'raw'])
}
