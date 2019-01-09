import React from 'react';
import {UnControlled as CodeMirror} from "react-codemirror2";
import 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/placeholder'
import PropTypes from 'prop-types';


class BaseInput extends React.PureComponent{

    handleBlur = (editor, event)=>{
        if(editor.getValue() !== undefined) this.props.onBlur(editor.getValue())
    }


    handleRef = (editor)=>{
        console.log('editor did attach');
        if(editor) {
            console.log('adding key map');
            editor.addKeyMap({
                "Esc": (cm) => {
                    cm.getInputField().blur()
                }
            })
        }
    };

    render(){
        const {placeholder, defaultValue, mode, options} = this.props;
        return  <CodeMirror
                    editorDidAttach={this.handleRef}
                    options={
                        {
                            mode,
                            lineWrapping:true,
                            lineNumbers:false,
                            autoCloseBrackets:true,
                            placeholder,
                            ...options

                        }
                    }
                    style={{height:'auto'}}
                    onBlur={this.handleBlur}
                    value={defaultValue} />
    }
}

BaseInput.propTypes = {
    onBlur: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
    options: PropTypes.object,
    mode: PropTypes.string.isRequired,
    placeholder: PropTypes.string
}


BaseInput.defaultProps = {
    options:{}
}

export default BaseInput
