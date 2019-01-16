import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import CommentContainer from "./CommentContainer";

class TabRequestComment extends Component {
    render() {
        const {requestId, defaultState} = this.props;
        return (
            <ExpandablePanel title={"Description"} defaultState={defaultState}>
                <CommentContainer requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        defaultState: state.requests.byId[requestId].comment ? "open" : "close"
    };
}

export default connect(
    mapStateToProps,
)(TabRequestComment);
