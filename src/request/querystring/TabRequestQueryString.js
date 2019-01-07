import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import QueryStringContainer from "./QueryStringContainer";

class TabRequestQueryString extends Component {
    render() {
        const {requestId} = this.props;
        return (
            <ExpandablePanel title={"URL"}>
                <QueryStringContainer requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(TabRequestQueryString);
