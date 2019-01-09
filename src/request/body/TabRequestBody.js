import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import RequestBody from './index'
class TabRequestBody extends Component {
    render() {
        const {requestId, bodyType, numItems} = this.props;
        const defaultOpen = bodyType !== "nobody" ? "open" : "close";
        return (
            <ExpandablePanel title={<p>Body{numItems ? <span className={"tag--counter"}>{numItems}</span> : null }</p>} defaultState={defaultOpen}>
                <RequestBody requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}



function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        bodyType: state.requests.byId[requestId].body.bodyType,
        numItems: state.requests.byId[requestId].body.allIds.length
    };
}

export default connect(
    mapStateToProps,
)(TabRequestBody);
