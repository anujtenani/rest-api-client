import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";

class TabResponseTiming extends Component {

    render() {
        const {wait, dns, tcp, firstByte, download, total} = this.props.timing;
        return (
            <div>
                <ExpandablePanel title={"Timing"}>
                    <div className={"ml-2"}>
                        <LineItem title={"DNS Resolution"} value={`${Math.round(dns)} ms`} />
                        <LineItem title={"Connection"} value={`${Math.round(tcp)} ms`} />
                        <LineItem title={"First Byte"} value={`${Math.round(firstByte)} ms`} />
                        <LineItem title={"Total"} value={`${Math.round(total)} ms`} />
                    </div>
                </ExpandablePanel>
            </div>
        );
    }
}


function LineItem({title, value}){
    return <p className={"p-1"}>
        <span className={"text-sm secondary-text"}>{title}: </span>
        <span>{value}</span>
    </p>
}


function mapStateToProps(state, props) {
    const {requestId, historyId} = props;
    return {
            timing :state.requests.byId[requestId].history.byId[historyId].timings
    }
}

export default connect(
    mapStateToProps,
)(TabResponseTiming);
