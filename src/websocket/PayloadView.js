import React, {Component} from 'react';
import {UnControlled as CodeMirror} from "react-codemirror2";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import PropTypes from 'prop-types';


class PayloadView extends Component {
    render() {
        return (
            <div className={"bg-grey-lighter rounded my-2 p-2"}>
                <small>Sent</small>
                <CodeMirror options={{
                    mode:{name:'javascript', mode:'json'},
                    lineWrapping:true,
                    lineNumbers:true,
                    readOnly:true,
                    viewportMargin:Infinity
                }} value={this.props.value} />
            </div>
        );
    }
}

PayloadView.propTypes = {
    value: PropTypes.string.isRequired
}

export default PayloadView;
