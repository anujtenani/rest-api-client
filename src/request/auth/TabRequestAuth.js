import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import AuthComponent from "./index";

class TabRequestAuth extends Component {
    render() {
        const {requestId, authType} = this.props;
        const defaultOpen = authType === "none" ? "close" : "open";
        return (
            <ExpandablePanel title={"Auth"} defaultState={defaultOpen}>
                <AuthComponent requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const auth = state.requests.byId[requestId].auth;
    return {
        authType: auth ? auth.authType : 'none'
    };
}

export default connect(
    mapStateToProps,
)(TabRequestAuth);
