import React from 'react';
import CodeMirror from "react-codemirror";
import 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/placeholder'
import PropTypes from 'prop-types';


class BaseInput extends React.PureComponent{

    state = {
        value:undefined
    }

    onChange = (value)=>{
        this.setState({value})
    }

    handleFocusChange = (focused)=>{
        if(!focused && this.state.value !== undefined) this.props.onBlur(this.state.value)
    }


    handleRef = (ref)=>{
        if(!ref) return;
        this.ref = ref;
        if(this.ref.getCodeMirror()) {
            this.ref.getCodeMirror().addKeyMap({
                "Esc": (cm) => {
                    cm.getInputField().blur()
                }
            })
        }
    }

    render(){
        const {placeholder, defaultValue, mode, options} = this.props
        return  <CodeMirror
                    ref = {this.handleRef}
                    options={
                        {
                            mode,
                            lineWrapping:true,
                            lineNumbers:false,
                            autoCloseBrackets:true,
                            viewportMargin:Infinity,
                            placeholder,
                            ...options

                        }
                    }
                    value={this.state.value}
                    onChange={this.onChange}
                    onFocusChange={this.handleFocusChange}
                    defaultValue={defaultValue} />
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
