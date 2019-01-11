import React from 'react';
import BaseInput from "./BaseInput";
import PropTypes from 'prop-types';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/xml/xml';

export default class XmlInput extends React.PureComponent{

    render(){
        return  <BaseInput {...this.props} mode={"xml"} options={{lineNumbers:true, ...this.props.options}}/>
    }
}

XmlInput.propTypes = {
    onBlur: PropTypes.func,
    defaultValue: PropTypes.string.isRequired,
    options: PropTypes.object
}

XmlInput.defaultProps = {
    options:{}
}
