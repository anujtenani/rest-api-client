import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import QueryStringContainer from "./QueryStringContainer";

class TabRequestQueryString extends Component {
    render() {
        const {requestId, defaultState} = this.props;
        return (
            <ExpandablePanel title={"URL"} defaultState={defaultState}>
                <QueryStringContainer requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const {path, qs} = state.requests.byId[requestId];
    const hasPath = path && path.allIds && path.allIds.length > 0;
    const hasQuery = qs && qs.allIds && qs.allIds.length > 0;
    return {
        defaultState: hasPath || hasQuery ? "open" : "close"
    };
}

export default connect(
    mapStateToProps,
)(TabRequestQueryString);
