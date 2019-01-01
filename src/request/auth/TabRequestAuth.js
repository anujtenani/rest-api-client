import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import AuthComponent from "./index";

class TabRequestAuth extends Component {
    render() {
        const {requestId} = this.props;
        return (
            <ExpandablePanel title={"Auth"}>
                <AuthComponent requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(TabRequestAuth);
