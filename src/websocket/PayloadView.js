import React, {Component} from 'react';
import CodeMirror from "react-codemirror";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import PropTypes from 'prop-types';


class PayloadView extends Component {
    render() {
        return (
            <CodeMirror options={{
                mode:{name:'javascript', mode:'json'},
                lineWrapping:true,
                lineNumbers:true,
                readOnly:true,
                viewportMargin:Infinity
            }} defaultValue={this.props.value} />
        );
    }
}

PayloadView.propTypes = {
    value: PropTypes.string.isRequired
}

export default PayloadView;
