import React, {Component} from 'react';

var CodeMirror = require('react-codemirror');
require('codemirror/mode/htmlembedded/htmlembedded');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');
require('../../css/codemirror.css');

export default class PreviewSourceHtml extends Component {

    state = {
        previewmode:'json'
    }


    render() {
        return (
           <div className={"w-full"}>
            <CodeMirror options={{
                mode:'htmlembedded',
                readOnly:true,
                lineWrapping:true,
                viewportMargin:Infinity
            }} value={this.props.responseBody}/>
            </div>
        );
    }
}

