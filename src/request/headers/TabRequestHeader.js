import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import HeaderParent from "./HeaderParent";

class TabRequestHeader extends Component {
    render() {
        const {requestId} = this.props;
        return (
            <ExpandablePanel title={"Headers"}>
                <HeaderParent requestId={requestId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(TabRequestHeader);
