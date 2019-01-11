import React from 'react';
import 'codemirror/mode/markdown/markdown';
import BaseInput from "./BaseInput";
import PropTypes from 'prop-types';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/lint/javascript-lint';
import jsonlint from 'jsonlint-mod';
import { JSHINT } from 'jshint';

window.JSHINT = JSHINT
window.jsonlint = jsonlint;

export default class JavascriptInput extends React.PureComponent{

    render(){
        return  <BaseInput {...this.props} mode={{name:'javascript',json:true}} options={{lint:true, lineNumbers:true, gutters: ["CodeMirror-lint-markers"], ...this.props.options}}/>
    }
}

JavascriptInput.propTypes = {
    onBlur: PropTypes.func,
    defaultValue: PropTypes.string.isRequired,
    options: PropTypes.object
}

JavascriptInput.defaultProps = {
    options:{}
}
