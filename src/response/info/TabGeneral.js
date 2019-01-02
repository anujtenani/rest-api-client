import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";

class TabGeneral extends Component {

    render() {
        const {href, remoteAddress, remotePort, method, statusCode} = this.props;
        return (
            <div>
                <ExpandablePanel title={"General"}>
                    <div className={"ml-2"}>
                        <LineItem title={"Request URL"} value={href} />
                        <LineItem title={"Request Method"} value={method} />
                        <LineItem title={"Status Code"} value={statusCode} />
                    </div>
                </ExpandablePanel>
            </div>
        );
    }
}

function TimingCard({timingStart, dns, tcp, firstByte, download, total}){
    return <div>
        <h3 className={"pl-2 pb-1 border-b primary-border"}>Timing</h3>
        <TimingItem name={"DNS Resolution"} value={`${dns} ms`}/>
        <TimingItem name={"Connection Time"} value={`${tcp} ms`}/>
        <TimingItem name={"First Byte"} value={`${firstByte} ms`}/>
        <TimingItem name={"Download"} value={`${download} ms`}/>
        <TimingItem name={"Total Time"} value={`${total} ms`}/>
    </div>
}

function TimingItem({name, value}){
    return  <div className={"flex flex-row p-1 border-b primary-border"}>
        <p className={"flex-1 p-1"}>{name}</p>
        <p className={"flex-1 p-1"}>{value}</p>
    </div>
}


function LineItem({title, value}){
    return <p className={"p-1"}>
        <span className={"text-sm secondary-text"}>{title}: </span>
        <span>{value}</span>
    </p>
}


function mapStateToProps(state, props) {
    const {requestId, historyId} = props;
    const history = state.requests.byId[requestId].history.byId[historyId]
        return {
            href: history.href || '',
            method: history.method || '',
            statusCode: history.statusCode || '',
            remoteAddress: history.remoteAddress || '',
            remotePort: history.remotePort || ''
        }
}

export default connect(
    mapStateToProps,
)(TabGeneral);
