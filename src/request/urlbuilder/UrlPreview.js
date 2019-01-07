import React, {Component} from 'react';
import {connect} from 'react-redux';
import {buildUrlFromRequestState} from "../../helpers/func";

class UrlPreview extends Component {
    render() {
        return (
            <div className={"mb-2 border primary-border rounded p-2"}>
                <p>{this.props.url}</p>
            </div>
        );
    }
}

function mapStateToProps(state,props) {
    const {requestId} = props;
    const request = state.requests.byId[requestId];
    const qs = request.qs;
    const url = request.url;
    const path = request.path;
    console.log(url, qs, path);
    return {
        url: buildUrlFromRequestState(url, qs, path),
    };
}

export default connect(
    mapStateToProps,
)(UrlPreview);
