import React, {Component} from 'react';
import {connect} from 'react-redux';
import ResponseError from "./ResponseError";
import ResponseSuccess from "./ResponseSuccess";

class RenderResponsePage extends Component {
    render() {
        const {error, requestId, historyId} = this.props;
        if(error){
            return <ResponseError requestId={requestId} historyId={historyId} />
        }else{
            return <ResponseSuccess requestId={requestId} historyId={historyId} />
        }
    }
}

function mapStateToProps(state, props) {
    const {requestId, historyId}  = props;
    return {
        ...state.requests.byId[requestId].history.byId[historyId]
    };
}

export default connect(
    mapStateToProps,
)(RenderResponsePage);
