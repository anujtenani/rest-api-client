import React, {Component} from 'react';
import CodeMirror from "react-codemirror";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import PropTypes from 'prop-types';

class SocketResponseView extends Component {
    render() {
        return (
            <div className={"bg-orange-lighter rounded my-2 p-2"}>
            <small>Received</small>
            <CodeMirror options={{
                mode:{name:'javascript', mode:'json'},
                lineWrapping:true,
                lineNumbers:true,
                readOnly:true,
                viewportMargin:Infinity
            }} defaultValue={this.props.value} />
            </div>
        );
    }
}

SocketResponseView.propTypes = {
    value: PropTypes.string.isRequired
}

export default SocketResponseView;
