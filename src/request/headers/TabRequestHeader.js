import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import HeaderParent from "./HeaderParent";

class TabRequestHeader extends Component {
    render() {
        const {requestId, defaultState, numItems} = this.props;
        return (
            <ExpandablePanel title={<p>Headers{numItems ? <span className={"tag--counter"}>{numItems}</span> : null }</p>} defaultState={defaultState}>
                <HeaderParent requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const {headers} = state.requests.byId[requestId];
    const numItems = headers && headers.allIds ? headers.allIds.length : 0;
    return {
        defaultState: numItems ? "open" : "close",
        numItems
    };
}

export default connect(
    mapStateToProps,
)(TabRequestHeader);
