import React from 'react';
import 'codemirror/mode/markdown/markdown';
import BaseInput from "./BaseInput";
import PropTypes from 'prop-types';

export default class MarkdownInput extends React.PureComponent{

    render(){
        return  <BaseInput {...this.props} mode={"markdown"}/>
    }
}

MarkdownInput.propTypes = {
    onBlur: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired
}
