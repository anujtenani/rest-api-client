import React, {Component} from 'react';
import {connect} from 'react-redux';
import PreviewIFrame from "./PreviewIFrame";

class PreviewVisualHtml extends Component {

    render() {
        return (
            <div className={"preview-height overflow-scroll"}>
                <PreviewIFrame html={this.props.responseBody} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(PreviewVisualHtml);
