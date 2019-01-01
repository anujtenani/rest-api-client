import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from "../components/spinner";
import {actionCancelRequestExecution} from "../redux/requestActions";

class RequestRunningOverlay extends Component {
    render() {
        return (
            <div className={"flex flex-col items-center h-48 w-full justify-center"}>
                <Spinner/>
                <button onClick={this.props.cancelRequestExecution} className={"primary-button"}>Cancel Request</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        cancelRequestExecution:()=>dispatch(actionCancelRequestExecution(requestId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RequestRunningOverlay);
